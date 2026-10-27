// 오답 노트 묶기. 틀린 문제 기록을 강의 순서로 묶고, 퀴즈 파일에 없는 번호는 뺌
import type { Course, Lecture } from './course';
import type { QuizQuestion } from './lecture-content';
import type { WrongRecord } from './progress-data';

// 강의 하나의 퀴즈 문제 목록. null 이면 퀴즈 파일을 못 불러옴
export type LoadedQuiz = readonly QuizQuestion[] | null;

// failed 면 퀴즈 파일을 못 불러온 묶음이라 questions 가 비어 있음
export type ReviewGroup = { lecture: Lecture; questions: readonly QuizQuestion[]; failed: boolean };

// 저장 키("03-5")가 아니라 기록 안의 강의 번호와 문제 번호를 읽음
function wrongNumbers(wrong: Readonly<Record<string, WrongRecord>>) {
  const numbers = new Map<string, Set<number>>();
  for (const { lectureId, n } of Object.values(wrong)) {
    const set = numbers.get(lectureId) ?? new Set<number>();
    set.add(n);
    numbers.set(lectureId, set);
  }
  return numbers;
}

// 틀린 기록이 있는 강의를 강의 목록 순서로 돌려줌. 이 강의들의 퀴즈 파일을 불러옴. 목록에 없는 강의는 뺌
export function reviewLectureIds(
  course: Course,
  wrong: Readonly<Record<string, WrongRecord>>,
): string[] {
  const numbers = wrongNumbers(wrong);
  return course.lectures.filter((l) => numbers.has(l.id)).map((l) => l.id);
}

// loaded 는 강의 번호 → 불러온 문제 목록. 강의 안은 퀴즈 파일 순서이고, 퀴즈 파일에 없는 번호와 문제가 하나도 안 남은 묶음은 뺌
// 아직 loaded 에 없는 강의는 묶지 않음
export function reviewGroups(
  course: Course,
  wrong: Readonly<Record<string, WrongRecord>>,
  loaded: Readonly<Record<string, LoadedQuiz>>,
): ReviewGroup[] {
  const numbers = wrongNumbers(wrong);
  const groups: ReviewGroup[] = [];
  for (const lecture of course.lectures) {
    const wanted = numbers.get(lecture.id);
    if (!wanted || !(lecture.id in loaded)) continue;
    const quiz = loaded[lecture.id];
    if (quiz === null) {
      groups.push({ lecture, questions: [], failed: true });
      continue;
    }
    const questions = quiz.filter((q) => wanted.has(q.n));
    if (questions.length > 0) groups.push({ lecture, questions, failed: false });
  }
  return groups;
}
