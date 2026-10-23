import { applyCheck, applyVisit, completedLectures, isChecked, missingFor } from './lecture-progress';
import { emptyProgress, type ProgressData } from './progress-data';
import { applyBest } from './quiz-record';

const AT = '2026-10-19T12:00:00.000Z';

function withAll(right: number, total = 12): ProgressData {
  let data = applyCheck(emptyProgress(), '03', 'videoWatched', true);
  data = applyCheck(data, '03', 'noteRead', true);
  return applyBest(data, '03', right, total, AT);
}

describe('강의 진도', () => {
  it('체크를 켜면 true, 끄면 칸이 없어지고 최고 기록은 그대로', () => {
    let data = applyBest(emptyProgress(), '03', 4, 12, AT);
    data = applyCheck(data, '03', 'videoWatched', true);
    expect(isChecked(data, '03', 'videoWatched')).toBe(true);
    data = applyCheck(data, '03', 'videoWatched', false);
    expect(isChecked(data, '03', 'videoWatched')).toBe(false);
    expect('videoWatched' in data.lectures['03']).toBe(false);
    expect('quizBest' in data.lectures['03']).toBe(true);
  });

  it('방문은 마지막 강의를 바꾸고, 같은 강의면 같은 객체를 돌려줌', () => {
    const once = applyVisit(emptyProgress(), '07');
    expect(once.lastLectureId).toBe('07');
    expect(applyVisit(once, '07')).toBe(once);
  });

  it('체크 둘 + 퀴즈 절반이면 끝, 12문제 중 6개는 끝이고 5개는 아님', () => {
    expect(missingFor(withAll(6), '03')).toEqual([]);
    expect(missingFor(withAll(5), '03')).toEqual(['quiz']);
    // 11문제면 6개부터 절반 이상
    expect(missingFor(withAll(5, 11), '03')).toEqual(['quiz']);
    expect(missingFor(withAll(6, 11), '03')).toEqual([]);
  });

  it('기록이 없으면 셋 다 남았고, 체크 하나가 빠지면 그것만 남음', () => {
    expect(missingFor(emptyProgress(), '03')).toEqual(['video', 'note', 'quiz']);
    const data = applyCheck(withAll(12), '03', 'noteRead', false);
    expect(missingFor(data, '03')).toEqual(['note']);
  });

  it('끝낸 강의 목록은 기준을 채운 강의만 담음', () => {
    expect([...completedLectures(withAll(9), ['01', '02', '03'])]).toEqual(['03']);
  });
});
