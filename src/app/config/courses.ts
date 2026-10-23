import type { Course, CourseId } from '../domain/course';
import { JAVA_COURSE } from '../domain/lectures-java';
import { PYTHON_COURSE } from '../domain/lectures-python';

// 과목 고르기에 나오는 순서
export const COURSES: readonly Course[] = [JAVA_COURSE, PYTHON_COURSE];

export const DEFAULT_COURSE: CourseId = 'java';

export function courseOf(id: CourseId): Course {
  return COURSES.find((c) => c.id === id)!;
}
