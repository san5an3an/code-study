import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { test } from 'node:test';

import { checkJava, RunRequestError, runJava, validate } from './java-runner.ts';

const CONTENT = path.resolve(import.meta.dirname, '../test-fixtures/content');

const wrap = (body: string) => `public class AssignExample {
  public static void main(String[] args) throws Exception {
${body}
  }
}
`;

async function run(body: unknown) {
  const v = await validate(body, CONTENT);
  return runJava(v.req, v.codeDir, v.files);
}

test('예제 코드를 고치지 않고 돌리면 자료 가져오기 때 미리 돌린 결과와 같음', async () => {
  const source = await readFile(path.join(CONTENT, 'java/03/code/AssignExample.java'), 'utf8');
  const r = await run({
    course: 'java',
    lectureId: '03',
    file: 'AssignExample.java',
    source,
    stdin: '',
  });
  assert.ok(r.ok);
  assert.equal(r.compile.exitCode, 0);
  assert.equal(r.run?.stdout, '50\n60\n50\n80\n85\n');
});

test('사용자가 고친 코드가 실행되고 출력의 한글이 깨지지 않음', async () => {
  const r = await run({
    course: 'java',
    lectureId: '03',
    file: 'AssignExample.java',
    source: wrap('System.out.println("안녕 " + (1 + 2));'),
    stdin: '',
  });
  assert.ok(r.ok);
  assert.equal(r.run?.stdout, '안녕 3\n');
});

test('입력값(stdin)을 프로그램에 넘김', async () => {
  const source = wrap(
    'var sc = new java.util.Scanner(System.in);\nSystem.out.println(sc.nextInt() * 2);',
  );
  const r = await run({
    course: 'java',
    lectureId: '03',
    file: 'AssignExample.java',
    source,
    stdin: '21\n',
  });
  assert.ok(r.ok);
  assert.equal(r.run?.stdout, '42\n');
});

test('컴파일 에러가 나면 실행하지 않고 컴파일 에러 내용을 돌려줌', async () => {
  const r = await run({
    course: 'java',
    lectureId: '03',
    file: 'AssignExample.java',
    source: wrap('int a = ;'),
    stdin: '',
  });
  assert.ok(r.ok);
  assert.notEqual(r.compile.exitCode, 0);
  assert.match(r.compile.stderr, /AssignExample\.java/);
  assert.equal(r.run, null);
});

test('실행이 5초를 넘기면 멈추고 시간 초과로 알림', async () => {
  const started = Date.now();
  const r = await run({
    course: 'java',
    lectureId: '03',
    file: 'AssignExample.java',
    source: wrap('while (true) {}'),
    stdin: '',
  });
  assert.ok(r.ok);
  assert.equal(r.run?.timedOut, true);
  assert.ok(Date.now() - started < 9_000);
});

test('출력이 64KB를 넘으면 그 순간 실행을 멈춤', async () => {
  const r = await run({
    course: 'java',
    lectureId: '03',
    file: 'AssignExample.java',
    source: wrap('while (true) System.out.println("0123456789");'),
    stdin: '',
  });
  assert.ok(r.ok);
  assert.ok(r.run && r.run.stdout.length < 70 * 1024);
  assert.match(r.run?.stdout ?? '', /64KB를 넘어 멈췄어요/);
});

test('21강처럼 같은 강의 폴더의 다른 자바 파일을 쓰는 예제도 실행됨', async () => {
  const source = await readFile(path.join(CONTENT, 'java/21/code/GenericTest.java'), 'utf8');
  const r = await run({
    course: 'java',
    lectureId: '21',
    file: 'GenericTest.java',
    source,
    stdin: '',
  });
  assert.ok(r.ok);
  assert.equal(r.run?.exitCode, 0);
});

async function check(body: Record<string, unknown>) {
  const v = await validate(body, CONTENT, false);
  return checkJava(v.req, v.codeDir, v.files);
}

test('오타 검사: 고치지 않은 예제는 에러가 없음', async () => {
  const source = await readFile(path.join(CONTENT, 'java/03/code/AssignExample.java'), 'utf8');
  const r = await check({ course: 'java', lectureId: '03', file: 'AssignExample.java', source });
  assert.deepEqual(r, { ok: true, diagnostics: [] });
});

test('오타 검사: 이름 오타와 타입 오류를 줄과 칸, 컴파일러 문구로 돌려주고 실행은 하지 않음', async () => {
  const r = await check({
    course: 'java',
    lectureId: '03',
    file: 'AssignExample.java',
    source: wrap('Sytem.out.println("ran");\nint x = "a";'),
  });
  assert.ok(r.ok);
  assert.deepEqual(
    r.diagnostics.map((d) => [d.file, d.line, d.column, d.message]),
    [
      ['AssignExample.java', 3, 5, 'package Sytem does not exist'],
      ['AssignExample.java', 4, 8, 'incompatible types: String cannot be converted to int'],
    ],
  );
});

test('오타 검사: main 없는 파일도 검사함', async () => {
  const source = await readFile(path.join(CONTENT, 'java/21/code/Mountain.java'), 'utf8');
  const r = await check({ course: 'java', lectureId: '21', file: 'Mountain.java', source });
  assert.deepEqual(r, { ok: true, diagnostics: [] });
});

const bad: [string, unknown, RegExp][] = [
  ['과목을 안 보낸 요청', { lectureId: '03', file: 'AssignExample.java', source: '', stdin: '' }, /과목/],
  [
    '과목에 경로',
    { course: '../java', lectureId: '03', file: 'AssignExample.java', source: '', stdin: '' },
    /과목/,
  ],
  [
    '아직 없는 과목',
    { course: 'python', lectureId: '03', file: 'a.py', source: '', stdin: '' },
    /과목/,
  ],
  [
    '강의 번호에 경로',
    { course: 'java', lectureId: '../03', file: 'AssignExample.java', source: '', stdin: '' },
    /강의 번호/,
  ],
  [
    '파일 이름에 경로',
    { course: 'java', lectureId: '03', file: '../../../etc/passwd', source: '', stdin: '' },
    /없는 파일/,
  ],
  [
    '목록에 없는 파일',
    { course: 'java', lectureId: '03', file: 'Evil.java', source: '', stdin: '' },
    /없는 파일/,
  ],
  [
    'main 없는 파일',
    { course: 'java', lectureId: '21', file: 'Mountain.java', source: '', stdin: '' },
    /main/,
  ],
  [
    '코드가 64KB 초과',
    {
      course: 'java',
      lectureId: '03',
      file: 'AssignExample.java',
      source: 'x'.repeat(65 * 1024),
      stdin: '',
    },
    /64KB/,
  ],
  [
    'source 가 글자가 아님',
    { course: 'java', lectureId: '03', file: 'AssignExample.java', source: 1 },
    /글자/,
  ],
  ['없는 강의 번호', { course: 'java', lectureId: '99', file: 'A.java', source: '' }, /자료 가져오기/],
];
for (const [name, body, message] of bad) {
  test(`거절: ${name}`, async () => {
    await assert.rejects(
      validate(body, CONTENT),
      (e: unknown) => e instanceof RunRequestError && message.test(e.message),
    );
  });
}
