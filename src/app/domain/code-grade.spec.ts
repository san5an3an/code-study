import { OUTPUT_STOPPED, type CodeRun, type SnippetRunResponse } from '../core/run-api';
import { gradedAnswer, gradeOf, gradeVerdict } from './code-grade';
import { EMPTY_ANSWER } from './quiz-answer';

const SOURCE = 'System.out.println(1);';

function ran(run: Partial<CodeRun>): SnippetRunResponse {
  return {
    ok: true,
    diagnostics: [],
    run: { stdout: '', stderr: '', exitCode: 0, timedOut: false, ...run },
  };
}

describe('퀴즈 코드 채점 판정', () => {
  it('출력이 예시 답안 출력과 같으면 맞음', () => {
    const g = gradeOf('합계: 55\n', SOURCE, ran({ stdout: '합계: 55\n' }));
    expect(g).toEqual({ source: SOURCE, outcome: 'right' });
    expect(gradeVerdict(g)).toBe('right');
  });

  it('줄 끝 공백과 맨 끝 빈 줄 차이는 맞음으로 봄', () => {
    expect(gradeOf('5 4 3 2 1 ', SOURCE, ran({ stdout: '5 4 3 2 1\n' })).outcome).toBe('right');
  });

  it('출력이 다르면 틀림이고 처음 다른 줄을 같이 돌려줌', () => {
    const g = gradeOf('3*1=3\n3*2=6\n', SOURCE, ran({ stdout: '3*1=3\n3*2=5\n' }));
    expect(g).toEqual({
      source: SOURCE,
      outcome: 'wrong',
      diff: { line: 2, expected: '3*2=6', actual: '3*2=5' },
    });
    expect(gradeVerdict(g)).toBe('wrong');
  });

  it('실행 중 에러로 멈추면 출력이 맞아도 틀림', () => {
    const stderr = 'Exception in thread "main" java.lang.ArithmeticException: / by zero';
    const g = gradeOf('1\n', SOURCE, ran({ stdout: '1\n', exitCode: 1, stderr }));
    expect(g).toEqual({
      source: SOURCE,
      outcome: 'runError',
      exitCode: 1,
      timedOut: false,
      stderr,
      outputCut: false,
    });
    expect(gradeVerdict(g)).toBe('wrong');
  });

  it('5초를 넘겨 멈추면 틀림', () => {
    const g = gradeOf('1\n', SOURCE, ran({ exitCode: null, timedOut: true }));
    expect(g.outcome).toBe('runError');
    expect(gradeVerdict(g)).toBe('wrong');
  });

  it('출력이 넘쳐 멈추면 틀림이고 outputCut 으로 표시함', () => {
    const stdout = `1\n1\n\n${OUTPUT_STOPPED}`;
    const g = gradeOf('1\n', SOURCE, ran({ stdout, exitCode: null }));
    expect(g).toMatchObject({ outcome: 'runError', exitCode: null, outputCut: true });
    expect(gradeVerdict(g)).toBe('wrong');
  });

  it('끝 코드 없이 죽었는데 출력 넘침 글이 없으면 outputCut 이 아님(신호·메모리 초과)', () => {
    const g = gradeOf('1\n', SOURCE, ran({ stdout: '1\n', exitCode: null }));
    expect(g).toMatchObject({ outcome: 'runError', exitCode: null, outputCut: false });
  });

  it('컴파일 에러면 에러 목록을 돌려주고 기록하지 않음', () => {
    const diagnostics = [
      {
        file: 'Main.java',
        line: 1,
        column: 4,
        severity: 'error' as const,
        message: "';' expected",
      },
    ];
    const g = gradeOf('1\n', SOURCE, { ok: true, diagnostics, run: null });
    expect(g).toEqual({ source: SOURCE, outcome: 'compileError', diagnostics });
    expect(gradeVerdict(g)).toBeNull();
  });

  it('서버가 없거나 거절하면 이유를 돌려주고 기록하지 않음', () => {
    const g = gradeOf('1\n', SOURCE, { ok: false, error: '코드 실행 서버가 없어요.' });
    expect(g).toEqual({ source: SOURCE, outcome: 'failed', error: '코드 실행 서버가 없어요.' });
    expect(gradeVerdict(g)).toBeNull();
  });
});

describe('채점 결과를 답에 붙이기', () => {
  const typed = { ...EMPTY_ANSWER, text: SOURCE, hintsShown: 2 };

  it('맞음이 나면 스스로 체크를 맞음으로 넣고 쓴 답과 힌트 단계는 그대로 둠', () => {
    const grade = gradeOf('1\n', SOURCE, ran({ stdout: '1\n' }));
    expect(gradedAnswer(typed, grade)).toEqual({ ...typed, grade, self: 'right' });
  });

  it('실행 중 에러는 틀림으로 넣음', () => {
    const grade = gradeOf('1\n', SOURCE, ran({ exitCode: 1 }));
    expect(gradedAnswer(typed, grade).self).toBe('wrong');
  });

  it('컴파일 에러나 서버 문제면 앞 체크를 그대로 두고 결과만 붙임', () => {
    const before = { ...typed, self: 'right' as const };
    const grade = gradeOf('1\n', SOURCE, { ok: false, error: '서버 없음' });
    expect(gradedAnswer(before, grade)).toEqual({ ...before, grade });
  });
});
