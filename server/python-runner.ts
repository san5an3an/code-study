// 임시 폴더에 파이썬 코드를 써서 python3 로 실행하고, 실행 전에 문법만 검사함
import { mkdtemp, realpath, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { exec, LIMITS } from './code-exec.ts';
import type {
  CheckResponse,
  CodeDiagnostic,
  CodeRun,
  RunRequest,
  RunResponse,
  SnippetRunResponse,
} from '../src/app/core/run-api.ts';

// -I 는 작업 폴더 모듈을 안 읽음. 강의 예제는 다른 예제 파일을 import 하지 않아서 파일 하나씩 따로 돌림(ADR-060 실측)
const PYTHON_ARGS = ['-X', 'utf8', '-B', '-I'];

// 퀴즈 답은 파일 이름이 없어서 이 이름으로 씀
export const SNIPPET_FILE = 'main.py';

// 파이썬은 컴파일 단계가 따로 없어서 실행 응답의 compile 은 늘 빈 성공. 문법 에러는 실행 결과의 stderr 에 나옴
const NO_COMPILE: CodeRun = { stdout: '', stderr: '', exitCode: 0, timedOut: false };

// 실행하지 않고 compile() 로 문법만 봄. 파이썬은 문법 에러를 한 번에 하나만 알려 주고, 없는 변수 같은 건 돌려야 나옴
// 빌드한 서버에서도 파일 경로를 찾을 필요가 없게 스크립트를 글로 넘김
const CHECK_SCRIPT = `
import json, sys, warnings
source = sys.stdin.read()
found = []
with warnings.catch_warnings(record=True) as caught:
    warnings.simplefilter('always')
    try:
        compile(source, sys.argv[1], 'exec', dont_inherit=True)
    except SyntaxError as e:
        found.append({'line': e.lineno or 1, 'column': max((e.offset or 1) - 1, 0), 'severity': 'error', 'message': type(e).__name__ + ': ' + e.msg})
    except ValueError as e:
        found.append({'line': 1, 'column': 0, 'severity': 'error', 'message': type(e).__name__ + ': ' + str(e)})
for w in caught:
    if issubclass(w.category, SyntaxWarning):
        found.append({'line': w.lineno, 'column': 0, 'severity': 'warning', 'message': 'SyntaxWarning: ' + str(w.message)})
print(json.dumps(found))
`;

type Found = Omit<CodeDiagnostic, 'file'>;

async function checkSyntax(
  file: string,
  source: string,
): Promise<{ ok: true; diagnostics: CodeDiagnostic[] } | { ok: false; error: string }> {
  const work = await mkdtemp(path.join(tmpdir(), 'code-study-py-check-'));
  try {
    const proc = await exec(
      'python3',
      [...PYTHON_ARGS, '-c', CHECK_SCRIPT, file],
      work,
      LIMITS.compileMs,
      source,
    );
    if (proc.timedOut) return { ok: false, error: '문법 검사가 너무 오래 걸려 멈췄어요' };
    if (proc.exitCode !== 0) return { ok: false, error: '문법 검사를 하다 문제가 생겼어요' };
    const found = JSON.parse(proc.stdout) as Found[];
    const diagnostics = found.map((d) => ({ ...d, file })).sort((a, b) => a.line - b.line);
    return { ok: true, diagnostics };
  } finally {
    await rm(work, { recursive: true, force: true });
  }
}

// 코드를 임시 폴더에 써서 돌림. 답이 만든 파일은 work 폴더째 지움
async function runSource(file: string, source: string, stdin: string): Promise<CodeRun> {
  const work = await mkdtemp(path.join(tmpdir(), 'code-study-py-run-'));
  try {
    await writeFile(path.join(work, file), source);
    const run = await exec('python3', [...PYTHON_ARGS, file], work, LIMITS.runMs, stdin, true);
    // 파이썬은 에러 위치에 파일 전체 경로를 찍음. 임시 폴더 경로를 지워 파일 이름만 남김(맥은 /var 가 /private/var 의 바로가기라 둘 다)
    const real = await realpath(work);
    const stderr = run.stderr
      .replaceAll(`${real}${path.sep}`, '')
      .replaceAll(`${work}${path.sep}`, '');
    return { ...run, stderr };
  } finally {
    await rm(work, { recursive: true, force: true });
  }
}

export async function runPython(req: RunRequest): Promise<RunResponse> {
  return { ok: true, compile: NO_COMPILE, run: await runSource(req.file, req.source, req.stdin) };
}

export function checkPython(req: Pick<RunRequest, 'file' | 'source'>): Promise<CheckResponse> {
  return checkSyntax(req.file, req.source);
}

export function checkPythonSnippet(source: string): Promise<CheckResponse> {
  return checkSyntax(SNIPPET_FILE, source);
}

// 퀴즈 답 채점용 실행. 문법 에러가 있으면 자바의 컴파일 에러처럼 실행하지 않고 에러 위치만 돌려줌
export async function runPythonSnippet(source: string): Promise<SnippetRunResponse> {
  const check = await checkSyntax(SNIPPET_FILE, source);
  if (!check.ok) return check;
  if (check.diagnostics.some((d) => d.severity === 'error')) {
    return { ok: true, diagnostics: check.diagnostics, run: null };
  }
  return {
    ok: true,
    diagnostics: check.diagnostics,
    run: await runSource(SNIPPET_FILE, source, ''),
  };
}
