import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { test } from 'node:test';

import { validate, validateSnippet } from './code-exec.ts';
import { checkPython, checkPythonSnippet, runPython, runPythonSnippet } from './python-runner.ts';

const CONTENT = path.resolve(import.meta.dirname, '../test-fixtures/content');

async function run(file: string, source: string, stdin = '') {
  const v = await validate({ course: 'python', lectureId: '08', file, source, stdin }, CONTENT);
  return runPython(v.req);
}

test('예제 코드를 고치지 않고 돌리면 자료 가져오기 때 미리 돌린 결과와 같음', async () => {
  const dir = path.join(CONTENT, 'python/08');
  const files = JSON.parse(await readFile(path.join(dir, 'code.json'), 'utf8')) as {
    file: string;
    run: { stdout: string };
  }[];
  for (const f of files) {
    const source = await readFile(path.join(dir, 'code', f.file), 'utf8');
    const r = await run(f.file, source);
    assert.ok(r.ok);
    assert.equal(r.compile.exitCode, 0);
    assert.equal(r.run?.stdout, f.run.stdout, f.file);
  }
});

test('사용자가 고친 코드가 실행되고 출력의 한글이 깨지지 않음', async () => {
  const r = await run('string_basics.py', 'print("안녕 파이썬")\n');
  assert.ok(r.ok);
  assert.equal(r.run?.stdout, '안녕 파이썬\n');
  assert.equal(r.run?.exitCode, 0);
});

test('입력값(stdin)을 프로그램에 넘김', async () => {
  const r = await run('string_basics.py', 'name = input()\nprint(name * 2)\n', '하나\n');
  assert.ok(r.ok);
  assert.equal(r.run?.stdout, '하나하나\n');
});

test('문법 에러가 나면 실행 결과의 stderr 에 SyntaxError 가 나오고 끝 코드가 0 이 아님', async () => {
  const r = await run('string_basics.py', 'print("a"\n');
  assert.ok(r.ok);
  assert.notEqual(r.run?.exitCode, 0);
  assert.match(r.run?.stderr ?? '', /SyntaxError/);
});

test('실행이 5초를 넘기면 멈추고 시간 초과로 알림', async () => {
  const r = await run('string_basics.py', 'while True:\n    pass\n');
  assert.ok(r.ok);
  assert.equal(r.run?.timedOut, true);
});

test('출력이 64KB를 넘으면 그 순간 실행을 멈춤', async () => {
  const r = await run('string_basics.py', 'while True:\n    print("x" * 100)\n');
  assert.ok(r.ok);
  assert.equal(r.run?.timedOut, false);
  assert.match(r.run?.stdout ?? '', /64KB를 넘어 멈췄어요/);
});

test('메모리를 256MB 넘게 쓰면 멈추고 그 이유를 stderr 에 알림', async () => {
  const r = await run('string_basics.py', 'x = []\nwhile True:\n    x.append("a" * 1000)\n');
  assert.ok(r.ok);
  assert.equal(r.run?.timedOut, false);
  assert.equal(r.run?.exitCode, null);
  assert.match(r.run?.stderr ?? '', /메모리를 256MB 넘게 써서 멈췄어요/);
});

test('256MB 아래로 쓰는 코드는 메모리 때문에 멈추지 않음', async () => {
  const r = await run(
    'string_basics.py',
    'b = bytearray(100 * 1024 * 1024)\nfor i in range(0, len(b), 4096):\n    b[i] = 1\nprint("끝")\n',
  );
  assert.ok(r.ok);
  assert.equal(r.run?.exitCode, 0);
  assert.equal(r.run?.stdout, '끝\n');
});

test('격리 모드(-I)로 돌려 환경 변수와 사용자 패키지 폴더를 읽지 않음', async () => {
  const r = await run('string_basics.py', 'import sys\nprint(sys.flags.isolated)\n');
  assert.ok(r.ok);
  assert.equal(r.run?.stdout, '1\n');
});

test('오타 검사: 고치지 않은 예제는 에러가 없음', async () => {
  const source = await readFile(path.join(CONTENT, 'python/08/code/escape_chars.py'), 'utf8');
  const r = await checkPython({ file: 'escape_chars.py', source });
  assert.deepEqual(r, { ok: true, diagnostics: [] });
});

test('오타 검사: 문법 에러를 줄과 칸, 파이썬 문구로 돌려주고 실행은 하지 않음', async () => {
  const r = await checkPython({
    file: 'string_basics.py',
    source: 'print("시작")\nif True\n    print("x")\n',
  });
  assert.ok(r.ok);
  assert.equal(r.diagnostics.length, 1);
  const [d] = r.diagnostics;
  assert.equal(d.file, 'string_basics.py');
  assert.equal(d.line, 2);
  assert.equal(d.column, 7);
  assert.equal(d.severity, 'error');
  assert.match(d.message, /^SyntaxError: expected ':'/);
});

