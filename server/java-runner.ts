// 임시 폴더에 예제 코드를 복사해 javac 로 컴파일하고 java 로 실행
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import {
  COURSES,
  type CodeFile,
  type CodeRun,
  type Course,
  type RunRequest,
  type RunResponse,
} from '../src/app/core/run-api.ts';

export const LIMITS = {
  compileMs: 10_000,
  runMs: 5_000,
  outputBytes: 64 * 1024,
  sourceBytes: 64 * 1024,
  stdinBytes: 16 * 1024,
  javaHeap: '256m',
};

export class RunRequestError extends Error {}

type Proc = CodeRun & { truncated: boolean };

function exec(
  cmd: string,
  args: string[],
  cwd: string,
  timeoutMs: number,
  stdin = '',
): Promise<Proc> {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { cwd, stdio: ['pipe', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    let size = 0;
    let timedOut = false;
    let truncated = false;

    const take = (chunk: Buffer, into: 'out' | 'err') => {
      if (truncated) return;
      const room = LIMITS.outputBytes - size;
      const text = chunk.subarray(0, Math.max(0, room)).toString('utf8');
      size += chunk.length;
      if (into === 'out') stdout += text;
      else stderr += text;
      // 무한 출력이 메모리를 채우지 않게 64KB 를 넘는 순간 멈춤
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

    child.on('error', (e) => {
      clearTimeout(timer);
      resolve({ stdout, stderr: stderr + String(e), exitCode: null, timedOut, truncated });
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      if (truncated) stdout += '\n…(출력이 64KB를 넘어 멈췄어요)';
      resolve({ stdout, stderr, exitCode: code, timedOut, truncated });
    });

    // 입력을 다 읽기 전에 끝나는 프로그램은 EPIPE 를 내므로 무시함
    child.stdin.on('error', () => {});
    child.stdin.end(stdin);
  });
}

function isCourse(value: unknown): value is Course {
  return COURSES.includes(value as Course);
}

// 과목·강의 번호·파일 이름은 목록에 있는 것만 받아 폴더 밖 경로가 들어올 수 없게 함
export async function validate(
  body: unknown,
  contentDir: string,
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
  if (!target.hasMain) throw new RunRequestError('main 이 없는 파일이라 혼자 실행할 수 없음');
  return {
    req: { course, lectureId, file, source, stdin },
    codeDir: path.join(lectureDir, 'code'),
    files,
  };
}

export async function runJava(
  req: RunRequest,
  codeDir: string,
  files: CodeFile[],
): Promise<RunResponse> {
  const work = await mkdtemp(path.join(tmpdir(), 'code-study-run-'));
  try {
    const src = path.join(work, 'src');
    const out = path.join(work, 'out');
    await cp(codeDir, src, { recursive: true });
    await writeFile(path.join(src, req.file), req.source);

    const names = files.map((f) => f.file);
    const compile = await exec(
      'javac',
      ['-encoding', 'UTF-8', '-d', out, ...names],
      src,
      LIMITS.compileMs,
    );
    if (compile.exitCode !== 0) return { ok: true, compile, run: null };

    const className = req.file.replace(/\.java$/, '');
    const run = await exec(
      'java',
      [
        `-Xmx${LIMITS.javaHeap}`,
        '-Dfile.encoding=UTF-8',
        '-Dstdout.encoding=UTF-8',
        '-Dstderr.encoding=UTF-8',
        '-cp',
        out,
        className,
      ],
      work,
      LIMITS.runMs,
      req.stdin,
    );
    return { ok: true, compile, run };
  } finally {
    await rm(work, { recursive: true, force: true });
  }
}
