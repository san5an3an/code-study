// javac 에러 출력을 줄, 칸, 문구 목록으로 바꿈. 편집기가 오타 자리에 밑줄을 긋는 데 씀
import type { CodeDiagnostic } from '../src/app/core/run-api.ts';

// 예: "AssignExample.java:3: error: ';' expected"
const HEADER = /^(.+?\.java):(\d+): (error|warning): (.*)$/;
// javac 는 문제 줄을 다시 보여 주고 그 아래 줄에 ^ 로 칸을 가리킴
const CARET = /^\s*\^\s*$/;
// "2 errors", "1 warning" 같은 끝 요약 줄과 "Note:" 안내 줄은 문구에 넣지 않음
const TRAILER = /^(\d+ (errors?|warnings?)|Note: .*)$/;

export function parseJavacErrors(stderr: string): CodeDiagnostic[] {
  const lines = stderr.replace(/\r\n/g, '\n').split('\n');
  const found: CodeDiagnostic[] = [];
  let i = 0;
  while (i < lines.length) {
    const head = HEADER.exec(lines[i]);
    i++;
    if (!head) continue;
    const [, file, line, severity, message] = head;
    let column = 0;
    // 문제 줄 다음이 ^ 줄이면 ^ 의 위치가 칸 번호. ^ 줄이 없는 에러도 있어서 그땐 줄 맨 앞으로 둠
    if (i + 1 < lines.length && CARET.test(lines[i + 1])) {
      column = lines[i + 1].indexOf('^');
      i += 2;
    }
    // "symbol: variable z" 처럼 들여쓴 덧붙임 줄은 다음 에러 머리 줄이 나올 때까지 문구에 이어 붙임
    const extra: string[] = [];
    while (
      i < lines.length &&
      lines[i] !== '' &&
      !HEADER.test(lines[i]) &&
      !TRAILER.test(lines[i])
    ) {
      extra.push(lines[i].trim());
      i++;
    }
    found.push({
      file,
      line: Number(line),
      column,
      severity: severity as CodeDiagnostic['severity'],
      message: [message, ...extra].join('\n'),
    });
  }
  return found;
}
