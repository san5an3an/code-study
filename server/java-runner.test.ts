import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { test } from 'node:test';

import {
  checkJava,
  checkJavaSnippet,
  RunRequestError,
  runJava,
  runJavaSnippet,
  validate,
  validateSnippet,
} from './java-runner.ts';

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

test('퀴즈 답 검사: 문장만 쓴 코드의 에러를 사용자가 쓴 줄 번호로 돌려줌', async () => {
  const r = await checkJavaSnippet('int sum = 0;\nSytem.out.println(sum);');
  assert.ok(r.ok);
  assert.deepEqual(
    r.diagnostics.map((d) => [d.line, d.column, d.message]),
    [[2, 5, 'package Sytem does not exist']],
  );
});

test('퀴즈 답 검사: class 까지 쓴 코드는 그대로 컴파일하고, 맞는 코드면 에러가 없음', async () => {
  const r = await checkJavaSnippet(
    'public class MyIntro {\n    public static void main(String[] args) {\n        System.out.println("안녕");\n    }\n}\n',
  );
  assert.deepEqual(r, { ok: true, diagnostics: [] });
});

test('퀴즈 답 검사: 닫는 괄호가 모자라 감싼 줄에서 난 에러는 사용자가 쓴 마지막 줄로 옮김', async () => {
  const r = await checkJavaSnippet('for (int i = 0; i < 3; i++) {\n    System.out.println(i);');
  assert.ok(r.ok);
  assert.ok(r.diagnostics.length > 0);
  assert.ok(r.diagnostics.every((d) => d.line >= 1 && d.line <= 2));
});

const badSnippet: [string, unknown, RegExp][] = [
  ['과목이 없음', { source: '' }, /과목/],
  ['아직 없는 과목', { course: 'python', source: 'print(1)' }, /과목/],
  ['source 가 글자가 아님', { course: 'java', source: 1 }, /글자/],
  ['코드가 64KB 초과', { course: 'java', source: 'x'.repeat(65 * 1024) }, /64KB/],
];
for (const [name, body, message] of badSnippet) {
  test(`퀴즈 답 검사 거절: ${name}`, () => {
    assert.throws(
      () => validateSnippet(body),
      (e: unknown) => e instanceof RunRequestError && message.test(e.message),
    );
  });
}

test('퀴즈 답 실행: 문장만 쓴 코드를 감싸서 돌리고 출력의 한글이 깨지지 않음', async () => {
  const r = await runJavaSnippet('int sum = 0;\nfor (int i = 1; i <= 10; i++) sum += i;\nSystem.out.println("합계: " + sum);');
  assert.ok(r.ok);
  assert.deepEqual(r.diagnostics, []);
  assert.equal(r.run?.stdout, '합계: 55\n');
  assert.equal(r.run?.exitCode, 0);
});

test('퀴즈 답 실행: class 까지 쓴 코드는 public class 를 실행함', async () => {
  const r = await runJavaSnippet(
    'class Dog { String name() { return "멍"; } }\npublic class Zoo {\n    public static void main(String[] args) {\n        System.out.println(new Dog().name());\n    }\n}\n',
  );
  assert.ok(r.ok);
  assert.equal(r.run?.stdout, '멍\n');
});

test('퀴즈 답 실행: 컴파일 에러면 실행하지 않고 사용자가 쓴 줄 번호로 에러를 돌려줌', async () => {
  const r = await runJavaSnippet('int a = 1;\nint b = ;');
  assert.ok(r.ok);
  assert.equal(r.run, null);
  assert.deepEqual(r.diagnostics.map((d) => d.line), [2]);
});

test('퀴즈 답 실행: 5초를 넘기면 멈추고 시간 초과로 알림', async () => {
  const r = await runJavaSnippet('while (true) {}');
  assert.ok(r.ok);
  assert.equal(r.run?.timedOut, true);
});

test('퀴즈 답 실행: 답이 만든 파일은 지금 폴더에 남지 않음', async () => {
  const name = 'run-snippet-test-file.txt';
  const r = await runJavaSnippet(
    `java.nio.file.Files.writeString(java.nio.file.Path.of("${name}"), "x");\nSystem.out.println("썼음");`,
  );
  assert.ok(r.ok);
  assert.equal(r.run?.stdout, '썼음\n');
  assert.equal(existsSync(name), false);
});

test('퀴즈 답 실행: public 을 안 붙인 class 에 main 이 있어도 그 class 를 실행함', async () => {
  const r = await runJavaSnippet('class Fee {\n    public static void main(String[] args) {\n        System.out.println("청소년 요금: 1000원");\n    }\n}\n');
  assert.ok(r.ok);
  assert.equal(r.run?.stdout, '청소년 요금: 1000원\n');
  assert.equal(r.run?.exitCode, 0);
});

test('퀴즈 답 실행: public 이 붙은 interface 에 main 이 없으면 main 이 있는 class 를 실행함', async () => {
  const r = await runJavaSnippet(
    'public interface Payment {\n    void pay(int amount);\n}\nclass Card implements Payment {\n    public void pay(int amount) { System.out.println("카드로 " + amount + "원 결제"); }\n}\nclass PaymentTest {\n    public static void main(String[] args) {\n        Payment p = new Card();\n        p.pay(5000);\n    }\n}\n',
  );
  assert.ok(r.ok);
  assert.deepEqual(r.diagnostics, []);
  assert.equal(r.run?.stdout, '카드로 5000원 결제\n');
});
