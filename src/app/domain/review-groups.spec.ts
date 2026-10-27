import type { Course } from './course';
import type { QuizQuestion } from './lecture-content';
import type { WrongRecord } from './progress-data';
import { reviewGroups, reviewLectureIds } from './review-groups';

const COURSE: Course = {
  id: 'java',
  title: '자바',
  subtitle: '',
  parts: [{ id: 1, title: '기초' }],
  lectures: [
    { id: '03', part: 1, title: '변수와 상수', folder: '03' },
    { id: '04', part: 1, title: '자료형', folder: '04' },
    { id: '07', part: 1, title: '반복문', folder: '07' },
  ],
};

function q(n: number): QuizQuestion {
  return {
    n,
    kind: 'ox',
    label: 'OX',
    outsideLecture: false,
    prompt: '',
    options: [],
    correct: ['O'],
    answerHead: 'O',
    isExample: false,
    explanation: '',
  };
}

const AT = '2026-10-27T00:00:00.000Z';
const rec = (lectureId: string, n: number): WrongRecord => ({ lectureId, n, at: AT });
const numbers = (groups: ReturnType<typeof reviewGroups>) =>
  groups.map((g) => [g.lecture.id, g.questions.map((x) => x.n), g.failed]);

describe('오답 노트 묶기', () => {
  it('기록을 넣은 순서와 상관없이 강의 목록 순서로 불러오고 묶음', () => {
    const wrong = { '07-1': rec('07', 1), '03-2': rec('03', 2) };
    expect(reviewLectureIds(COURSE, wrong)).toEqual(['03', '07']);
    const groups = reviewGroups(COURSE, wrong, { '07': [q(1)], '03': [q(1), q(2)] });
    expect(numbers(groups)).toEqual([
      ['03', [2], false],
      ['07', [1], false],
    ]);
  });

  it('강의 안에서는 퀴즈 파일 순서대로 나옴', () => {
    const wrong = { '03-5': rec('03', 5), '03-1': rec('03', 1), '03-3': rec('03', 3) };
    const groups = reviewGroups(COURSE, wrong, { '03': [q(1), q(2), q(3), q(4), q(5)] });
    expect(numbers(groups)).toEqual([['03', [1, 3, 5], false]]);
  });

  it('퀴즈 파일에 없는 번호는 빠지고, 다 빠진 강의는 묶음이 없음', () => {
    const wrong = { '03-99': rec('03', 99), '04-3': rec('04', 3), '04-1': rec('04', 1) };
    const groups = reviewGroups(COURSE, wrong, { '03': [q(1), q(2)], '04': [q(1), q(2), q(4)] });
    expect(numbers(groups)).toEqual([['04', [1], false]]);
  });

  it('강의 목록에 없는 강의 번호의 기록은 불러오지도 묶지도 않음', () => {
    const wrong = { '99-1': rec('99', 1), '03-1': rec('03', 1) };
    expect(reviewLectureIds(COURSE, wrong)).toEqual(['03']);
    expect(numbers(reviewGroups(COURSE, wrong, { '03': [q(1)], '99': [q(1)] }))).toEqual([
      ['03', [1], false],
    ]);
  });

  it('키는 달라도 같은 문제를 가리키는 기록이 둘이면 카드는 한 번만 나옴', () => {
    const wrong = { '03-2': rec('03', 2), 'old-key': rec('03', 2) };
    expect(numbers(reviewGroups(COURSE, wrong, { '03': [q(1), q(2)] }))).toEqual([
      ['03', [2], false],
    ]);
  });

  it('퀴즈 파일을 못 불러온 강의는 숨기지 않고 못 불러온 묶음으로 남김', () => {
    const wrong = { '03-2': rec('03', 2), '04-1': rec('04', 1) };
    expect(numbers(reviewGroups(COURSE, wrong, { '03': null, '04': [q(1)] }))).toEqual([
      ['03', [], true],
      ['04', [1], false],
    ]);
  });

  it('아직 불러오지 않은 강의는 묶지 않고, 기록이 없으면 불러올 강의도 묶음도 없음', () => {
    const wrong = { '03-2': rec('03', 2), '04-1': rec('04', 1) };
    expect(numbers(reviewGroups(COURSE, wrong, { '04': [q(1)] }))).toEqual([['04', [1], false]]);
    expect(reviewLectureIds(COURSE, {})).toEqual([]);
    expect(reviewGroups(COURSE, {}, {})).toEqual([]);
  });
});
