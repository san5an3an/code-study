import { expect, test, type Page } from '@playwright/test';

// 과목 홈 화면 확인: 전체 진행률 카드, 이어서 하기 카드, 부별 진행 카드, 저장이 막혔을 때의 안내

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

test('진도가 없으면 진행률 0%, 01강부터 시작하기 링크, 부별 진행 카드 5개가 보임', async ({ page }) => {
  await page.goto('/java');
  await expect(page.getByTestId('overall-progress')).toContainText('0%');
  await expect(page.getByTestId('overall-progress')).toContainText('22강 중 0강 끝냄');
  await expect(page.getByTestId('resume')).toContainText('처음 시작');
  await expect(page.getByTestId('resume').getByRole('link')).toHaveText(/01강부터 시작하기/);
  await expect(page.locator('[data-testid^="home-part-"]')).toHaveCount(5);
  await expect(page.getByTestId('storage-notice')).toHaveCount(0);
});

test('진도가 있으면 이어서 하기 링크가 마지막에 본 강의로 가고, 파이썬 홈은 자바 진도와 섞이지 않음', async ({ page }) => {
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

test('부별 진행 카드를 누르면 그 부의 첫 강의로 감', async ({ page }) => {
  await page.goto('/python');
  await page.getByTestId('home-part-3').click();
  await expect(page).toHaveURL(/\/python\/lecture\/08$/);
});

test('브라우저 저장이 막혀 있으면 진도가 저장되지 않는다는 안내가 뜸', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new Error('blocked');
    };
  });
  await page.goto('/java');
  await expect(page.getByTestId('storage-notice')).toContainText('진도가 저장되지 않아요');
});

test('어두운 화면에서도 진행 막대 바탕색이 카드 바탕색과 다름', async ({ page }) => {
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
