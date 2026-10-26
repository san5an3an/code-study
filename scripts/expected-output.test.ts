import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { test } from 'node:test';

import { expectedJavaOutput, javaAnswerSource } from './expected-output.ts';

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
