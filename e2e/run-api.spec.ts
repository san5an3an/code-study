import { request as httpRequest } from 'node:http';
import { networkInterfaces } from 'node:os';

import { expect, test } from '@playwright/test';

// 실행 API 의 막는 장치를 하나씩 어겨 봄. 어긴 요청은 전부 403
// 기본은 개발 서버 5487. 빌드한 서버 설정이 5488 로 바꿔 같은 검사를 돌림
const PORT = Number(process.env.CODE_STUDY_PORT ?? 5487);
const GOOD_HEADERS = {
  Host: `localhost:${PORT}`,
  Origin: `http://localhost:${PORT}`,
  'X-Code-Study': 'run',
  'Content-Type': 'application/json',
};
const BODY = JSON.stringify({
  course: 'java',
  lectureId: '03',
  file: 'AssignExample.java',
  source:
    'public class AssignExample { public static void main(String[] a) { System.out.println("ran"); } }',
  stdin: '',
});

// Host 까지 마음대로 바꾸려고 브라우저가 아닌 node http 로 보냄
function call(opts: {
  method?: string;
  headers?: Record<string, string | undefined>;
  body?: string;
  host?: string;
}) {
  const headers = Object.fromEntries(
    Object.entries({ ...GOOD_HEADERS, ...opts.headers }).filter(([, v]) => v !== undefined),
  ) as Record<string, string>;
  return new Promise<{
    status: number;
    json: { ok: boolean; error?: string; run?: { stdout: string } };
    acao?: string;
  }>((resolve, reject) => {
    const req = httpRequest(
      {
        host: opts.host ?? 'localhost',
        port: PORT,
        path: '/api/run',
        method: opts.method ?? 'POST',
        headers,
      },
      (res) => {
        let text = '';
        res.on('data', (c) => (text += c));
        res.on('end', () => {
          // 앞단이 먼저 막으면 JSON 이 아닌 글로 답하므로 그것도 거절로 봄
          let json: { ok: boolean; error?: string; run?: { stdout: string } };
          try {
            json = text ? JSON.parse(text) : { ok: false };
          } catch {
            json = { ok: false, error: `앞단: ${text.slice(0, 80)}` };
          }
          resolve({
            status: res.statusCode ?? 0,
            json,
            acao: res.headers['access-control-allow-origin'],
          });
        });
      },
    );
    req.on('error', reject);
    req.end(opts.body ?? (opts.method === 'GET' || opts.method === 'OPTIONS' ? undefined : BODY));
  });
}

test('올바른 요청은 실행된다 (대조군)', async ({ page }) => {
  await page.goto('/');
  const r = await call({});
  expect(r.status).toBe(200);
  expect(r.json.run?.stdout).toBe('ran\n');
});

const forged: [string, Parameters<typeof call>[0], RegExp][] = [
  ['전용 헤더 없음 (보통 폼 전송)', { headers: { 'X-Code-Study': undefined } }, /전용 헤더/],
  ['전용 헤더 값이 다름', { headers: { 'X-Code-Study': 'yes' } }, /전용 헤더/],
  ['다른 사이트 Origin', { headers: { Origin: 'http://evil.example' } }, /Origin/],
  ['Origin 없음', { headers: { Origin: undefined } }, /Origin/],
  ['다른 포트의 localhost Origin', { headers: { Origin: 'http://localhost:3000' } }, /Origin/],
  // 개발 서버는 앞단 Host 검사가 먼저 막음. 서버 쪽 검사는 run-guard.test.ts 에서 따로 봄
  ['남의 도메인 Host (DNS 리바인딩)', { headers: { Host: `evil.example:${PORT}` } }, /Host|앞단:/],
  ['GET', { method: 'GET' }, /POST/],
  [
    '사전 확인 OPTIONS',
    { method: 'OPTIONS', headers: { 'Access-Control-Request-Method': 'POST' } },
    /POST/,
  ],
  [
    '다른 localhost 앱의 사전 확인',
    {
      method: 'OPTIONS',
      headers: { Origin: 'http://localhost:3000', 'Access-Control-Request-Method': 'POST' },
    },
    /Origin/,
  ],
  ['JSON 이 아닌 본문 종류', { headers: { 'Content-Type': 'text/plain' } }, /JSON/],
];
for (const [name, opts, message] of forged) {
  test(`거절: ${name}`, async ({ page }) => {
    await page.goto('/');
    const r = await call(opts);
    expect(r.status).toBe(403);
    expect(r.json.ok).toBe(false);
    expect(r.json.error).toMatch(message);
    if (r.json.error?.startsWith('앞단:')) {
      // 앞단이 막은 응답은 요청을 보낸 이 앱 주소에만 허락 헤더가 붙음
      expect([undefined, `http://localhost:${PORT}`]).toContain(r.acao);
    } else {
      expect(r.acao).toBeUndefined();
    }
  });
}

test('다른 사이트 화면에서 브라우저로 부르면 사전 확인에서 막힌다', async ({ page }) => {
  await page.route('http://evil.example/**', (route) =>
    route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>evil</title>' }),
  );
  await page.goto('http://evil.example/');
  const result = await page.evaluate(
    async ({ body, port }) => {
      try {
        const res = await fetch(`http://localhost:${port}/api/run`, {
          method: 'POST',
          headers: { 'X-Code-Study': 'run', 'Content-Type': 'application/json' },
          body,
        });
        return `응답 ${res.status}`;
      } catch (e) {
        return `막힘 ${(e as Error).name}`;
      }
    },
    { body: BODY, port: PORT },
  );
  expect(result).toBe('막힘 TypeError');
});

test('같은 요청을 이 앱 화면에서 보내면 통과한다 (위 테스트의 대조군)', async ({ page }) => {
  await page.goto('/');
  const result = await page.evaluate(async (body) => {
    const res = await fetch('/api/run', {
      method: 'POST',
      headers: { 'X-Code-Study': 'run', 'Content-Type': 'application/json' },
      body,
    });
    return `응답 ${res.status} ${(await res.json()).run.stdout}`;
  }, BODY);
  expect(result).toBe('응답 200 ran\n');
});

test('이 컴퓨터의 다른 네트워크 주소로는 서버에 닿지 않는다', async () => {
  const lan = Object.values(networkInterfaces())
    .flat()
    .find((i) => i && i.family === 'IPv4' && !i.internal)?.address;
  test.skip(!lan, '바깥 네트워크 주소가 없는 환경');
  await expect(call({ host: lan })).rejects.toThrow(/ECONNREFUSED/);
});

test('없는 과목이면 400 이고 실행하지 않는다', async ({ page }) => {
  await page.goto('/');
  const r = await call({
    body: JSON.stringify({
      course: 'python',
      lectureId: '03',
      file: 'a.py',
      source: 'print(1)',
      stdin: '',
    }),
  });
  expect(r.status).toBe(400);
  expect(r.json.error).toMatch(/과목/);
});
