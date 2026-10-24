import assert from 'node:assert/strict';
import { test } from 'node:test';

import { javaSnippetFile } from './java-snippet.ts';

test('class 까지 다 쓴 코드는 그대로 두고 public class 이름으로 파일 이름을 정함', () => {
  const code = 'public class MyProfile {\n    public static void main(String[] a) {}\n}\n';
  assert.deepEqual(javaSnippetFile(code), { file: 'MyProfile.java', code, lineOffset: 0 });
});

test('public 이 없는 class 만 있으면 Main.java 로 둠', () => {
  const code = 'class Phone {}\n';
  assert.deepEqual(javaSnippetFile(code), { file: 'Main.java', code, lineOffset: 0 });
});

test('맨 앞 칸에서 static 이나 접근 제어자로 시작하는 줄이 있으면 class 로만 감쌈', () => {
  const r = javaSnippetFile('public static int add(int a, int b) {\n    return a + b;\n}');
  assert.equal(r.file, 'Main.java');
  assert.equal(r.lineOffset, 1);
  assert.ok(r.code.startsWith('public class Main {\npublic static int add('));
});

test('문장 몇 줄만 쓴 코드는 class 와 main 으로 감싸고 앞에 붙인 줄 수를 알려 줌', () => {
  const r = javaSnippetFile('int a = 3;\nSystem.out.println(a);');
  assert.equal(r.file, 'Main.java');
  assert.equal(r.lineOffset, 2);
  assert.equal(r.code.split('\n')[2], 'int a = 3;');
});

test('class 이름에 경로 글자가 들어갈 수 없음', () => {
  assert.equal(javaSnippetFile('public class A/../B {}').file, 'A.java');
});
