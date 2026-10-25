import { RUN_HEADER, RUN_HEADER_VALUE, type RunRequest } from '../core/run-api';
import { NO_RUNNER, runCode } from './run-code';

const REQ: RunRequest = {
  course: 'java',
  lectureId: '03',
  file: 'AssignExample.java',
  source: 'class A {}',
  stdin: '',
};

function fakeFetch(body: string, status: number) {
  const calls: { url: string; init?: RequestInit }[] = [];
  const fn = (async (url: string, init?: RequestInit) => {
    calls.push({ url, init });
    return new Response(body, { status });
  }) as typeof fetch;
  return { fn, calls };
}

describe('코드 실행 요청', () => {
  it('/api/run 에 POST 로 실행 헤더와 요청 JSON 을 보내고 응답 JSON 을 그대로 돌려줌', async () => {
    const reply = {
      ok: true,
      compile: { stdout: '', stderr: '', exitCode: 0, timedOut: false },
      run: null,
    };
    const { fn, calls } = fakeFetch(JSON.stringify(reply), 200);
    await expect(runCode(REQ, fn)).resolves.toEqual(reply);
    expect(calls).toHaveLength(1);
    expect(calls[0].url).toBe('/api/run');
    expect(calls[0].init?.method).toBe('POST');
    expect((calls[0].init?.headers as Record<string, string>)[RUN_HEADER]).toBe(RUN_HEADER_VALUE);
    expect(JSON.parse(calls[0].init?.body as string)).toEqual(REQ);
  });

  it('서버가 거절해도 JSON 으로 온 이유를 그대로 돌려줌', async () => {
    const reply = { ok: false, error: '이미 실행 중인 코드가 많아요.' };
    const { fn } = fakeFetch(JSON.stringify(reply), 429);
    await expect(runCode(REQ, fn)).resolves.toEqual(reply);
  });

  it('실행 주소가 404 글로 오면 실행 서버가 없다고 알림', async () => {
    const { fn } = fakeFetch('Not Found', 404);
    await expect(runCode(REQ, fn)).resolves.toEqual({ ok: false, error: NO_RUNNER });
  });

  it('404 가 아닌데 JSON 이 아니면 상태 코드를 알림', async () => {
    const { fn } = fakeFetch('<html>', 502);
    await expect(runCode(REQ, fn)).resolves.toEqual({
      ok: false,
      error: '서버 응답을 읽지 못했어요 (502)',
    });
  });

  it('서버에 연결하지 못하면 실행 서버가 없다고 알림', async () => {
    const fn = (async () => {
      throw new TypeError('Failed to fetch');
    }) as typeof fetch;
    await expect(runCode(REQ, fn)).resolves.toEqual({ ok: false, error: NO_RUNNER });
  });
});
