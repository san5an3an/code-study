import type { QuizQuestion } from './lecture-content';
import { codeLanguageOf, EMPTY_ANSWER, isAuto, verdictOf } from './quiz-answer';

function question(kind: QuizQuestion['kind'], correct: (string | number)[]): QuizQuestion {
  return {
    n: 1,
    kind,
    label: '',
    outsideLecture: false,
    prompt: '',
    options: [],
    correct,
    answerHead: '',
    isExample: false,
    explanation: '',
  };
}

describe('퀴즈 답 판정', () => {
  it('OX 와 객관식만 바로 채점하는 종류로 봄', () => {
    expect(isAuto(question('ox', ['O']))).toBe(true);
    expect(isAuto(question('choice', [2]))).toBe(true);
    expect(isAuto(question('output', []))).toBe(false);
    expect(isAuto(question('blank', []))).toBe(false);
    expect(isAuto(question('write', []))).toBe(false);
  });

  it('바로 채점하는 종류는 채점 전이면 null, 고른 값이 정답이면 맞음, 아니면 틀림', () => {
    const q = question('choice', [3]);
    expect(verdictOf(q, { ...EMPTY_ANSWER, picked: [3] })).toBeNull();
    expect(verdictOf(q, { ...EMPTY_ANSWER, picked: [3], graded: true })).toBe('right');
    expect(verdictOf(q, { ...EMPTY_ANSWER, picked: [2], graded: true })).toBe('wrong');
  });

  it('정답이 여러 개면 정답을 모두, 정답만 골라야 맞음', () => {
    const q = question('choice', [1, 3]);
    const graded = { ...EMPTY_ANSWER, graded: true };
    expect(verdictOf(q, { ...graded, picked: [3, 1] })).toBe('right');
    expect(verdictOf(q, { ...graded, picked: [1] })).toBe('wrong');
    expect(verdictOf(q, { ...graded, picked: [1, 2, 3] })).toBe('wrong');
  });

  it('스스로 체크하는 종류는 사용자가 누른 맞음, 틀림을 그대로 판정으로 씀', () => {
    const q = question('output', []);
    expect(verdictOf(q, { ...EMPTY_ANSWER, revealed: true })).toBeNull();
    expect(verdictOf(q, { ...EMPTY_ANSWER, revealed: true, self: 'wrong' })).toBe('wrong');
    expect(verdictOf(q, { ...EMPTY_ANSWER, revealed: true, self: 'right' })).toBe('right');
  });

  it('예시 답안에 코드 블록이 있는 직접 쓰기 문제만 그 코드 언어로 편집기를 씀', () => {
    const write = (explanation: string) => ({ ...question('write', []), explanation });
    expect(codeLanguageOf(write('```java\npublic class A {}\n```'))).toBe('java');
    expect(codeLanguageOf(write('설명\n```python\nprint(1)\n```'))).toBe('python');
    expect(codeLanguageOf(write('1. 세미콜론이 없어요.'))).toBeNull();
    expect(codeLanguageOf(write('```\n출력\n```'))).toBeNull();
    expect(
      codeLanguageOf({ ...question('output', []), explanation: '```java\nint a;\n```' }),
    ).toBeNull();
  });
});
