import assert from 'node:assert/strict';
import { existsSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';

import {
  answerSource,
  expectedJavaOutput,
  expectedPythonOutput,
  javaAnswerSource,
} from './expected-output.ts';

test('자바 블록이 둘이면 순서대로 이어 붙이고 다른 블록은 뺌', () => {
  const explanation =
    '(1)\n```java\nint a = 1;\n```\n실행 결과:\n```\n1\n```\n(2)\n```java\nint b = 2;\n```\n';
  assert.equal(javaAnswerSource(explanation), 'int a = 1;\n\nint b = 2;\n');
});

test('자바 블록이 없으면 null', () => {
  assert.equal(javaAnswerSource('말로 답함\n```\n출력\n```'), null);
  assert.equal(javaAnswerSource('```python\nprint(1)\n```'), null);
});

test('문장만 쓴 조각은 감싸서 돌리고 출력을 그대로 돌려줌', () => {
  assert.equal(
    expectedJavaOutput('int a = 3;\nSystem.out.println(a);\nSystem.out.print("끝 ");'),
    '3\n끝 ',
  );
});

test('class 까지 쓴 코드는 public class 를 실행함', () => {
  const code =
    'class Dog { String name() { return "멍"; } }\n' +
    'public class Zoo {\n  public static void main(String[] args) {\n    System.out.println(new Dog().name());\n  }\n}\n';
  assert.equal(expectedJavaOutput(code), '멍\n');
});

test('돌릴 때마다 출력이 다르면 null', () => {
  assert.equal(expectedJavaOutput('System.out.println(System.nanoTime());'), null);
});

test('컴파일이 안 되면 null', () => {
  assert.equal(expectedJavaOutput('int a = ;'), null);
});

test('실행 중 예외로 끝나면 null', () => {
  assert.equal(
    expectedJavaOutput('System.out.println("앞");\nint[] a = new int[1];\na[3] = 1;'),
    null,
  );
});

test('시간 제한을 넘기면 null', () => {
  assert.equal(expectedJavaOutput('while (true) {}', 1_000), null);
});

test('답안이 만든 파일은 지금 폴더에 남지 않음', () => {
  const name = 'expected-output-test-file.txt';
  const code =
    `java.nio.file.Files.writeString(java.nio.file.Path.of("${name}"), "x");\n` +
    'System.out.println("썼음");';
  assert.equal(expectedJavaOutput(code), '썼음\n');
  assert.equal(existsSync(name), false);
});

test('public 을 안 붙인 class 에 main 이 있는 답안도 실행해 기대 출력을 구함', () => {
  assert.equal(
    expectedJavaOutput(
      'class Fee {\n  public static void main(String[] args) {\n    System.out.println("요금");\n  }\n}\n',
    ),
    '요금\n',
  );
});

test('파이썬 블록만 골라 이어 붙이고 자바 블록과 출력 블록은 뺌', () => {
  const explanation =
    '```python\na = 1\n```\n실행 결과:\n```\n1\n```\n```java\nint b;\n```\n```python\nprint(a)\n```\n';
  assert.equal(answerSource(explanation, 'python'), 'a = 1\n\nprint(a)\n');
  assert.equal(answerSource('```java\nint a;\n```', 'python'), null);
});

test('파이썬 답안을 돌려 출력을 그대로 돌려주고 한글이 깨지지 않음', () => {
  assert.equal(expectedPythonOutput('for i in range(2):\n    print(f"{i}번")\n'), '0번\n1번\n');
});

test('파이썬 답안이 돌릴 때마다 다르거나, 에러로 끝나거나, 입력을 기다리면 null', () => {
  assert.equal(expectedPythonOutput('import random\nprint(random.random())\n'), null);
  assert.equal(expectedPythonOutput('print(1)\nprint(nope)\n'), null);
  assert.equal(expectedPythonOutput('print(input())\n'), null);
});

test('파이썬 답안이 작업 폴더 경로를 찍으면 돌릴 때마다 폴더가 달라서 null', () => {
  assert.equal(expectedPythonOutput('import os\nprint(os.getcwd())\n'), null);
});

test('파이썬 답안을 정한 횟수만큼 돌리고, 한 번이라도 출력이 다르면 null', () => {
  // 돌린 횟수를 파일에 적어, 세 번째 실행만 다른 출력을 냄
  const counter = path.join(tmpdir(), `code-study-runs-${process.pid}.txt`);
  writeFileSync(counter, '0');
  try {
    const source = [
      `p = ${JSON.stringify(counter)}`,
      'n = int(open(p).read()) + 1',
      'open(p, "w").write(str(n))',
      'print("다름" if n == 3 else "같음")',
      '',
    ].join('\n');
    assert.equal(expectedPythonOutput(source, undefined, 2), '같음\n');
    writeFileSync(counter, '0');
    assert.equal(expectedPythonOutput(source, undefined, 3), null);
  } finally {
    rmSync(counter, { force: true });
  }
});

test('파이썬 답안이 시간 제한을 넘기면 null', () => {
  assert.equal(expectedPythonOutput('while True:\n    pass\n', 500), null);
});

test('파이썬 답안이 만든 파일은 지금 폴더에 남지 않음', () => {
  const name = 'code-study-expected-py-test.txt';
  assert.equal(expectedPythonOutput(`open("${name}", "w").write("x")\nprint("ok")\n`), 'ok\n');
  assert.equal(existsSync(name), false);
});
