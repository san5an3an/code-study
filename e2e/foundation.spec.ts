import { expect, test } from '@playwright/test';

// 바탕 설치 확인: Spartan 사이드바 + lucide 아이콘 + Cobalt 색 + data-theme

test('첫 화면은 /java 로 가고 Spartan 사이드바와 lucide 아이콘이 Cobalt 색으로 보인다', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await expect(page).toHaveURL(/\/java$/);
  const switcher = page.getByTestId('course-switcher');
  await expect(switcher).toBeVisible();
  // 과목 아이콘 칸은 Cobalt 브랜드 색 #0052cc
  const iconBox = switcher.locator('div.bg-primary');
  await expect(iconBox).toHaveCSS('background-color', 'rgb(0, 82, 204)');
  await expect(iconBox.locator('svg')).toHaveCount(1);
  await expect(page.locator('html')).toHaveAttribute('data-theme', /^(light|dark)$/);
  expect(errors).toEqual([]);
});

test('어두운 화면으로 바꾸면 Cobalt 어두운 배경색이 된다', async ({ page }) => {
  await page.goto('/java');
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(34, 34, 35)');
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(252, 253, 253)');
});

test('java-study 때 저장한 테마를 이어받는다', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('java-study:theme', 'dark'));
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('허락하지 않은 Host 로 온 요청은 화면을 주지 않는다', async ({ request }) => {
  const res = await request.get('/', { headers: { Host: 'evil.example' } });
  // 개발 서버는 앞단(Vite)이 403 으로 막음. 빌드한 서버는 Angular SSR 이 400 으로 막음
  expect(res.status()).toBe(403);
});
