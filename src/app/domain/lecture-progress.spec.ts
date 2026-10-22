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
  it('진도 체크를 켜면 true 로 저장하고, 끄면 그 값을 지우며 퀴즈 최고 기록은 그대로 둠', () => {
    let data = applyBest(emptyProgress(), '03', 4, 12, AT);
    data = applyCheck(data, '03', 'videoWatched', true);
    expect(isChecked(data, '03', 'videoWatched')).toBe(true);
    data = applyCheck(data, '03', 'videoWatched', false);
    expect(isChecked(data, '03', 'videoWatched')).toBe(false);
    expect('videoWatched' in data.lectures['03']).toBe(false);
    expect('quizBest' in data.lectures['03']).toBe(true);
  });

  it('강의를 열면 마지막에 본 강의를 바꾸고, 이미 그 강의면 같은 객체를 돌려줌', () => {
    const once = applyVisit(emptyProgress(), '07');
    expect(once.lastLectureId).toBe('07');
    expect(applyVisit(once, '07')).toBe(once);
  });

  it('체크 2개를 켜고 퀴즈를 절반 이상 맞히면 끝낸 강의로 봄(12문제 중 6개면 끝낸 강의, 5개면 아직)', () => {
    expect(missingFor(withAll(6), '03')).toEqual([]);
    expect(missingFor(withAll(5), '03')).toEqual(['quiz']);
    // 11문제면 6개 이상 맞혀야 절반 이상
    expect(missingFor(withAll(5, 11), '03')).toEqual(['quiz']);
    expect(missingFor(withAll(6, 11), '03')).toEqual([]);
  });

  it('기록이 없으면 영상, 노트, 퀴즈가 모두 남은 항목이고, 체크 하나를 끄면 그 항목만 남음', () => {
    expect(missingFor(emptyProgress(), '03')).toEqual(['video', 'note', 'quiz']);
    const data = applyCheck(withAll(12), '03', 'noteRead', false);
    expect(missingFor(data, '03')).toEqual(['note']);
  });

  it('끝낸 강의 목록은 기준을 채운 강의만 담음', () => {
    expect([...completedLectures(withAll(9), ['01', '02', '03'])]).toEqual(['03']);
  });
});
