// 퀴즈 코드 문제 채점. 내 코드 출력과 예시 답안 출력을 줄마다 비교함

// 처음 다른 줄. line 은 1부터 셈. 한쪽에 그 줄이 없으면 null
export type OutputDiff = { line: number; expected: string | null; actual: string | null };

// 줄 끝 공백과 맨 끝 빈 줄은 눈에 안 보이니 비교에서 뺌. 윈도우 줄바꿈(\r\n)도 같은 줄바꿈으로 봄
function outputLines(text: string) {
  const lines = text.split(/\r?\n/).map((l) => l.trimEnd());
  while (lines.length > 0 && lines[lines.length - 1] === '') lines.pop();
  return lines;
}

// 같으면 null, 다르면 처음 다른 줄
export function firstOutputDiff(expected: string, actual: string): OutputDiff | null {
  const want = outputLines(expected);
  const got = outputLines(actual);
  for (let i = 0; i < Math.max(want.length, got.length); i++) {
    if (want[i] !== got[i])
      return { line: i + 1, expected: want[i] ?? null, actual: got[i] ?? null };
  }
  return null;
}
