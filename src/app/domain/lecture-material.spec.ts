import type { Frame } from './lecture-content';
import {
  filterLines,
  formatTime,
  frameIndexAt,
  frameRange,
  splitByQuery,
} from './lecture-material';

const frames: Frame[] = [
  { t: 0, file: 'a.jpg' },
  { t: 15, file: 'b.jpg' },
  { t: 30, file: 'c.jpg' },
  { t: 300, file: 'd.jpg' },
];

describe('강의 자료 계산', () => {
  it('초를 분:초 두 자리로 쓰고, 한 시간이 넘으면 시간을 앞에 붙임', () => {
    expect(formatTime(0)).toBe('00:00');
    expect(formatTime(66)).toBe('01:06');
    expect(formatTime(1560)).toBe('26:00');
    expect(formatTime(3735)).toBe('1:02:15');
  });

  it('그 시각 바로 전에 찍은 장면을 고름', () => {
    expect(frameIndexAt(frames, 0)).toBe(0);
    expect(frameIndexAt(frames, 14)).toBe(0);
    expect(frameIndexAt(frames, 15)).toBe(1);
    expect(frameIndexAt(frames, 66)).toBe(2);
    expect(frameIndexAt(frames, 9999)).toBe(3);
  });

  it('장면의 시간대는 다음 장면 시각 전까지이고, 마지막 장면은 끝이 없음', () => {
    expect(frameRange(frames, 1)).toEqual([15, 30]);
    expect(frameRange(frames, 3)).toEqual([300, Infinity]);
  });

  it('검색어가 들어간 부분만 칠할 조각으로 나누고, 대소문자는 가리지 않음', () => {
    expect(splitByQuery('변수와 변수', '변수')).toEqual([
      { text: '변수', hit: true },
      { text: '와 ', hit: false },
      { text: '변수', hit: true },
    ]);
    expect(splitByQuery('int Main', 'main')).toEqual([
      { text: 'int ', hit: false },
      { text: 'Main', hit: true },
    ]);
  });

  it('검색어가 비었거나 공백뿐이면 글 전체를 칠하지 않은 조각 하나로 둠', () => {
    expect(splitByQuery('변수', '')).toEqual([{ text: '변수', hit: false }]);
    expect(splitByQuery('변수', '  ')).toEqual([{ text: '변수', hit: false }]);
  });

  it('정규식 기호가 든 검색어도 글자 그대로 찾음', () => {
    expect(splitByQuery('a.b(c)', '(c)')).toEqual([
      { text: 'a.b', hit: false },
      { text: '(c)', hit: true },
    ]);
  });

  it('검색어가 든 줄만 남기고, 검색어가 비면 전부 남김', () => {
    const lines = [
      { t: 0, text: '변수 선언' },
      { t: 5, text: '타입' },
    ];
    expect(filterLines(lines, ' 변수 ')).toEqual([lines[0]]);
    expect(filterLines(lines, '')).toEqual(lines);
  });
});
