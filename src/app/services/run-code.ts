// 코드 탭의 실행 버튼은 /api/run, 퀴즈 코드 문제의 채점하기는 /api/run-snippet 을 부름. 실패도 응답 형식으로 돌려줌
import {
  RUN_HEADER,
  RUN_HEADER_VALUE,
  RUN_PATH,
  RUN_SNIPPET_PATH,
  type RunRequest,
  type RunResponse,
  type SnippetRunRequest,
  type SnippetRunResponse,
} from '../core/run-api';

export const NO_RUNNER = '코드 실행 서버가 없어요. 터미널에서 npm start 로 켜 주세요.';

export function runCode(req: RunRequest, fetchFn: typeof fetch = fetch): Promise<RunResponse> {
  return post(RUN_PATH, req, fetchFn);
}

export function runSnippet(
  req: SnippetRunRequest,
  fetchFn: typeof fetch = fetch,
): Promise<SnippetRunResponse> {
  return post(RUN_SNIPPET_PATH, req, fetchFn);
}

async function post<T extends RunResponse | SnippetRunResponse>(
  url: string,
  req: RunRequest | SnippetRunRequest,
  fetchFn: typeof fetch,
): Promise<T> {
  try {
    const res = await fetchFn(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', [RUN_HEADER]: RUN_HEADER_VALUE },
      body: JSON.stringify(req),
    });
    const body = (await res.json().catch(() => null)) as T | null;
    if (body) return body;
    // 빌드한 파일을 실행 API 없는 다른 서버로 열면 실행 주소가 404 로 옴
    if (res.status === 404) return { ok: false, error: NO_RUNNER } as T;
    return { ok: false, error: `서버 응답을 읽지 못했어요 (${res.status})` } as T;
  } catch {
    return { ok: false, error: NO_RUNNER } as T;
  }
}
