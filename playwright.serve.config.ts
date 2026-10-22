import { defineConfig, devices } from '@playwright/test';

// 빌드한 서버에서도 코드 실행과 보호 규칙이 똑같이 동작하는지 확인. 빌드 시간이 걸려 기본 테스트와 따로 돌림
const PORT = 5488;
const BASE_URL = `http://localhost:${PORT}`;
process.env['CODE_STUDY_PORT'] = String(PORT);

export default defineConfig({
  testDir: './e2e',
  testMatch: ['run-api.spec.ts'],
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'serve', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `npm run build && node scripts/check-port.mjs ${PORT} && npm run serve:ssr:code-study`,
    url: BASE_URL,
    reuseExistingServer: false,
    timeout: 300_000,
    env: { CODE_STUDY_CONTENT: 'test-fixtures/content', PORT: String(PORT) },
  },
});
