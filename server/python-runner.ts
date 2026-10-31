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
// -u 는 출력을 모아 두지 않음. 5초·메모리·출력 초과로 강제로 끄면 모아 둔 print 가 버려져서 씀(ADR-061)
export const PYTHON_ARGS = ['-X', 'utf8', '-B', '-I', '-u'];

// 퀴즈 답은 파일 이름이 없어서 이 이름으로 씀
export const SNIPPET_FILE = 'main.py';

// 파이썬은 컴파일 단계가 따로 없어서 실행 응답의 compile 은 늘 빈 성공. 문법 에러는 실행 결과의 stderr 에 나옴
const NO_COMPILE: CodeRun = { stdout: '', stderr: '', exitCode: 0, timedOut: false };

// 실행하지 않고 compile() 로 문법만 봄. 파이썬은 문법 에러를 한 번에 하나만 알려 주고, 없는 변수 같은 건 돌려야 나옴
// 빌드한 서버에서도 파일 경로를 찾을 필요가 없게 스크립트를 글로 넘김. String.raw 라 역슬래시가 그대로 파이썬에 감
// - 바이트로 compile 해서 실행할 때처럼 coding 선언을 따름(글자로 넘기면 선언을 무시해 검사는 통과하고 실행은 에러, ADR-061)
// - 파이썬 칸 번호는 글자(코드 포인트) 단위라 편집기가 쓰는 UTF-16 단위로 바꿈(이모지는 UTF-16 으로 2칸)
// - SyntaxWarning 은 칸 번호가 없어서, 문구에 나온 "\p" 같은 글자를 그 줄에서 찾아 칸으로 씀. 못 찾으면 줄 맨 앞
const CHECK_SCRIPT = String.raw`
import json, re, sys, warnings
data = sys.stdin.buffer.read()
lines = data.decode('utf-8', 'replace').split('\n')
def utf16_column(lineno, cp):
    text = lines[lineno - 1] if 1 <= lineno <= len(lines) else ''
    return len(text[:max(0, min(cp, len(text)))].encode('utf-16-le')) // 2
found = []
with warnings.catch_warnings(record=True) as caught:
    warnings.simplefilter('always')
    try:
        compile(data, sys.argv[1], 'exec', dont_inherit=True)
    except SyntaxError as e:
        line = e.lineno if e.lineno and e.lineno > 0 else 1
        found.append({'line': line, 'column': utf16_column(line, (e.offset or 1) - 1), 'severity': 'error', 'message': type(e).__name__ + ': ' + str(e.msg)})
    except ValueError as e:
        found.append({'line': 1, 'column': 0, 'severity': 'error', 'message': type(e).__name__ + ': ' + str(e)})
for w in caught:
    if issubclass(w.category, SyntaxWarning):
        text = lines[w.lineno - 1] if 1 <= w.lineno <= len(lines) else ''
        m = re.search(r'"(\\.)"', str(w.message))
        cp = max(text.find(m.group(1)), 0) if m else 0
        found.append({'line': w.lineno, 'column': utf16_column(w.lineno, cp), 'severity': 'warning', 'message': 'SyntaxWarning: ' + str(w.message)})
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
