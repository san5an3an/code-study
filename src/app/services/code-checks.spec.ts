import type { CheckResponse } from '../core/run-api';
import { CodeChecks, type CheckFn } from './code-checks';

const DIAG = { file: 'Main.java', line: 1, column: 0, severity: 'error' as const, message: 'x' };

function fakeCheck(reply: CheckResponse = { ok: true, diagnostics: [DIAG] }) {
  const calls: { source: string; signal: AbortSignal }[] = [];
  const fn: CheckFn = async (source, signal) => {
    calls.push({ source, signal });
    return reply;
  };
  return { fn, calls };
}

describe('편집기 오타 검사 모음', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('입력이 멈춘 뒤 한 번만 묻고, 앞에 기다리던 검사는 취소함', async () => {
    const checks = new CodeChecks<number>(600);
    const { fn, calls } = fakeCheck();
    checks.request(1, 'a', fn);
    await vi.advanceTimersByTimeAsync(300);
    checks.request(1, 'ab', fn);
    await vi.advanceTimersByTimeAsync(600);
    expect(calls.map((c) => c.source)).toEqual(['ab']);
    expect(checks.results().get(1)).toEqual({ source: 'ab', diagnostics: [DIAG] });
  });

  it('검사 중에 또 고치면 보낸 요청을 취소하고, 늦게 온 옛 결과는 버림', async () => {
    const checks = new CodeChecks<number>(0);
    const signals: AbortSignal[] = [];
    let answerFirst: (r: CheckResponse) => void = () => {};
    const slow: CheckFn = (source, signal) => {
      signals.push(signal);
      return source === 'a'
        ? new Promise((resolve) => (answerFirst = resolve))
        : Promise.resolve({ ok: true, diagnostics: [] });
    };
    checks.request(1, 'a', slow);
    await vi.advanceTimersByTimeAsync(0);
    checks.request(1, 'ab', slow);
    expect(signals[0].aborted).toBe(true);
    await vi.advanceTimersByTimeAsync(0);
    answerFirst({ ok: true, diagnostics: [DIAG] });
    await vi.advanceTimersByTimeAsync(0);
    expect(checks.results().get(1)).toEqual({ source: 'ab', diagnostics: [] });
  });

  it('빈 글은 서버에 묻지 않고 에러 없음으로 둠', async () => {
    const checks = new CodeChecks<number>(0);
    const { fn, calls } = fakeCheck();
    checks.request(1, '  \n', fn);
    await vi.advanceTimersByTimeAsync(10);
    expect(calls).toEqual([]);
    expect(checks.results().get(1)).toEqual({ source: '  \n', diagnostics: [] });
  });

  it('서버가 실패로 답하면 결과를 바꾸지 않음', async () => {
    const checks = new CodeChecks<number>(0);
    checks.request(1, 'a', fakeCheck({ ok: false, error: '없음' }).fn);
    await vi.advanceTimersByTimeAsync(10);
    expect(checks.results().has(1)).toBe(false);
  });

  it('clear 는 기다리던 검사를 멈추고 결과를 모두 비움', async () => {
    const checks = new CodeChecks<number>(600);
    const { fn, calls } = fakeCheck();
    checks.request(1, '', fn);
    checks.request(2, 'b', fn);
    checks.clear();
    await vi.advanceTimersByTimeAsync(1000);
    expect(calls).toEqual([]);
    expect(checks.results().size).toBe(0);
  });
});
