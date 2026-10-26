import { firstOutputDiff } from './output-compare';

describe('퀴즈 코드 출력 비교', () => {
  it('출력이 같으면 null', () => {
    expect(firstOutputDiff('합계: 55\n', '합계: 55\n')).toBeNull();
  });

  it('줄 끝 공백, 맨 끝 빈 줄, 윈도우 줄바꿈 차이는 같은 출력으로 봄', () => {
    expect(firstOutputDiff('5 4 3 2 1 ', '5 4 3 2 1\n\n')).toBeNull();
    expect(firstOutputDiff('a\nb\n', 'a\r\nb')).toBeNull();
  });

  it('줄 앞 공백과 줄 가운데 공백은 다르게 봄', () => {
    expect(firstOutputDiff('pen     1500', 'pen 1500')).toEqual({
      line: 1,
      expected: 'pen     1500',
      actual: 'pen 1500',
    });
    expect(firstOutputDiff('a', ' a')).not.toBeNull();
  });

  it('처음 다른 줄 번호와 두 줄을 돌려줌', () => {
    expect(firstOutputDiff('3*1=3\n3*2=6\n3*3=9\n', '3*1=3\n3*2=5\n3*3=8\n')).toEqual({
      line: 2,
      expected: '3*2=6',
      actual: '3*2=5',
    });
  });

  it('내 출력이 모자라거나 남으면 없는 쪽을 null 로 돌려줌', () => {
    expect(firstOutputDiff('a\nb\n', 'a\n')).toEqual({ line: 2, expected: 'b', actual: null });
    expect(firstOutputDiff('a\n', 'a\nb\n')).toEqual({ line: 2, expected: null, actual: 'b' });
  });

  it('중간의 빈 줄은 줄로 셈', () => {
    expect(firstOutputDiff('a\n\nb', 'a\nb')).toEqual({ line: 2, expected: '', actual: 'b' });
  });
});
