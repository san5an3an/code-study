// 홈에 보이는 과목 요약 계산. 순수 함수만 둠
import { findLecture, type Course, type Lecture, type Part } from './course';

export function percent(done: number, total: number) {
  return total === 0 ? 0 : Math.round((done / total) * 100);
}

export type PartSummary = {
  part: Part;
  total: number;
  done: number;
  first: Lecture;
};

export function partSummaries(course: Course, completed: ReadonlySet<string>): PartSummary[] {
  return course.parts.map((part) => {
    const lectures = course.lectures.filter((l) => l.part === part.id);
    return {
      part,
      total: lectures.length,
      done: lectures.filter((l) => completed.has(l.id)).length,
      first: lectures[0],
    };
  });
}

export type Resume = {
  lecture: Lecture;
  // 마지막에 본 강의가 있으면 true, 처음이면 false
  resumed: boolean;
};

// 마지막에 본 강의가 목록에 없으면 첫 강의부터
export function resumeOf(course: Course, lastLectureId: string | null): Resume {
  const last = findLecture(course, lastLectureId ?? undefined);
  return last ? { lecture: last, resumed: true } : { lecture: course.lectures[0], resumed: false };
}
