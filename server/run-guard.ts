// 다른 사이트가 이 컴퓨터에서 코드를 몰래 실행시키지 못하게 요청을 걸러냄
import type { IncomingMessage } from 'node:http';

import { RUN_HEADER, RUN_HEADER_VALUE } from '../src/app/core/run-api.ts';

const LOOPBACK = new Set(['127.0.0.1', '::1', '::ffff:127.0.0.1']);

// 규칙에 걸리면 거절 이유를, 통과하면 null 을 돌려줌. 포트는 요청이 들어온 포트를 써서 개발 서버와 빌드한 서버에 같은 검사가 걸림
export function rejectReason(req: IncomingMessage, port: number): string | null {
  const allowedHosts = [`localhost:${port}`, `127.0.0.1:${port}`];
  const allowedOrigins = allowedHosts.map((h) => `http://${h}`);

  if (!LOOPBACK.has(req.socket.remoteAddress ?? '')) return '이 컴퓨터에서 온 요청이 아님';
  if (!allowedHosts.includes(req.headers.host ?? '')) return 'Host 가 이 앱이 아님';
  if (!allowedOrigins.includes(req.headers.origin ?? '')) return 'Origin 이 없거나 이 앱이 아님';
  if (req.headers[RUN_HEADER] !== RUN_HEADER_VALUE) return '전용 헤더가 없음';
  if (req.method !== 'POST') return 'POST 만 받음';
  if (!(req.headers['content-type'] ?? '').startsWith('application/json')) return 'JSON 이 아님';
  return null;
}
