// 과목과 상관없이 쓰는 실행 도우미. 시간·출력 제한을 건 프로세스 실행과 요청 본문 검사
import { execFile, spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

import {
  COURSES,
  MEMORY_STOPPED,
  OUTPUT_STOPPED,
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
  // 바로 띄운 프로세스가 끝난 뒤 출력 통로가 닫히길 기다리는 시간. 묶음을 빠져나간 손주가 통로를 쥐고 있으면 이 시간 뒤 통로를 닫고 끝냄
  exitGraceMs: 500,
};

export class RunRequestError extends Error {}

type Proc = CodeRun & { truncated: boolean };

// 개발 서버가 FORCE_COLOR 를 물려주면 파이썬 3.13+ 이 에러에 색 코드를 섞어 찍음. NO_COLOR 를 주면 FORCE_COLOR 보다 먼저 봐서 꺼짐(3.14.7 실측)
function childEnv(): NodeJS.ProcessEnv {
  return { ...process.env, NO_COLOR: '1' };
}

// 프로세스 묶음 전체의 실제 메모리(RSS) 합을 KB 로 잼. 손주(subprocess, os.fork)까지 셈. 묶음이 이미 없으면 null
function groupRssKb(pgid: number): Promise<number | null> {
  return new Promise((resolve) => {
    execFile('ps', ['-o', 'rss=', '-g', String(pgid)], (err, out) => {
      const sizes = out
        .split('\n')
        .map((l) => Number(l.trim()))
        .filter((n) => Number.isFinite(n) && n > 0);
      resolve(err || sizes.length === 0 ? null : sizes.reduce((a, b) => a + b, 0));
    });
  });
}

// 따로 띄운 묶음은 서버와 같은 묶음이 아니라 서버가 받는 신호를 같이 못 받음. 서버가 끝날 때 살아 있는 묶음을 끔(신호로 바로 죽으면 못 끔)
const liveGroups = new Set<number>();
process.on('exit', () => {
  for (const pgid of liveGroups) {
    try {
      process.kill(-pgid, 'SIGKILL');
    } catch {
      // 이미 끝난 묶음
    }
  }
});

// 띄운 프로그램을 새 프로세스 묶음 대장으로 띄워, 멈출 때와 끝났을 때 손주까지 묶음째 끔(ADR-061)
// watchMemory 를 켜면 memoryPollMs 마다 묶음 메모리를 재고 memoryKb 를 넘으면 멈춤. 재는 사이에 한 번에 크게 잡으면 잠깐 넘칠 수 있음
// 남는 위험: os.setsid 등으로 묶음을 빠져나간 프로세스는 못 끔
export function exec(
  cmd: string,
  args: string[],
  cwd: string,
  timeoutMs: number,
  stdin = '',
  watchMemory = false,
): Promise<Proc> {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, {
      cwd,
      env: childEnv(),
      stdio: ['pipe', 'pipe', 'pipe'],
      detached: true,
    });
    if (child.pid !== undefined) liveGroups.add(child.pid);
    let ended = false;
    // 묶음째 끔. 묶음이 이미 없거나 못 만들었으면 바로 띄운 것만
    const killAll = () => {
      try {
        if (child.pid !== undefined) process.kill(-child.pid, 'SIGKILL');
      } catch {
        child.kill('SIGKILL');
      }
    };
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
        killAll();
      }
    };
    child.stdout.on('data', (c: Buffer) => take(c, 'out'));
    child.stderr.on('data', (c: Buffer) => take(c, 'err'));

    const timer = setTimeout(() => {
      timedOut = true;
      killAll();
    }, timeoutMs);

    // ps 가 느려도 재는 일이 겹치지 않게 하나씩. 끝난 뒤 늦게 온 결과로는 끄지 않음
    let measuring = false;
    const poll = watchMemory
      ? setInterval(async () => {
          if (measuring || ended || child.pid === undefined) return;
          measuring = true;
          const kb = await groupRssKb(child.pid);
          measuring = false;
          if (!ended && kb !== null && kb > LIMITS.memoryKb) {
            overMemory = true;
            killAll();
          }
        }, LIMITS.memoryPollMs)
      : undefined;

    let grace: ReturnType<typeof setTimeout> | undefined;
    // 바로 띄운 프로세스가 끝나면 남은 손주를 끄고, 그래도 통로가 안 닫히면 exitGraceMs 뒤 닫음
    child.on('exit', () => {
      ended = true;
      clearTimeout(timer);
      clearInterval(poll);
      killAll();
      grace = setTimeout(() => {
        child.stdout.destroy();
        child.stderr.destroy();
      }, LIMITS.exitGraceMs);
    });

    child.on('error', (e) => {
      ended = true;
      if (child.pid !== undefined) liveGroups.delete(child.pid);
      clearTimeout(timer);
      clearInterval(poll);
      clearTimeout(grace);
      resolve({ stdout, stderr: stderr + String(e), exitCode: null, timedOut, truncated });
    });
    child.on('close', (code) => {
      ended = true;
      if (child.pid !== undefined) liveGroups.delete(child.pid);
      clearTimeout(timer);
      clearInterval(poll);
      clearTimeout(grace);
      if (truncated) stdout += `\n${OUTPUT_STOPPED}`;
      if (overMemory)
        stderr += `${stderr && !stderr.endsWith('\n') ? '\n' : ''}${MEMORY_STOPPED}\n`;
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
