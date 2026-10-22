import { defineConfig, devices } from '@playwright/test';

// 5487 은 이 앱 전용 포트. 다른 앱 서버를 이 앱으로 착각하지 않도록 이미 떠 있는 서버를 재사용하지 않음
const PORT = 5487;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm start',
    url: BASE_URL,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
