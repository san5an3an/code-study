// 강의 화면에서 쓰는 계산: 부·이웃 강의, 주소의 탭 값
import type { Course, Lecture, Part } from './course';

export const LECTURE_TABS = [
  { value: 'note', label: '노트' },
  { value: 'quiz', label: '퀴즈' },
  { value: 'code', label: '코드' },
  { value: 'material', label: '강의 자료' },
] as const;

export type LectureTab = (typeof LECTURE_TABS)[number]['value'];

// 없거나 모르는 값이면 노트
export function tabOf(value: string | null | undefined): LectureTab {
  return LECTURE_TABS.find((t) => t.value === value)?.value ?? 'note';
}

export type LectureContext = {
  part: Part | undefined;
  prev: Lecture | undefined;
  next: Lecture | undefined;
};

// 이전·다음은 과목 목록 순서. 부가 달라도 이어짐
export function lectureContext(course: Course, lecture: Lecture): LectureContext {
  const index = course.lectures.indexOf(lecture);
  return {
    part: course.parts.find((p) => p.id === lecture.part),
    prev: index > 0 ? course.lectures[index - 1] : undefined,
    next: index >= 0 ? course.lectures[index + 1] : undefined,
  };
}
