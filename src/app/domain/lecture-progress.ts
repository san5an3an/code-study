// 강의별 진도 체크와 끝낸 강의 판정. 순수 함수만 둠
import type { ProgressData } from './progress-data';
import { quizBestOf } from './quiz-record';

export type CheckKey = 'videoWatched' | 'noteRead';

// 체크를 켜면 true 로 저장하고, 끄면 그 값을 지움
export function applyCheck(
  data: ProgressData,
  lectureId: string,
  key: CheckKey,
  on: boolean,
): ProgressData {
  const lecture = { ...data.lectures[lectureId] };
  if (on) lecture[key] = true;
  else delete lecture[key];
  return { ...data, lectures: { ...data.lectures, [lectureId]: lecture } };
}

// 이미 마지막에 본 강의면 같은 객체를 돌려줘서 다시 저장하지 않게 함
export function applyVisit(data: ProgressData, lectureId: string): ProgressData {
  return data.lastLectureId === lectureId ? data : { ...data, lastLectureId: lectureId };
}

export function isChecked(data: ProgressData, lectureId: string, key: CheckKey) {
  return data.lectures[lectureId]?.[key] === true;
}

export type Missing = 'video' | 'note' | 'quiz';

// 강의를 끝내려면 남은 항목 목록. 빈 배열이면 끝낸 강의
export function missingFor(data: ProgressData, lectureId: string): Missing[] {
  const missing: Missing[] = [];
  if (!isChecked(data, lectureId, 'videoWatched')) missing.push('video');
  if (!isChecked(data, lectureId, 'noteRead')) missing.push('note');
  const best = quizBestOf(data, lectureId);
  if (!best || best.right * 2 < best.total) missing.push('quiz');
  return missing;
}

export function completedLectures(
  data: ProgressData,
  lectureIds: readonly string[],
): Set<string> {
  return new Set(lectureIds.filter((id) => missingFor(data, id).length === 0));
}
