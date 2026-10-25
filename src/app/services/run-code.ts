// 코드 탭의 실행 버튼이 개발 서버나 빌드한 서버의 /api/run 을 부름. 실패도 RunResponse 로 돌려줌
import {
  RUN_HEADER,
  RUN_HEADER_VALUE,
  RUN_PATH,
  type RunRequest,
  type RunResponse,
} from '../core/run-api';

export const NO_RUNNER = '코드 실행 서버가 없어요. 터미널에서 npm start 로 켜 주세요.';

export async function runCode(
  req: RunRequest,
  fetchFn: typeof fetch = fetch,
): Promise<RunResponse> {
  try {
    const res = await fetchFn(RUN_PATH, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', [RUN_HEADER]: RUN_HEADER_VALUE },
      body: JSON.stringify(req),
    });
    const body = (await res.json().catch(() => null)) as RunResponse | null;
    if (body) return body;
    // 빌드한 파일을 실행 API 없는 다른 서버로 열면 실행 주소가 404 로 옴
    if (res.status === 404) return { ok: false, error: NO_RUNNER };
    return { ok: false, error: `서버 응답을 읽지 못했어요 (${res.status})` };
  } catch {
    return { ok: false, error: NO_RUNNER };
  }
}
