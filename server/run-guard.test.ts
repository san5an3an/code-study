import assert from 'node:assert/strict';
import type { IncomingMessage } from 'node:http';
import { test } from 'node:test';

import { rejectReason } from './run-guard.ts';

const PORT = 5487;

function req(over: {
  remote?: string;
  headers?: Record<string, string | undefined>;
  method?: string;
}) {
  return {
    socket: { remoteAddress: over.remote ?? '::1' },
    method: over.method ?? 'POST',
    headers: {
      host: `localhost:${PORT}`,
      origin: `http://localhost:${PORT}`,
      'x-code-study': 'run',
      'content-type': 'application/json',
      ...over.headers,
    },
  } as unknown as IncomingMessage;
}

test('올바른 요청은 통과', () => {
  assert.equal(rejectReason(req({}), PORT), null);
  assert.equal(
    rejectReason(
      req({
        remote: '127.0.0.1',
        headers: { host: `127.0.0.1:${PORT}`, origin: `http://127.0.0.1:${PORT}` },
      }),
      PORT,
    ),
    null,
  );
});

const cases: [string, Parameters<typeof req>[0], RegExp][] = [
  ['바깥 컴퓨터 주소', { remote: '192.168.0.10' }, /이 컴퓨터/],
  ['남의 도메인 Host', { headers: { host: `evil.example:${PORT}` } }, /Host/],
  ['포트가 다른 Host', { headers: { host: 'localhost:80' } }, /Host/],
  ['Origin 없음', { headers: { origin: undefined } }, /Origin/],
  ['https Origin', { headers: { origin: `https://localhost:${PORT}` } }, /Origin/],
  ['전용 헤더 없음', { headers: { 'x-code-study': undefined } }, /전용 헤더/],
  [
    '옛 전용 헤더 이름',
    { headers: { 'x-code-study': undefined, 'x-java-study': 'run' } },
    /전용 헤더/,
  ],
  ['PUT', { method: 'PUT' }, /POST/],
  ['폼 전송 본문', { headers: { 'content-type': 'application/x-www-form-urlencoded' } }, /JSON/],
];
for (const [name, over, message] of cases) {
  test(`거절: ${name}`, () => {
    assert.match(rejectReason(req(over), PORT) ?? '', message);
  });
}
