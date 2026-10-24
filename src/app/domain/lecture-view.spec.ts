import { findLecture } from './course';
import { lectureContext, tabOf } from './lecture-view';
import { JAVA_COURSE } from './lectures-java';
import { PYTHON_COURSE } from './lectures-python';

describe('강의 화면 계산', () => {
  it('주소의 탭 값은 있는 탭 이름만 받고, 나머지는 노트 탭으로 봄', () => {
    expect(tabOf('quiz')).toBe('quiz');
    expect(tabOf('material')).toBe('material');
    expect(tabOf(null)).toBe('note');
    expect(tabOf('video')).toBe('note');
  });

  it('첫 강의는 이전 강의가 없고, 부가 바뀌어도 다음 강의로 이어짐', () => {
    const first = lectureContext(JAVA_COURSE, findLecture(JAVA_COURSE, '01')!);
    expect(first.prev).toBeUndefined();
    expect(first.next?.id).toBe('02');
    expect(first.part?.title).toBe('자바 시작하기');

    const end = lectureContext(JAVA_COURSE, findLecture(JAVA_COURSE, '05')!);
    expect(end.next?.id).toBe('06');
  });

  it('마지막 강의는 다음 강의가 없음(자바 22강, 파이썬 18강)', () => {
    expect(lectureContext(JAVA_COURSE, findLecture(JAVA_COURSE, '22')!).next).toBeUndefined();
    const last = lectureContext(PYTHON_COURSE, findLecture(PYTHON_COURSE, '18')!);
    expect(last.next).toBeUndefined();
    expect(last.prev?.id).toBe('17');
    expect(last.part?.title).toBe('조건과 반복');
  });
});
