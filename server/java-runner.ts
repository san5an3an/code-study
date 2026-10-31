// 임시 폴더에 예제 코드를 복사해 javac 로 컴파일하고 java 로 실행
import { cp, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { exec, LIMITS } from './code-exec.ts';
import { parseJavacErrors } from './java-diagnostics.ts';
import { javaSnippetFile } from './java-snippet.ts';
import type {
  CheckResponse,
  CodeFile,
  SnippetRunResponse,
  RunRequest,
  RunResponse,
} from '../src/app/core/run-api.ts';

// 임시 폴더에 강의 코드 전체를 복사하고 고친 파일만 바꿔 써서 javac 로 컴파일함. 끝나면 work 폴더 안의 out 에 class 파일이 남음
async function compileJava(
  req: Pick<RunRequest, 'file' | 'source'>,
  codeDir: string,
  files: CodeFile[],
  work: string,
) {
  const src = path.join(work, 'src');
  await cp(codeDir, src, { recursive: true });
  await writeFile(path.join(src, req.file), req.source);
  const names = files.map((f) => f.file);
  return exec(
    'javac',
    ['-encoding', 'UTF-8', '-d', path.join(work, 'out'), ...names],
    src,
    LIMITS.compileMs,
  );
}

export async function runJava(
  req: RunRequest,
  codeDir: string,
  files: CodeFile[],
): Promise<RunResponse> {
  const work = await mkdtemp(path.join(tmpdir(), 'code-study-run-'));
  try {
    const compile = await compileJava(req, codeDir, files, work);
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
        path.join(work, 'out'),
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

// 실행하지 않고 컴파일만 해 보고 에러 위치를 돌려줌. 같은 강의의 다른 파일에서 난 에러도 file 로 구분해 같이 돌려줌
export async function checkJava(
  req: Pick<RunRequest, 'file' | 'source'>,
  codeDir: string,
  files: CodeFile[],
): Promise<CheckResponse> {
  const work = await mkdtemp(path.join(tmpdir(), 'code-study-check-'));
  try {
    const compile = await compileJava(req, codeDir, files, work);
    if (compile.timedOut) return { ok: false, error: '컴파일이 너무 오래 걸려 멈췄어요' };
    return { ok: true, diagnostics: parseJavacErrors(compile.stderr) };
  } finally {
    await rm(work, { recursive: true, force: true });
  }
}

// 코드 한 덩어리를 work 폴더에서 혼자 컴파일함. 감싸느라 늘어난 줄은 빼서 사용자가 쓴 줄 번호로 돌려줌
async function compileSnippet(source: string, work: string) {
  const snippet = javaSnippetFile(source);
  await writeFile(path.join(work, snippet.file), snippet.code);
  const compile = await exec(
    'javac',
    ['-encoding', 'UTF-8', '-d', path.join(work, 'out'), snippet.file],
    work,
    LIMITS.compileMs,
  );
  // 감싼 줄에서 난 에러(예: 닫는 괄호가 모자람)는 사용자가 쓴 첫 줄이나 마지막 줄로 옮김
  const lastLine = source.split('\n').length;
  const diagnostics = parseJavacErrors(compile.stderr).map((d) => {
    const line = d.line - snippet.lineOffset;
    if (line < 1) return { ...d, line: 1, column: 0 };
    if (line > lastLine) return { ...d, line: lastLine, column: Number.MAX_SAFE_INTEGER };
    return { ...d, line };
  });
  return { className: snippet.mainClass, compile, diagnostics };
}

export async function checkJavaSnippet(source: string): Promise<CheckResponse> {
  const work = await mkdtemp(path.join(tmpdir(), 'code-study-snippet-'));
  try {
    const { compile, diagnostics } = await compileSnippet(source, work);
    if (compile.timedOut) return { ok: false, error: '컴파일이 너무 오래 걸려 멈췄어요' };
    return { ok: true, diagnostics };
  } finally {
    await rm(work, { recursive: true, force: true });
  }
}

// 퀴즈 답 채점용 실행. 입력 없이 돌리고, 답이 만든 파일은 work 폴더째 지움
export async function runJavaSnippet(source: string): Promise<SnippetRunResponse> {
  const work = await mkdtemp(path.join(tmpdir(), 'code-study-snippet-run-'));
  try {
    const { className, compile, diagnostics } = await compileSnippet(source, work);
    if (compile.timedOut) return { ok: false, error: '컴파일이 너무 오래 걸려 멈췄어요' };
    if (compile.exitCode !== 0) return { ok: true, diagnostics, run: null };
    const run = await exec(
      'java',
      [
        `-Xmx${LIMITS.javaHeap}`,
        '-Dfile.encoding=UTF-8',
        '-Dstdout.encoding=UTF-8',
        '-Dstderr.encoding=UTF-8',
        '-cp',
        path.join(work, 'out'),
        className,
      ],
      work,
      LIMITS.runMs,
    );
    return { ok: true, diagnostics, run };
  } finally {
    await rm(work, { recursive: true, force: true });
  }
}
