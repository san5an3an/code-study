import assert from 'node:assert/strict';
import { test } from 'node:test';

import { javaCodeOnly, javaSnippetFile } from './java-snippet.ts';

test('class 까지 다 쓴 코드는 그대로 두고 public class 이름으로 파일 이름을 정함', () => {
  const code = 'public class MyProfile {\n    public static void main(String[] a) {}\n}\n';
  assert.deepEqual(javaSnippetFile(code), {
    file: 'MyProfile.java',
    code,
    lineOffset: 0,
    mainClass: 'MyProfile',
  });
});

test('public 이 없는 class 만 있으면 Main.java 로 둠', () => {
  const code = 'class Phone {}\n';
  assert.deepEqual(javaSnippetFile(code), {
    file: 'Main.java',
    code,
    lineOffset: 0,
    mainClass: 'Main',
  });
});

test('맨 앞 칸에서 static 이나 접근 제어자로 시작하는 줄이 있으면 class 로만 감쌈', () => {
  const r = javaSnippetFile('public static int add(int a, int b) {\n    return a + b;\n}');
  assert.equal(r.file, 'Main.java');
  assert.equal(r.lineOffset, 1);
  assert.equal(r.mainClass, 'Main');
  assert.ok(r.code.startsWith('public class Main {\npublic static int add('));
});

test('문장 몇 줄만 쓴 코드는 class 와 main 으로 감싸고 앞에 붙인 줄 수를 알려 줌', () => {
  const r = javaSnippetFile('int a = 3;\nSystem.out.println(a);');
  assert.equal(r.file, 'Main.java');
  assert.equal(r.lineOffset, 2);
  assert.equal(r.mainClass, 'Main');
  assert.equal(r.code.split('\n')[2], 'int a = 3;');
});

test('class 이름에 경로 글자가 들어갈 수 없음', () => {
  assert.equal(javaSnippetFile('public class A/../B {}').file, 'A.java');
});

test('public 을 안 붙인 class 에 main 이 있으면 그 class 를 실행함', () => {
  const r = javaSnippetFile('class Fee {\n    public static void main(String[] args) {}\n}\n');
  assert.equal(r.file, 'Main.java');
  assert.equal(r.mainClass, 'Fee');
});

test('public 이 붙은 타입에 main 이 없으면 main 이 있는 다른 class 를 실행함', () => {
  const r = javaSnippetFile(
    'public interface Payment { void pay(int a); }\n' +
      'class Card implements Payment { public void pay(int a) {} }\n' +
      'class PaymentTest {\n    public static void main(String[] args) {}\n}\n',
  );
  assert.equal(r.file, 'Payment.java');
  assert.equal(r.mainClass, 'PaymentTest');
});

test('main 이 둘이면 public 이 붙은 쪽을 실행함', () => {
  const r = javaSnippetFile(
    'class B { public static void main(String[] x) {} }\n' +
      'public class A { public static void main(String[] x) {} }\n',
  );
  assert.equal(r.mainClass, 'A');
});

test('메소드 안쪽(깊이 2)의 main 글자나 안쪽 class 의 main 은 실행 class 로 보지 않음', () => {
  const r = javaSnippetFile(
    'class Helper {\n    void run() { main(); }\n    static class Inner { public static void main(String[] x) {} }\n}\n' +
      'class App { public static void main(String[] x) {} }\n',
  );
  assert.equal(r.mainClass, 'App');
});

test('주석 속의 public class 는 파일 이름으로 쓰지 않음', () => {
  const r = javaSnippetFile(
    '// public class HelloWorld 를 고쳐서 만듦\npublic class MyIntro {\n    public static void main(String[] a) {}\n}\n',
  );
  assert.equal(r.file, 'MyIntro.java');
  assert.equal(r.mainClass, 'MyIntro');
});

test('글자 속의 class 낱말이나 중괄호는 코드로 읽지 않음', () => {
  const statement = javaSnippetFile('System.out.println("my class Dog");');
  assert.equal(statement.lineOffset, 2);
  const braces = javaSnippetFile(
    'class Shop { public static void main(String[] a) { System.out.println("}"); } }\n' +
      'class Other { public static void main(String[] a) {} }\n',
  );
  assert.equal(braces.mainClass, 'Shop');
});

test('들여쓴 채로 붙여 넣은 메소드도 class 로만 감쌈', () => {
  const r = javaSnippetFile(
    '    public static void sum(int n) {\n        System.out.println(n);\n    }',
  );
  assert.equal(r.lineOffset, 1);
});

test('주석, 글자, 문자 속 내용을 공백으로 바꾸고 줄바꿈과 길이는 그대로 둠', () => {
  const source = 'a /* b */ "c\\"d" \'}\' // e\n"""\nf\n""" "open\ng';
  const code = javaCodeOnly(source);
  assert.equal(code.length, source.length);
  assert.equal(code.split('\n').length, source.split('\n').length);
  assert.equal(code.replace(/\s/g, ''), 'ag');
});
