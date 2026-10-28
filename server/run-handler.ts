// /api/run(실행), /api/check(컴파일·문법 검사만), /api/check-snippet(퀴즈 답 검사만), /api/run-snippet(퀴즈 답 실행) 요청 처리. 과목에 따라 자바·파이썬 실행기로 나눔. 보호 규칙 검사, 본문 읽기, 대기열에 넣기, 실행 순서로 진행. 네 주소가 대기열 하나를 같이 씀
import type { IncomingMessage, ServerResponse } from 'node:http';

import {
  CHECK_PATH,
  CHECK_SNIPPET_PATH,
  RUN_SNIPPET_PATH,
  type CheckResponse,
  type CodeFile,
  type Course,
  type RunRequest,
  type RunResponse,
  type SnippetRunResponse,
} from '../src/app/core/run-api.ts';
import { LIMITS, RunRequestError, validate, validateSnippet } from './code-exec.ts';
import { checkJava, checkJavaSnippet, runJava, runJavaSnippet } from './java-runner.ts';
import { checkPython, checkPythonSnippet, runPython, runPythonSnippet } from './python-runner.ts';
import { rejectReason } from './run-guard.ts';

const MAX_BODY_BYTES = LIMITS.sourceBytes + LIMITS.stdinBytes + 4096;
const MAX_CONCURRENT = 2;
// 브라우저 탭 여러 개나 병렬 테스트에서 몰린 요청을 바로 거절하지 않도록 8개까지 대기시킴
const MAX_WAITING = 8;

// 개발 서버(Vite)가 localhost 앱마다 붙이는 CORS 허용 헤더를 실행 API 응답에서는 지움
const CORS_HEADERS = [
  'access-control-allow-origin',
  'access-control-allow-credentials',
  'access-control-allow-methods',
  'access-control-allow-headers',
  'access-control-expose-headers',
  'access-control-max-age',
];

function send(res: ServerResponse, status: number, body: unknown) {
  for (const name of CORS_HEADERS) res.removeHeader(name);
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks: Buffer[] = [];
    req.on('data', (c: Buffer) => {
      size += c.length;
      if (size > MAX_BODY_BYTES) {
        reject(new RunRequestError('요청이 너무 큼'));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

type Runner = {
  run: (req: RunRequest, codeDir: string, files: CodeFile[]) => Promise<RunResponse>;
  check: (req: RunRequest, codeDir: string, files: CodeFile[]) => Promise<CheckResponse>;
  checkSnippet: (source: string) => Promise<CheckResponse>;
  runSnippet: (source: string) => Promise<SnippetRunResponse>;
};

// 과목마다 실행기 하나. 과목을 더하면 run-api 의 COURSES 와 이 표에 한 줄씩
const RUNNERS: Record<Course, Runner> = {
  java: {
    run: runJava,
    check: checkJava,
    checkSnippet: checkJavaSnippet,
    runSnippet: runJavaSnippet,
  },
  python: {
    run: runPython,
    check: checkPython,
    checkSnippet: checkPythonSnippet,
    runSnippet: runPythonSnippet,
  },
};

export function createRunHandler(contentDir: string) {
  let running = 0;
  const waiting: (() => void)[] = [];
  const acquire = async () => {
    if (running >= MAX_CONCURRENT) await new Promise<void>((resolve) => waiting.push(resolve));
    running++;
  };
  const release = () => {
    running--;
    waiting.shift()?.();
  };

  return async (req: IncomingMessage, res: ServerResponse) => {
    const reason = rejectReason(req, req.socket.localPort ?? 0);
    if (reason) {
      // CORS 사전 확인(OPTIONS) 요청도 여기서 403 으로 답해 허용 헤더를 내주지 않음
      send(res, 403, { ok: false, error: reason });
      return;
    }
    if (running >= MAX_CONCURRENT && waiting.length >= MAX_WAITING) {
      send(res, 429, {
        ok: false,
        error: '이미 실행 중인 코드가 많아요. 잠시 뒤에 다시 눌러 주세요.',
      });
      return;
    }
    let acquired = false;
    try {
      const raw = await readBody(req);
      let body: unknown;
      try {
        body = JSON.parse(raw);
      } catch {
        throw new RunRequestError('본문이 JSON 이 아님');
      }
      const pathname = new URL(req.url ?? '', 'http://localhost').pathname;
      if (pathname === CHECK_SNIPPET_PATH || pathname === RUN_SNIPPET_PATH) {
        const snippet = validateSnippet(body);
        await acquire();
        acquired = true;
        const runner = RUNNERS[snippet.course];
        send(
          res,
          200,
          pathname === RUN_SNIPPET_PATH
            ? await runner.runSnippet(snippet.source)
            : await runner.checkSnippet(snippet.source),
        );
        return;
      }
      const checkOnly = pathname === CHECK_PATH;
      const { req: runReq, codeDir, files } = await validate(body, contentDir, !checkOnly);
      await acquire();
      acquired = true;
      const runner = RUNNERS[runReq.course];
      send(
        res,
        200,
        checkOnly
          ? await runner.check(runReq, codeDir, files)
          : await runner.run(runReq, codeDir, files),
      );
    } catch (e) {
      if (e instanceof RunRequestError) send(res, 400, { ok: false, error: e.message });
      else send(res, 500, { ok: false, error: '서버에서 실행하다 문제가 생겼어요' });
    } finally {
      if (acquired) release();
    }
  };
}
