import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { test } from 'node:test';

import { LIMITS, validate, validateSnippet } from './code-exec.ts';
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

test('256MB 아래로 쓰는 코드는 메모리를 여러 번 재도 멈추지 않음', async () => {
  // 메모리는 memoryPollMs 마다 재서, 그보다 몇 배 오래 100MB 를 쥐고 있어야 실제로 잰 뒤의 결과를 봄
  const holdSeconds = (LIMITS.memoryPollMs * 6) / 1000;
  const r = await run(
    'string_basics.py',
    `import time\nb = bytearray(100 * 1024 * 1024)\nfor i in range(0, len(b), 4096):\n    b[i] = 1\ntime.sleep(${holdSeconds})\nprint("끝")\n`,
  );
  assert.ok(r.ok);
  assert.equal(r.run?.exitCode, 0);
  assert.equal(r.run?.stdout, '끝\n');
});

test('5초를 넘겨 멈춰도 그 전에 print 한 출력은 남음(-u)', async () => {
  const r = await run('string_basics.py', 'print("앞")\nwhile True:\n    pass\n');
  assert.ok(r.ok);
  assert.equal(r.run?.timedOut, true);
  assert.equal(r.run?.stdout, '앞\n');
});

test('메모리를 넘겨 멈춰도 그 전에 print 한 출력은 남음(-u)', async () => {
  const r = await run(
    'string_basics.py',
    'print("앞")\nx = []\nwhile True:\n    x.append("a" * 1000)\n',
  );
  assert.ok(r.ok);
  assert.equal(r.run?.stdout, '앞\n');
  assert.match(r.run?.stderr ?? '', /메모리를 256MB 넘게 써서 멈췄어요/);
});

// 프로세스가 살아 있는지. 신호 0 은 아무것도 안 보내고 있는지만 봄
function alive(pid: number) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

test('subprocess 로 띄운 손주가 출력 통로를 쥐고 있어도 프로그램이 끝나면 바로 끝나고 손주도 꺼짐', async () => {
  const started = performance.now();
  const r = await run(
    'string_basics.py',
    'import subprocess\np = subprocess.Popen(["sleep", "30"])\nprint(p.pid)\n',
  );
  const ms = performance.now() - started;
  assert.ok(r.ok);
  assert.equal(r.run?.timedOut, false);
  assert.ok(ms < LIMITS.runMs, `${Math.round(ms)}ms 걸림`);
  assert.equal(alive(Number(r.run?.stdout.trim())), false);
});

test('os.fork 로 떼어 낸 손주는 출력 통로를 놓아도 프로그램이 끝날 때 같이 꺼짐', async () => {
  const r = await run(
    'string_basics.py',
    [
      'import os, time',
      'pid = os.fork()',
      'if pid == 0:',
      '    fd = os.open(os.devnull, os.O_RDWR)',
      '    for n in (0, 1, 2):',
      '        os.dup2(fd, n)',
      '    time.sleep(30)',
      '    os._exit(0)',
      'print(pid)',
      '',
    ].join('\n'),
  );
  assert.ok(r.ok);
  assert.equal(alive(Number(r.run?.stdout.trim())), false);
});

test('손주가 메모리를 256MB 넘게 쓰면 묶음 전체 메모리로 재서 멈춤', async () => {
  // 손주는 400MB 만 잡고 10초 뒤 스스로 끝남. 묶음째 끄는 고침이 망가져도 고아가 메모리를 끝없이 먹지 않게 함(ADR-061 음성 대조 때 16GB 사고)
  const r = await run(
    'string_basics.py',
    [
      'import os, time',
      'pid = os.fork()',
      'if pid == 0:',
      '    b = bytearray(400 * 1024 * 1024)',
      '    for i in range(0, len(b), 4096):',
      '        b[i] = 1',
      '    time.sleep(10)',
      '    os._exit(0)',
      'os.waitpid(pid, 0)',
      '',
    ].join('\n'),
  );
  assert.ok(r.ok);
  assert.equal(r.run?.timedOut, false);
  assert.match(r.run?.stderr ?? '', /메모리를 256MB 넘게 써서 멈췄어요/);
});

test('남는 위험: os.setsid 로 묶음을 빠져나간 손주는 못 끄지만, 요청은 exitGraceMs 뒤 끝남', async () => {
  const started = performance.now();
  const r = await run(
    'string_basics.py',
    [
      'import os, time',
      'pid = os.fork()',
      'if pid == 0:',
      '    os.setsid()',
      '    time.sleep(30)',
      '    os._exit(0)',
      'print(pid)',
      '',
    ].join('\n'),
  );
  const ms = performance.now() - started;
  const escaped = Number(r.run?.stdout.trim());
  try {
    assert.ok(r.ok);
    assert.equal(r.run?.timedOut, false);
    assert.ok(ms < LIMITS.exitGraceMs + 2000, `${Math.round(ms)}ms 걸림`);
    // 빠져나간 손주가 아직 살아 있는 것까지가 지금 알려진 한계(ADR-061)
    assert.equal(alive(escaped), true);
  } finally {
    if (escaped > 0 && alive(escaped)) process.kill(escaped, 'SIGKILL');
  }
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

test('퀴즈 답 실행: 서버에 FORCE_COLOR 가 있어도 에러에 색 코드와 임시 폴더 경로가 안 섞임', async () => {
  const before = process.env['FORCE_COLOR'];
  process.env['FORCE_COLOR'] = '1';
  try {
    const r = await runPythonSnippet('print(nope)\n');
    assert.ok(r.ok);
    const stderr = r.run?.stderr ?? '';
    assert.doesNotMatch(stderr, /\x1b\[/);
    assert.match(stderr, /^ {2}File "main\.py", line 1, in <module>$/m);
    assert.match(stderr, /^NameError: name 'nope' is not defined/m);
  } finally {
    if (before === undefined) delete process.env['FORCE_COLOR'];
    else process.env['FORCE_COLOR'] = before;
  }
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
