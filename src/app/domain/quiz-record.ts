// 퀴즈 채점 결과를 진도에 남기는 순수 함수. 실제 저장은 진도 저장소가 맡음
import type { ProgressData } from './progress-data';

export type Verdict = 'right' | 'wrong';

export type QuizBest = { right: number; total: number; at: string };

export function wrongKey(lectureId: string, n: number) {
  return `${lectureId}-${n}`;
}

// 틀리면 오답 노트에 넣고(이미 있으면 틀린 시각만 새로 씀), 맞히면 오답 노트에서 뺌
export function applyVerdict(
  data: ProgressData,
  lectureId: string,
  n: number,
  verdict: Verdict,
  at: string,
): ProgressData {
  const key = wrongKey(lectureId, n);
  if (verdict === 'wrong') return { ...data, wrong: { ...data.wrong, [key]: { lectureId, n, at } } };
  if (!(key in data.wrong)) return data;
  const wrong = { ...data.wrong };
  delete wrong[key];
  return { ...data, wrong };
}

export function quizBestOf(data: ProgressData, lectureId: string): QuizBest | null {
  const best = data.lectures[lectureId]?.['quizBest'];
  if (typeof best !== 'object' || best === null) return null;
  const { right, total, at } = best as Record<string, unknown>;
  if (typeof right !== 'number' || typeof total !== 'number' || typeof at !== 'string') return null;
  return { right, total, at };
}

// 저장된 최고 점수보다 많이 맞혔을 때만 새로 씀
export function applyBest(
  data: ProgressData,
  lectureId: string,
  right: number,
  total: number,
  at: string,
): ProgressData {
  const prev = quizBestOf(data, lectureId);
  if (prev && prev.right >= right) return data;
  const lecture = data.lectures[lectureId] ?? {};
  return {
    ...data,
    lectures: { ...data.lectures, [lectureId]: { ...lecture, quizBest: { right, total, at } } },
  };
}
