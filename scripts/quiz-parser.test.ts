import assert from 'node:assert/strict';
import { test } from 'node:test';

import { parseQuiz, QuizFormatError } from './quiz-parser.ts';

// 01강과 02강의 퀴즈 형식
const BOLD = `# 01강 퀴즈

**문제 1. (OX)**
자바는 기계어다. (O / X)

**문제 2. (객관식)**
고르세요.

1. 가
2. 나
3. 다

---

## 정답과 해설

**문제 1. 정답: X**
자바는 사람이 읽는 언어예요.

**문제 2. 정답: 1, 3**
둘 다 맞아요.
`;

// 06강과 09강의 퀴즈 형식
const NUMBERED = `# 06강 퀴즈

### 1. (실행 결과 맞히기)
\`\`\`java
System.out.println(1);
\`\`\`

### 2. (객관식, 강의 밖 내용 포함)
고르세요.

1. 하나
2. 둘

## 정답과 해설

### 1. \`1\`
그대로 나와요.

### 2. 2번
둘이에요.
`;

// 나머지 강의의 퀴즈 형식(21강과 22강의 "### 문제 1. O" 정답 머리 포함)
const STANDARD = `# 03강 퀴즈

### 문제 1 (OX)
맞나요?

### 문제 2 (직접 짜보기)
짜 보세요.

## 정답과 해설

### 문제 1. O
맞아요.

### 문제 2 예시 답안
\`\`\`java
int a = 1;
\`\`\`
`;

test('01강과 02강 형식(굵은 글씨 문제 머리)과 정답이 여러 개인 객관식을 읽음', () => {
  const qs = parseQuiz(BOLD, '01');
  assert.equal(qs.length, 2);
  assert.deepEqual(qs[0].correct, ['X']);
  assert.equal(qs[0].prompt, '자바는 기계어다. (O / X)');
  assert.equal(qs[1].kind, 'choice');
  assert.deepEqual(qs[1].options, ['가', '나', '다']);
  assert.deepEqual(qs[1].correct, [1, 3]);
  assert.equal(qs[1].prompt, '고르세요.');
  assert.equal(qs[1].explanation, '둘 다 맞아요.');
});

test('06강과 09강 형식(번호만 있는 문제 머리), 강의 밖 내용 표시, 코드 블록을 읽음', () => {
  const qs = parseQuiz(NUMBERED, '06');
  assert.equal(qs[0].kind, 'output');
  assert.equal(qs[0].label, '실행 결과 맞히기');
  assert.match(qs[0].prompt, /System\.out\.println\(1\);/);
  assert.equal(qs[0].answerHead, '`1`');
  assert.equal(qs[1].outsideLecture, true);
  assert.equal(qs[1].label, '객관식');
  assert.deepEqual(qs[1].correct, [2]);
});

test('나머지 강의 형식(문제 N. 정답 머리)과 예시 답안을 읽음', () => {
  const qs = parseQuiz(STANDARD, '03');
  assert.deepEqual(qs[0].correct, ['O']);
  assert.equal(qs[1].kind, 'write');
  assert.equal(qs[1].isExample, true);
  assert.equal(qs[1].answerHead, '');
  assert.match(qs[1].explanation, /int a = 1;/);
});

test('09강 정답 형식(굵은 글씨에 문제라는 말 없이 번호만)을 읽음', () => {
  const md =
    '### 1. (OX)\n맞나요?\n### 2. (객관식)\n1. 가\n2. 나\n3. 다\n## 정답과 해설\n**1. X**\n아니에요.\n**2. 3번 (20바이트)**\n셋째예요.\n';
  const qs = parseQuiz(md, '09');
  assert.deepEqual(qs[0].correct, ['X']);
  assert.deepEqual(qs[1].correct, [3]);
  assert.equal(qs[1].answerHead, '3번 (20바이트)');
});

test('코드 블록 안의 1. 로 시작하는 줄은 객관식 보기로 읽지 않음', () => {
  const md =
    '### 문제 1 (객관식)\n```\n1. 코드\n```\n1. 가\n2. 나\n## 정답과 해설\n### 문제 1 정답: 2번\n';
  const [q] = parseQuiz(md, '99');
  assert.deepEqual(q.options, ['가', '나']);
});

const broken: [string, string, RegExp][] = [
  ['정답과 해설 구역이 없음', '### 문제 1 (OX)\n맞나요?\n', /정답과 해설/],
  [
    '문제 수와 정답 수가 다름',
    '### 문제 1 (OX)\n### 문제 2 (OX)\n## 정답과 해설\n### 문제 1. O\n',
    /문제 2개, 정답 1개/,
  ],
  [
    '문제 번호를 건너뜀',
    '### 문제 1 (OX)\n### 문제 3 (OX)\n## 정답과 해설\n### 문제 1. O\n### 문제 3. O\n',
    /2번 자리에 3번/,
  ],
  [
    '표에 없는 문제 종류',
    '### 문제 1 (서술형)\n## 정답과 해설\n### 문제 1 정답\n',
    /모르는 문제 종류/,
  ],
  [
    'OX 문제 정답이 O나 X가 아님',
    '### 문제 1 (OX)\n## 정답과 해설\n### 문제 1 정답: 맞음\n',
    /O\/X 가 아님/,
  ],
  [
    '객관식 정답 번호가 보기에 없음',
    '### 문제 1 (객관식)\n1. 가\n2. 나\n## 정답과 해설\n### 문제 1 정답: 5번\n',
    /5번이 보기\(2개\)에 없음/,
  ],
];

for (const [name, md, message] of broken) {
  test(`형식이 틀리면 에러로 멈춤: ${name}`, () => {
    assert.throws(
      () => parseQuiz(md, '99'),
      (e: unknown) => e instanceof QuizFormatError && message.test(e.message),
    );
  });
}
