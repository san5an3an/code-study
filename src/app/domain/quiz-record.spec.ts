import { emptyProgress } from './progress-data';
import { applyBest, applyVerdict, quizBestOf } from './quiz-record';

const T1 = '2026-10-19T12:00:00.000Z';
const T2 = '2026-10-19T13:00:00.000Z';

describe('퀴즈 기록', () => {
  it('틀리면 오답 노트에 들어가고, 다시 틀리면 시각만 새로 씀', () => {
    const once = applyVerdict(emptyProgress(), '03', 5, 'wrong', T1);
    expect(once.wrong).toEqual({ '03-5': { lectureId: '03', n: 5, at: T1 } });
    const twice = applyVerdict(once, '03', 5, 'wrong', T2);
    expect(Object.keys(twice.wrong)).toEqual(['03-5']);
    expect(twice.wrong['03-5'].at).toBe(T2);
  });

  it('맞히면 오답 노트에서 빠지고, 다른 문제는 그대로', () => {
    let data = applyVerdict(emptyProgress(), '03', 5, 'wrong', T1);
    data = applyVerdict(data, '04', 2, 'wrong', T1);
    data = applyVerdict(data, '03', 5, 'right', T2);
    expect(Object.keys(data.wrong)).toEqual(['04-2']);
  });

  it('없는 문제를 맞히면 진도가 그대로(같은 객체)', () => {
    const data = emptyProgress();
    expect(applyVerdict(data, '03', 5, 'right', T1)).toBe(data);
  });

  it('최고 점수는 더 많이 맞혔을 때만 바뀌고, 다른 강의 기록은 건드리지 않음', () => {
    let data = applyBest(emptyProgress(), '03', 5, 12, T1);
    expect(quizBestOf(data, '03')).toEqual({ right: 5, total: 12, at: T1 });
    expect(applyBest(data, '03', 5, 12, T2)).toBe(data);
    expect(applyBest(data, '03', 3, 12, T2)).toBe(data);
    data = applyBest(data, '03', 9, 12, T2);
    expect(quizBestOf(data, '03')).toEqual({ right: 9, total: 12, at: T2 });
    expect(quizBestOf(data, '04')).toBeNull();
  });

  it('모양이 틀린 최고 점수는 없는 것으로 봄', () => {
    const data = { ...emptyProgress(), lectures: { '03': { quizBest: { right: '9' } } } };
    expect(quizBestOf(data, '03')).toBeNull();
  });
});
