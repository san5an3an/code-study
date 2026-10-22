// 과목과 강의 목록의 모양
export const COURSE_IDS = ['java', 'python'] as const;
export type CourseId = (typeof COURSE_IDS)[number];

export function isCourseId(value: string | undefined): value is CourseId {
  return COURSE_IDS.some((id) => id === value);
}

export type Part = {
  id: number;
  title: string;
};

export type Lecture = {
  id: string;
  part: number;
  title: string;
  folder: string;
};

export type Course = {
  id: CourseId;
  title: string;
  subtitle: string;
  parts: readonly Part[];
  lectures: readonly Lecture[];
};

export function findLecture(course: Course, id: string | undefined) {
  return course.lectures.find((l) => l.id === id);
}