test('오타 검사: 들여쓰기 에러도 문법 에러로 돌려줌', async () => {
  const r = await checkPython({ file: 'a.py', source: 'if True:\nprint(1)\n' });
  assert.ok(r.ok);
  assert.equal(r.diagnostics[0].line, 2);
  assert.match(r.diagnostics[0].message, /^IndentationError/);
});

test('오타 검사: 괄호를 안 닫으면 파일 끝이 아니라 여는 괄호 자리를 가리킴', async () => {
  const r = await checkPython({ file: 'a.py', source: 'x = (1 +\n' });
  assert.ok(r.ok);
  assert.deepEqual(
    r.diagnostics.map((d) => [d.line, d.column, d.message]),
    [[1, 4, "SyntaxError: '(' was never closed"]],
  );
});

test('오타 검사: 모르는 이스케이프 같은 SyntaxWarning 은 경고로 돌려줌', async () => {
  const r = await checkPython({ file: 'a.py', source: 'print(1)\nprint("C:\\path")\n' });
  assert.ok(r.ok);
  assert.deepEqual(
    r.diagnostics.map((d) => [d.line, d.severity]),
    [[2, 'warning']],
  );
  assert.match(r.diagnostics[0].message, /^SyntaxWarning: .*\\p/);
});

test('오타 검사: 없는 변수는 실행해야 알 수 있어서 검사에서는 에러가 없음', async () => {
  const r = await checkPython({ file: 'a.py', source: 'print(nope)\n' });
  assert.deepEqual(r, { ok: true, diagnostics: [] });
});

test('퀴즈 답 검사: 과목이 python 인 요청을 받음', () => {
  assert.deepEqual(validateSnippet({ course: 'python', source: 'print(1)' }), {
    course: 'python',
    source: 'print(1)',
  });
});

test('퀴즈 답 검사: 에러 위치를 사용자가 쓴 줄 번호로 돌려줌', async () => {
  const r = await checkPythonSnippet('a = 1\nprint(a +)\n');
  assert.ok(r.ok);
  assert.equal(r.diagnostics[0].line, 2);
  assert.equal(r.diagnostics[0].severity, 'error');
});

test('퀴즈 답 실행: 출력의 한글이 깨지지 않음', async () => {
  const r = await runPythonSnippet('for i in range(3):\n    print(f"{i}번")\n');
  assert.ok(r.ok);
  assert.deepEqual(r.diagnostics, []);
  assert.equal(r.run?.stdout, '0번\n1번\n2번\n');
});

test('퀴즈 답 실행: 문법 에러면 실행하지 않고 에러 위치를 돌려줌', async () => {
  const r = await runPythonSnippet('print("a"\n');
  assert.ok(r.ok);
  assert.equal(r.run, null);
  assert.equal(r.diagnostics[0].severity, 'error');
});

test('퀴즈 답 실행: 경고만 있으면 실행하고 경고도 같이 돌려줌', async () => {
  const r = await runPythonSnippet('print("a\\pb")\n');
  assert.ok(r.ok);
  assert.equal(r.run?.stdout, 'a\\pb\n');
  assert.deepEqual(
    r.diagnostics.map((d) => d.severity),
    ['warning'],
  );
});

test('퀴즈 답 실행: 실행 중 에러는 run 의 stderr 와 끝 코드로 돌려줌', async () => {
  const r = await runPythonSnippet('print(1)\nprint(nope)\n');
  assert.ok(r.ok);
  assert.equal(r.run?.stdout, '1\n');
  assert.equal(r.run?.exitCode, 1);
  assert.match(r.run?.stderr ?? '', /NameError/);
});

test('퀴즈 답 실행: 5초를 넘기면 멈추고 시간 초과로 알림', async () => {
  const r = await runPythonSnippet('while True:\n    pass\n');
  assert.ok(r.ok);
  assert.equal(r.run?.timedOut, true);
});

test('퀴즈 답 실행: 답이 만든 파일은 지금 폴더에 남지 않음', async () => {
  const name = 'code-study-python-snippet-test.txt';
  const r = await runPythonSnippet(`open("${name}", "w").write("x")\nprint("ok")\n`);
  assert.ok(r.ok);
  assert.equal(r.run?.stdout, 'ok\n');
  assert.equal(existsSync(name), false);
});
