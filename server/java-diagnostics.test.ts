import assert from 'node:assert/strict';
import { test } from 'node:test';

import { parseJavacErrors } from './java-diagnostics.ts';

// 아래 출력은 맥의 javac 21 이 실제로 낸 글을 그대로 옮김
const MULTI = `A.java:3: error: cannot find symbol
        int y = z;
                ^
  symbol:   variable z
  location: class A
A.java:4: error: method foo in class A cannot be applied to given types;
        foo(1);
        ^
  required: no arguments
  found:    int
  reason: actual and formal argument lists differ in length
2 errors
`;

test('에러마다 파일, 줄, ^ 가 가리킨 칸, 문구를 뽑고 들여쓴 덧붙임 줄은 문구에 이어 붙임', () => {
  assert.deepEqual(parseJavacErrors(MULTI), [
    {
      file: 'A.java',
      line: 3,
      column: 16,
      severity: 'error',
      message: 'cannot find symbol\nsymbol:   variable z\nlocation: class A',
    },
    {
      file: 'A.java',
      line: 4,
      column: 8,
      severity: 'error',
      message:
        'method foo in class A cannot be applied to given types;\nrequired: no arguments\nfound:    int\nreason: actual and formal argument lists differ in length',
    },
  ]);
});

test('끝 요약 줄과 Note 안내 줄은 문구에 넣지 않고, 경고는 warning 으로 구분함', () => {
  const out = `B.java:2: warning: [removal] Integer(int) in Integer has been deprecated and marked for removal
        Integer i = new Integer(1);
                    ^
Note: Some input files use unchecked or unsafe operations.
1 warning
`;
  assert.deepEqual(parseJavacErrors(out), [
    {
      file: 'B.java',
      line: 2,
      column: 20,
      severity: 'warning',
      message: '[removal] Integer(int) in Integer has been deprecated and marked for removal',
    },
  ]);
});

test('Windows 줄바꿈(\\r\\n)이어도 같은 결과를 냄', () => {
  assert.deepEqual(parseJavacErrors(MULTI.replace(/\n/g, '\r\n')), parseJavacErrors(MULTI));
});

test('에러가 없으면 빈 목록', () => {
  assert.deepEqual(parseJavacErrors(''), []);
});
