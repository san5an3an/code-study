import { JAVA_COURSE } from './lectures-java';
import { PYTHON_COURSE } from './lectures-python';
import { partSummaries, percent, resumeOf } from './course-summary';

describe('과목 요약', () => {
  it('퍼센트는 반올림하고, 전체가 0이면 0', () => {
    expect(percent(0, 22)).toBe(0);
    expect(percent(1, 3)).toBe(33);
    expect(percent(2, 3)).toBe(67);
    expect(percent(0, 0)).toBe(0);
  });

  it('부별 강의 수는 실제 목록을 셈(자바 5·4·2·8·3, 파이썬 4·3·5·3·3)', () => {
    expect(partSummaries(JAVA_COURSE, new Set()).map((s) => s.total)).toEqual([5, 4, 2, 8, 3]);
    expect(partSummaries(PYTHON_COURSE, new Set()).map((s) => s.total)).toEqual([4, 3, 5, 3, 3]);
  });

  it('부별 끝낸 수와 첫 강의', () => {
    const [first, second] = partSummaries(JAVA_COURSE, new Set(['03', '07', '08']));
    expect(first.done).toBe(1);
    expect(second.done).toBe(2);
    expect(second.first.id).toBe('06');
  });

  it('마지막 강의가 있으면 이어서, 없거나 목록에 없으면 첫 강의부터', () => {
    expect(resumeOf(JAVA_COURSE, '09')).toEqual({ lecture: JAVA_COURSE.lectures[8], resumed: true });
    expect(resumeOf(JAVA_COURSE, null).resumed).toBe(false);
    expect(resumeOf(JAVA_COURSE, null).lecture.id).toBe('01');
    // 파이썬은 18강까지라 22강 기록은 없는 것으로 봄
    expect(resumeOf(PYTHON_COURSE, '22')).toEqual({
      lecture: PYTHON_COURSE.lectures[0],
      resumed: false,
    });
  });
});
