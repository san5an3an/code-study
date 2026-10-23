// /api/run 처리. 검사 → 본문 읽기 → 줄 세우기 → 실행
import type { IncomingMessage, ServerResponse } from 'node:http';

import { LIMITS, RunRequestError, runJava, validate } from './java-runner.ts';
import { rejectReason } from './run-guard.ts';

const MAX_BODY_BYTES = LIMITS.sourceBytes + LIMITS.stdinBytes + 4096;
const MAX_CONCURRENT = 2;
// 탭 여러 개나 병렬 테스트에서 바로 거절하지 않게 8개까지 기다리게 함
const MAX_WAITING = 8;

// 개발 서버 앞단이 localhost 앱마다 붙이는 허락 헤더를 실행 API 응답에서는 지움
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
      // 사전 확인(OPTIONS)도 여기서 403 이라 허락 헤더를 내주지 않음
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
      const { req: runReq, codeDir, files } = await validate(body, contentDir);
      await acquire();
      acquired = true;
      send(res, 200, await runJava(runReq, codeDir, files));
    } catch (e) {
      if (e instanceof RunRequestError) send(res, 400, { ok: false, error: e.message });
      else send(res, 500, { ok: false, error: '서버에서 실행하다 문제가 생겼어요' });
    } finally {
      if (acquired) release();
    }
  };
}
