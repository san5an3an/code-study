import { expect, test, type Page } from '@playwright/test';

// 과목 홈: 전체 진행률, 이어서 하기, 부별 진행, 저장 막힘 안내

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
    // 새로고침 때마다 다시 넣지 않게 처음 한 번만
    if (sessionStorage.getItem('seeded')) return;
    sessionStorage.setItem('seeded', '1');
    for (const [k, v] of Object.entries(e)) localStorage.setItem(k, v);
  }, entries);
}

test('처음이면 0%, 01강부터 시작, 부 카드 5개', async ({ page }) => {
  await page.goto('/java');
  await expect(page.getByTestId('overall-progress')).toContainText('0%');
  await expect(page.getByTestId('overall-progress')).toContainText('22강 중 0강 끝냄');
  await expect(page.getByTestId('resume')).toContainText('처음 시작');
  await expect(page.getByTestId('resume').getByRole('link')).toHaveText(/01강부터 시작하기/);
  await expect(page.locator('[data-testid^="home-part-"]')).toHaveCount(5);
  await expect(page.getByTestId('storage-notice')).toHaveCount(0);
});

test('진도가 있으면 이어서 하기로 마지막 강의에 가고, 파이썬 홈은 따로다', async ({ page }) => {
  await seed(page, { 'code-study:java:progress': JSON.stringify(DONE_03) });
  await page.goto('/java');
  await expect(page.getByTestId('overall-progress')).toContainText('5%');
  await expect(page.getByTestId('overall-progress')).toContainText('22강 중 1강 끝냄');
  await expect(page.getByTestId('home-part-1')).toContainText('1/5강');

  await page.getByTestId('resume').getByRole('link', { name: '이어서 하기' }).click();
  await expect(page).toHaveURL(/\/java\/lecture\/03$/);

  await page.goto('/python');
  await expect(page.getByTestId('overall-progress')).toContainText('18강 중 0강 끝냄');
  await expect(page.getByTestId('resume')).toContainText('처음 시작');
});

test('부 카드를 누르면 그 부 첫 강의로 간다', async ({ page }) => {
  await page.goto('/python');
  await page.getByTestId('home-part-3').click();
  await expect(page).toHaveURL(/\/python\/lecture\/08$/);
});

test('저장이 막힌 브라우저면 안내가 뜬다', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new Error('blocked');
    };
  });
  await page.goto('/java');
  await expect(page.getByTestId('storage-notice')).toContainText('진도가 저장되지 않아요');
});

test('어두운 화면에서도 막대 바탕이 카드와 다른 색이다', async ({ page }) => {
  await seed(page, { 'code-study:theme': 'dark' });
  await page.goto('/java');
  const card = page.getByTestId('overall-progress');
  const track = card.locator('[data-slot="progress"]');
  await expect(track).toBeVisible();
  const [trackBg, cardBg] = await Promise.all([
    track.evaluate((el) => getComputedStyle(el).backgroundColor),
    card.evaluate((el) => getComputedStyle(el).backgroundColor),
  ]);
  expect(trackBg).not.toBe(cardBg);
});
