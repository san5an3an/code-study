// 문제 하나의 답 상태와 채점 판정. 퀴즈 탭과 오답 노트가 같이 씀
import type { QuizQuestion } from './lecture-content';
import type { Verdict } from './quiz-record';

export type Answer = {
  // OX, 객관식에서 고른 값
  picked: readonly (string | number)[];
  graded: boolean;
  // 실행 결과, 빈칸, 직접 쓰기에서 쓴 답과 스스로 체크한 결과
  text: string;
  revealed: boolean;
  self: Verdict | null;
};

export const EMPTY_ANSWER: Answer = {
  picked: [],
  graded: false,
  text: '',
  revealed: false,
  self: null,
};

// OX 와 객관식은 누르면 바로 채점하고, 나머지 종류는 정답을 본 뒤 스스로 체크함
export function isAuto(q: QuizQuestion) {
  return q.kind === 'ox' || q.kind === 'choice';
}

// 아직 채점 전이면 null. 정답이 여러 개면 고른 것과 정답이 정확히 같아야 맞음
export function verdictOf(q: QuizQuestion, a: Answer): Verdict | null {
  if (!isAuto(q)) return a.self;
  if (!a.graded) return null;
  const same = a.picked.length === q.correct.length && q.correct.every((c) => a.picked.includes(c));
  return same ? 'right' : 'wrong';
}
