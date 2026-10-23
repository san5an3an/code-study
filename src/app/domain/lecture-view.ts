// 강의 화면에서 쓰는 계산: 강의가 속한 부, 이전·다음 강의, 주소의 탭 값
import type { Course, Lecture, Part } from './course';

export const LECTURE_TABS = [
  { value: 'note', label: '노트' },
  { value: 'quiz', label: '퀴즈' },
  { value: 'code', label: '코드' },
  { value: 'material', label: '강의 자료' },
] as const;

export type LectureTab = (typeof LECTURE_TABS)[number]['value'];

// 탭 값이 없거나 없는 탭 이름이면 노트 탭
export function tabOf(value: string | null | undefined): LectureTab {
  return LECTURE_TABS.find((t) => t.value === value)?.value ?? 'note';
}

export type LectureContext = {
  part: Part | undefined;
  prev: Lecture | undefined;
  next: Lecture | undefined;
};

// 이전·다음 강의는 과목의 강의 목록 순서를 따름. 부가 달라도 이어짐
export function lectureContext(course: Course, lecture: Lecture): LectureContext {
  const index = course.lectures.indexOf(lecture);
  return {
    part: course.parts.find((p) => p.id === lecture.part),
    prev: index > 0 ? course.lectures[index - 1] : undefined,
    next: index >= 0 ? course.lectures[index + 1] : undefined,
  };
}
