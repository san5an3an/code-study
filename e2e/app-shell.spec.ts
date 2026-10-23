import { expect, test, type Page } from '@playwright/test';

// 앱 기본 화면 확인: 과목 고르기 메뉴, 과목마다 다른 사이드바, 테마 버튼, 과목마다 따로 저장되는 진도

const DONE_03 = {
  version: 1,
  lastLectureId: '03',
  lectures: {
    '03': {
      videoWatched: true,
      noteRead: true,
      quizBest: { right: 9, total: 12, at: '2026-10-19T12:00:00.000Z' },
    },
  },
  wrong: {},
};

function seed(page: Page, entries: Record<string, string>) {
  return page.addInitScript((e) => {
    // 새로고침할 때마다 저장값을 다시 넣지 않도록 페이지를 처음 열 때 한 번만 넣음
    if (sessionStorage.getItem('seeded')) return;
    sessionStorage.setItem('seeded', '1');
    for (const [k, v] of Object.entries(e)) localStorage.setItem(k, v);
  }, entries);
}

function sidebar(page: Page) {
  return page.locator('[data-slot="sidebar"]');
}

test('자바 사이드바에는 5부 22강이 보이고, 과목 고르기에서 파이썬을 고르면 5부 18강으로 바뀜', async ({ page }) => {
  await page.goto('/java');
  await expect(page.getByText('Java 기초 강의 복습')).toBeVisible();
  await expect(sidebar(page).locator('[data-testid^="part-"]')).toHaveCount(5);
  await expect(sidebar(page).locator('[data-testid^="lecture-link-"]')).toHaveCount(22);

  await page.getByTestId('course-switcher').click();
  const option = page.getByTestId('course-option-python');
  await expect(option).toBeVisible();
  await option.click();

  await expect(page).toHaveURL(/\/python$/);
  await expect(page.getByText('Python 기초 강의 복습')).toBeVisible();
  await expect(sidebar(page).locator('[data-testid^="lecture-link-"]')).toHaveCount(18);
  await expect(sidebar(page).getByTestId('part-3')).toContainText('3부. 문자열');
});

test('사이드바에서 강의를 누르면 그 과목의 강의 주소로 가고 누른 강의만 선택 표시됨', async ({ page }) => {
  await page.goto('/python');
  const link = sidebar(page).getByTestId('lecture-link-09');
  await link.click();
  await expect(page).toHaveURL(/\/python\/lecture\/09$/);
  await expect(link).toHaveAttribute('data-active', 'true');
  await expect(sidebar(page).getByTestId('lecture-link-08')).toHaveAttribute('data-active', 'false');
});

test('테마 버튼을 누르면 data-theme 값이 바뀌고 새로고침해도 바뀐 테마가 유지됨', async ({ page }) => {
  await seed(page, { 'code-study:theme': 'light' });
  await page.goto('/java');
  const html = page.locator('html');
  await expect(html).toHaveAttribute('data-theme', 'light');
  await page.getByTestId('theme-toggle').click();
  await expect(html).toHaveAttribute('data-theme', 'dark');
  await expect(page.getByTestId('theme-toggle')).toHaveAttribute('aria-label', '밝은 화면으로');
  await page.reload();
  await expect(html).toHaveAttribute('data-theme', 'dark');
});

test('java-study 때 저장한 진도를 자바 과목으로 가져와 끝낸 강의에 체크 표시하고, 파이썬 진도에는 섞지 않음', async ({ page }) => {
  await seed(page, { 'java-study:progress': JSON.stringify(DONE_03) });
  await page.goto('/java');
  await expect(sidebar(page).getByTestId('lecture-link-03')).toHaveAttribute('data-done', '');
  await expect(sidebar(page).getByTestId('lecture-link-04')).not.toHaveAttribute('data-done');
  const saved = await page.evaluate(() => localStorage.getItem('code-study:java:progress'));
  expect(JSON.parse(saved!)).toEqual(DONE_03);

  await page.goto('/python');
  await expect(sidebar(page).locator('[data-done]')).toHaveCount(0);
});

test('사이드바 접기 버튼을 누르면 아이콘만 남고, 한 번 더 누르면 다시 펼쳐짐', async ({ page }) => {
  await page.goto('/java');
  const root = page.locator('hlm-sidebar');
  await expect(root).toHaveAttribute('data-state', 'expanded');
  await page.locator('[data-sidebar="trigger"]').click();
  await expect(root).toHaveAttribute('data-state', 'collapsed');
  await page.locator('[data-sidebar="trigger"]').click();
  await expect(root).toHaveAttribute('data-state', 'expanded');
});

test('없는 과목 주소나 과목 아래 없는 주소로 가면 없는 화면 안내가 뜸', async ({ page }) => {
  await page.goto('/ruby');
  await expect(page.getByRole('heading', { name: '없는 화면이에요' })).toBeVisible();
  await page.goto('/java/nope');
  await expect(page.getByRole('heading', { name: '없는 화면이에요' })).toBeVisible();
});
