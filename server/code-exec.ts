// 과목과 상관없이 쓰는 실행 도우미. 시간·출력 제한을 건 프로세스 실행과 요청 본문 검사
import { execFile, spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

import {
  COURSES,
  type CodeFile,
  type SnippetCheckRequest,
  type CodeRun,
  type Course,
  type RunRequest,
} from '../src/app/core/run-api.ts';

export const LIMITS = {
  compileMs: 10_000,
  runMs: 5_000,
  outputBytes: 64 * 1024,
  sourceBytes: 64 * 1024,
  stdinBytes: 16 * 1024,
  javaHeap: '256m',
  // 파이썬은 -Xmx 같은 옵션이 없고 맥은 setrlimit 로 256MB 를 못 걸어서(ADR-060 실측) 서버가 재다가 끔
  memoryKb: 256 * 1024,
  memoryPollMs: 50,
};

export class RunRequestError extends Error {}

type Proc = CodeRun & { truncated: boolean };

// 프로세스의 실제 메모리(RSS) 크기를 KB 로 잼. 이미 끝난 프로세스면 null
function rssKb(pid: number): Promise<number | null> {
  return new Promise((resolve) => {
    execFile('ps', ['-o', 'rss=', '-p', String(pid)], (err, out) => {
      const kb = Number(out.trim());
      resolve(err || !Number.isFinite(kb) ? null : kb);
    });
  });
}

// watchMemory 를 켜면 memoryPollMs 마다 메모리를 재고 memoryKb 를 넘으면 멈춤. 재는 사이에 한 번에 크게 잡으면 잠깐 넘칠 수 있음
export function exec(
  cmd: string,
  args: string[],
  cwd: string,
  timeoutMs: number,
  stdin = '',
  watchMemory = false,
): Promise<Proc> {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { cwd, stdio: ['pipe', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    let size = 0;
    let timedOut = false;
    let truncated = false;
    let overMemory = false;

    const take = (chunk: Buffer, into: 'out' | 'err') => {
      if (truncated) return;
      const room = LIMITS.outputBytes - size;
      const text = chunk.subarray(0, Math.max(0, room)).toString('utf8');
      size += chunk.length;
      if (into === 'out') stdout += text;
      else stderr += text;
      // 끝없이 출력하는 코드가 메모리를 채우지 않도록 출력이 64KB 를 넘는 순간 실행을 멈춤
      if (size > LIMITS.outputBytes) {
        truncated = true;
        child.kill('SIGKILL');
      }
    };
    child.stdout.on('data', (c: Buffer) => take(c, 'out'));
    child.stderr.on('data', (c: Buffer) => take(c, 'err'));

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGKILL');
    }, timeoutMs);

    const poll = watchMemory
      ? setInterval(async () => {
          const kb = child.pid === undefined ? null : await rssKb(child.pid);
          if (kb !== null && kb > LIMITS.memoryKb && child.exitCode === null) {
            overMemory = true;
            child.kill('SIGKILL');
          }
        }, LIMITS.memoryPollMs)
      : undefined;

    child.on('error', (e) => {
      clearTimeout(timer);
      clearInterval(poll);
      resolve({ stdout, stderr: stderr + String(e), exitCode: null, timedOut, truncated });
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      clearInterval(poll);
      if (truncated) stdout += '\n…(출력이 64KB를 넘어 멈췄어요)';
      if (overMemory)
        stderr += `${stderr && !stderr.endsWith('\n') ? '\n' : ''}…(메모리를 256MB 넘게 써서 멈췄어요)\n`;
      resolve({ stdout, stderr, exitCode: code, timedOut, truncated });
    });

    // 입력을 다 읽기 전에 끝나는 프로그램에 입력을 쓰면 EPIPE 가 나므로 그 에러는 무시함
    child.stdin.on('error', () => {});
    child.stdin.end(stdin);
  });
}

function isCourse(value: unknown): value is Course {
  return COURSES.includes(value as Course);
}

// 과목, 강의 번호, 파일 이름은 강의 자료 목록에 있는 값만 받아 자료 폴더 밖 경로가 들어올 수 없게 함
// 컴파일만 해 보는 오타 검사는 main 없는 파일도 받으므로 requireMain 을 false 로 부름
export async function validate(
  body: unknown,
  contentDir: string,
  requireMain = true,
): Promise<{ req: RunRequest; codeDir: string; files: CodeFile[] }> {
  if (typeof body !== 'object' || body === null)
    throw new RunRequestError('본문이 JSON 객체가 아님');
  const { course, lectureId, file, source, stdin = '' } = body as Record<string, unknown>;
  if (!isCourse(course)) throw new RunRequestError('없는 과목');
  if (typeof lectureId !== 'string' || !/^\d{2}$/.test(lectureId)) {
    throw new RunRequestError('강의 번호가 이상함');
  }
  if (typeof file !== 'string' || typeof source !== 'string' || typeof stdin !== 'string') {
    throw new RunRequestError('file·source·stdin 은 글자여야 함');
  }
  if (Buffer.byteLength(source) > LIMITS.sourceBytes)
    throw new RunRequestError('코드가 64KB를 넘음');
  if (Buffer.byteLength(stdin) > LIMITS.stdinBytes) throw new RunRequestError('입력이 16KB를 넘음');

  const lectureDir = path.join(contentDir, course, lectureId);
  const listFile = path.join(lectureDir, 'code.json');
  if (!existsSync(listFile)) throw new RunRequestError('그 강의 코드가 없음 (자료 가져오기 필요)');
  const files = JSON.parse(await readFile(listFile, 'utf8')) as CodeFile[];
  const target = files.find((f) => f.file === file);
  if (!target) throw new RunRequestError('그 강의에 없는 파일');
  if (requireMain && !target.hasMain)
    throw new RunRequestError('main 이 없는 파일이라 혼자 실행할 수 없음');
  return {
    req: { course, lectureId, file, source, stdin },
    codeDir: path.join(lectureDir, 'code'),
    files,
  };
}

// 퀴즈 답 검사 요청은 과목과 코드만 받음. 강의 자료 폴더를 읽지 않으니 경로 검사는 필요 없음
export function validateSnippet(body: unknown): SnippetCheckRequest {
  if (typeof body !== 'object' || body === null)
    throw new RunRequestError('본문이 JSON 객체가 아님');
  const { course, source } = body as Record<string, unknown>;
  if (!isCourse(course)) throw new RunRequestError('없는 과목');
  if (typeof source !== 'string') throw new RunRequestError('source 는 글자여야 함');
  if (Buffer.byteLength(source) > LIMITS.sourceBytes)
    throw new RunRequestError('코드가 64KB를 넘음');
  return { course, source };
}
