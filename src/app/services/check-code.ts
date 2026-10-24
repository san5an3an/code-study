// 편집기 오타 표시용. 서버의 /api/check 에 컴파일만 부탁하고 에러 위치를 받음. 실패도 CheckResponse 로 돌려줌
import {
  CHECK_PATH,
  RUN_HEADER,
  RUN_HEADER_VALUE,
  type CheckRequest,
  type CheckResponse,
} from '../core/run-api';
import { NO_RUNNER } from './run-code';

export async function checkCode(
  req: CheckRequest,
  signal?: AbortSignal,
  fetchFn: typeof fetch = fetch,
): Promise<CheckResponse> {
  try {
    const res = await fetchFn(CHECK_PATH, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', [RUN_HEADER]: RUN_HEADER_VALUE },
      body: JSON.stringify(req),
      signal,
    });
    const body = (await res.json().catch(() => null)) as CheckResponse | null;
    if (body) return body;
    if (res.status === 404) return { ok: false, error: NO_RUNNER };
    return { ok: false, error: `서버 응답을 읽지 못했어요 (${res.status})` };
  } catch (e) {
    // 새 글자를 쳐서 앞 요청을 취소한 경우는 부른 쪽이 결과를 버리도록 에러를 그대로 던짐
    if (signal?.aborted) throw e;
    return { ok: false, error: NO_RUNNER };
  }
}
