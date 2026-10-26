import assert from 'node:assert/strict';
import { test } from 'node:test';

import type { QuizQuestion } from '../src/app/domain/lecture-content.ts';
import {
  checkAllUsed,
  CodeQuizExtraError,
  parseCodeQuizExtras,
  withCodeQuiz,
  type CodeQuizExtras,
} from './code-quiz.ts';

function question(n: number, kind: QuizQuestion['kind'], explanation: string): QuizQuestion {
  return {
    n,
    kind,
    label: '',
    outsideLecture: false,
    prompt: '',
    options: [],
    correct: [],
    answerHead: '',
    isExample: true,
    explanation,
  };
}

const CODE = question(11, 'write', '```java\nSystem.out.println(1);\n```');
const HINTS = ['설명', '- 할 일', '```java\n___\n```'];

// 예시 답안 실행 대신 넘기는 가짜 함수. 받은 코드를 모아 두고 정해 둔 출력을 돌려줌
function fakeRun(output: string | null) {
  const calls: string[] = [];
  return {
    calls,
    run: (source: string) => {
      calls.push(source);
      return output;
    },
  };
}

test('코드 문제에 힌트 세 단계와 예시 답안을 돌린 출력을 붙이고 쓴 키를 모음', () => {
  const used = new Set<string>();
  const fake = fakeRun('1\n');
  const q = withCodeQuiz(CODE, '03', { '03-11': { hints: HINTS } }, used, fake.run);
  assert.deepEqual(q.hints, HINTS);
  assert.equal(q.expectedOutput, '1\n');
  assert.deepEqual(fake.calls, ['System.out.println(1);\n']);
  assert.deepEqual([...used], ['03-11']);
});

test('noGrading 이 적힌 문제는 예시 답안을 돌리지 않고 기대 출력을 null 로 둠', () => {
  const fake = fakeRun('1\n');
  const extras = { '03-11': { hints: HINTS, noGrading: '값을 직접 고름' } };
  const q = withCodeQuiz(CODE, '03', extras, new Set(), fake.run);
  assert.equal(q.expectedOutput, null);
  assert.deepEqual(q.hints, HINTS);
  assert.deepEqual(fake.calls, []);
});

test('말로 답하는 문제는 힌트도 기대 출력도 붙이지 않고 그대로 돌려줌', () => {
  const words = question(5, 'write', '세미콜론이 빠졌어요.');
  const q = withCodeQuiz(words, '03', {}, new Set(), fakeRun('x').run);
  assert.equal(q, words);
});

test('코드 문제인데 힌트가 없으면 에러로 멈춤', () => {
  assert.throws(
    () => withCodeQuiz(CODE, '03', {}, new Set(), fakeRun('1\n').run),
    (e: unknown) => e instanceof CodeQuizExtraError && /03-11.*힌트가 없음/.test(e.message),
  );
});

test('말로 답하는 문제에 힌트가 있으면 에러로 멈춤', () => {
  const words = question(5, 'write', '세미콜론이 빠졌어요.');
  assert.throws(
    () => withCodeQuiz(words, '03', { '03-5': { hints: HINTS } }, new Set(), fakeRun('x').run),
    (e: unknown) =>
      e instanceof CodeQuizExtraError && /03-5.*코드로 답하는 문제가 아닌데/.test(e.message),
  );
});

test('힌트 파일에만 있고 어느 문제에도 안 붙은 키가 있으면 에러로 멈춤', () => {
  const extras: CodeQuizExtras = { '03-11': { hints: HINTS }, '03-99': { hints: HINTS } };
  assert.throws(
    () => checkAllUsed(extras, new Set(['03-11'])),
    (e: unknown) => e instanceof CodeQuizExtraError && /03-99/.test(e.message),
  );
  assert.doesNotThrow(() => checkAllUsed(extras, new Set(['03-11', '03-99'])));
});

const badFiles: [string, string][] = [
  ['맨 바깥이 배열', '[]'],
  ['힌트가 두 단계', JSON.stringify({ '03-11': { hints: ['a', 'b'] } })],
  ['힌트에 빈 글', JSON.stringify({ '03-11': { hints: ['a', ' ', 'c'] } })],
  ['힌트가 글이 아님', JSON.stringify({ '03-11': { hints: ['a', 2, 'c'] } })],
  ['noGrading 이 글이 아님', JSON.stringify({ '03-11': { hints: HINTS, noGrading: true } })],
  [
    'showOutputExample 이 true, false 가 아님',
    JSON.stringify({ '03-11': { hints: HINTS, showOutputExample: 'yes' } }),
  ],
  [
    '채점 안 하는 문제에 출력 예',
    JSON.stringify({ '03-11': { hints: HINTS, noGrading: '이유', showOutputExample: true } }),
  ],
];
for (const [name, json] of badFiles) {
  test(`힌트 파일 거절: ${name}`, () => {
    assert.throws(
      () => parseCodeQuizExtras(json, 'code-quiz.json'),
      (e: unknown) => e instanceof CodeQuizExtraError,
    );
  });
}

test('힌트 파일 형식이 맞으면 그대로 읽음', () => {
  const extras = { '03-11': { hints: HINTS }, '03-12': { hints: HINTS, noGrading: '이유' } };
  assert.deepEqual(parseCodeQuizExtras(JSON.stringify(extras), 'code-quiz.json'), extras);
});

test('showOutputExample 이 있으면 기대 출력을 출력 예로도 붙임', () => {
  const extras = { '03-11': { hints: HINTS, showOutputExample: true } };
  const q = withCodeQuiz(CODE, '03', extras, new Set(), fakeRun('2020년은 윤년\n').run);
  assert.equal(q.outputExample, '2020년은 윤년\n');
  assert.equal(q.expectedOutput, '2020년은 윤년\n');
});

test('showOutputExample 이 없으면 출력 예를 붙이지 않음', () => {
  const q = withCodeQuiz(CODE, '03', { '03-11': { hints: HINTS } }, new Set(), fakeRun('1\n').run);
  assert.equal('outputExample' in q, false);
});

test('출력 예를 보여 줄 문제인데 예시 답안 출력을 못 구하면 에러로 멈춤', () => {
  const extras = { '03-11': { hints: HINTS, showOutputExample: true } };
  assert.throws(
    () => withCodeQuiz(CODE, '03', extras, new Set(), fakeRun(null).run),
    (e: unknown) => e instanceof CodeQuizExtraError && /03-11.*출력 예/.test(e.message),
  );
});
