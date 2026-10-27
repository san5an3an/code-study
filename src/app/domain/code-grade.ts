// 퀴즈 코드 문제 채점 판정. 서버가 내 코드를 돌린 결과와 예시 답안 출력을 비교함
import type { CodeDiagnostic, SnippetRunResponse } from '../core/run-api';
import { firstOutputDiff, type OutputDiff } from './output-compare';
import type { Answer } from './quiz-answer';
import type { Verdict } from './quiz-record';

// source 는 채점한 코드. 편집기 글과 다르면 채점 뒤에 코드를 고친 것
export type CodeGrade =
  | { source: string; outcome: 'right' }
  | { source: string; outcome: 'wrong'; diff: OutputDiff }
  // 실행 중 에러로 멈춤(exitCode 가 0 이 아님), 5초 넘김(timedOut), 출력이 64KB 를 넘어 멈춤(exitCode 가 null)
  | {
      source: string;
      outcome: 'runError';
      exitCode: number | null;
      timedOut: boolean;
      stderr: string;
    }
  | { source: string; outcome: 'compileError'; diagnostics: CodeDiagnostic[] }
  // 서버가 없거나 요청을 거절함
  | { source: string; outcome: 'failed'; error: string };

export function gradeOf(expected: string, source: string, res: SnippetRunResponse): CodeGrade {
  if (!res.ok) return { source, outcome: 'failed', error: res.error };
  const run = res.run;
  if (!run) return { source, outcome: 'compileError', diagnostics: res.diagnostics };
  if (run.timedOut || run.exitCode !== 0) {
    return {
      source,
      outcome: 'runError',
      exitCode: run.exitCode,
      timedOut: run.timedOut,
      stderr: run.stderr,
    };
  }
  const diff = firstOutputDiff(expected, run.stdout);
  return diff ? { source, outcome: 'wrong', diff } : { source, outcome: 'right' };
}

// 끝까지 돌지 못한 실행도 틀림으로 기록함. 컴파일 에러와 서버 문제는 기록하지 않음(null)
export function gradeVerdict(grade: CodeGrade): Verdict | null {
  switch (grade.outcome) {
    case 'right':
      return 'right';
    case 'wrong':
    case 'runError':
      return 'wrong';
    default:
      return null;
  }
}

// 채점 결과를 답에 붙임. 맞음/틀림이 나면 스스로 체크처럼 넣고(사용자가 바꿀 수 있음), 기록하지 않는 결과면 앞 체크를 그대로 둠
export function gradedAnswer(before: Answer, grade: CodeGrade): Answer {
  return { ...before, grade, self: gradeVerdict(grade) ?? before.self };
}
