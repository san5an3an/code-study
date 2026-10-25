import {
  CHECK_PATH,
  CHECK_SNIPPET_PATH,
  RUN_HEADER,
  RUN_HEADER_VALUE,
  type CheckRequest,
} from '../core/run-api';
import { checkCode, checkSnippet } from './check-code';
import { NO_RUNNER } from './run-code';

const REQ: CheckRequest = {
  course: 'java',
  lectureId: '03',
  file: 'AssignExample.java',
  source: 'class A {',
};

function fakeFetch(body: string, status: number) {
  const calls: { url: string; init?: RequestInit }[] = [];
  const fn = (async (url: string, init?: RequestInit) => {
    calls.push({ url, init });
    return new Response(body, { status });
  }) as typeof fetch;
  return { fn, calls };
}

describe('오타 검사 요청', () => {
  it('/api/check 에 POST 로 실행 헤더, 요청 JSON, 취소 신호를 보내고 응답 JSON 을 그대로 돌려줌', async () => {
    const reply = {
      ok: true,
      diagnostics: [
        { file: 'AssignExample.java', line: 1, column: 9, severity: 'error', message: 'x' },
      ],
    };
    const { fn, calls } = fakeFetch(JSON.stringify(reply), 200);
    const signal = new AbortController().signal;
    await expect(checkCode(REQ, signal, fn)).resolves.toEqual(reply);
    expect(calls[0].url).toBe(CHECK_PATH);
    expect(calls[0].init?.method).toBe('POST');
    expect(calls[0].init?.signal).toBe(signal);
    expect((calls[0].init?.headers as Record<string, string>)[RUN_HEADER]).toBe(RUN_HEADER_VALUE);
    expect(JSON.parse(calls[0].init?.body as string)).toEqual(REQ);
  });

  it('검사 주소가 404 글이거나 연결이 안 되면 실행 서버가 없다고 알림', async () => {
    await expect(checkCode(REQ, undefined, fakeFetch('Not Found', 404).fn)).resolves.toEqual({
      ok: false,
      error: NO_RUNNER,
    });
    const down = (async () => {
      throw new TypeError('Failed to fetch');
    }) as typeof fetch;
    await expect(checkCode(REQ, undefined, down)).resolves.toEqual({ ok: false, error: NO_RUNNER });
  });

  it('취소한 요청은 결과 대신 에러를 던져 부른 쪽이 버리게 함', async () => {
    const ctrl = new AbortController();
    const fn = (async () => {
      ctrl.abort();
      throw new DOMException('aborted', 'AbortError');
    }) as typeof fetch;
    await expect(checkCode(REQ, ctrl.signal, fn)).rejects.toThrow('aborted');
  });

  it('퀴즈 답 검사는 /api/check-snippet 에 과목과 코드만 보냄', async () => {
    const { fn, calls } = fakeFetch(JSON.stringify({ ok: true, diagnostics: [] }), 200);
    await expect(
      checkSnippet({ course: 'java', source: 'int a;' }, undefined, fn),
    ).resolves.toEqual({ ok: true, diagnostics: [] });
    expect(calls[0].url).toBe(CHECK_SNIPPET_PATH);
    expect(JSON.parse(calls[0].init?.body as string)).toEqual({ course: 'java', source: 'int a;' });
  });
});
