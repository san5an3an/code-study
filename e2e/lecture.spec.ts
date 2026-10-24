import { expect, test } from '@playwright/test';

// 강의 화면 틀: 제목, 진도 체크, 탭, 이전·다음, 이어서 하기 갱신

test('부·강 제목과 노트 탭이 기본으로 보이고, 탭을 바꾸면 주소에 남는다', async ({ page }) => {
  await page.goto('/python/lecture/08');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('08강. 문자열');
  // 사이드바에도 같은 부 이름이 있어서 제목 머리 안에서만 찾음
  await expect(page.locator('header:has(h1)').getByText('3부. 문자열', { exact: true })).toBeVisible();
  await expect(page.getByTestId('tab-note')).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByText('노트 탭은 옮기는 중이에요.')).toBeVisible();

  await page.getByTestId('tab-quiz').click();
  await expect(page).toHaveURL(/\/python\/lecture\/08\?tab=quiz$/);
  await expect(page.getByText('퀴즈 탭은 옮기는 중이에요.')).toBeVisible();

  await page.reload();
  await expect(page.getByTestId('tab-quiz')).toHaveAttribute('aria-selected', 'true');

  await page.getByTestId('tab-note').click();
  await expect(page).toHaveURL(/\/python\/lecture\/08$/);
});

test('모르는 탭 값이면 노트', async ({ page }) => {
  await page.goto('/java/lecture/03?tab=video');
  await expect(page.getByTestId('tab-note')).toHaveAttribute('aria-selected', 'true');
});

test('체크를 켜면 저장되고, 강의를 열면 홈 이어서 하기가 그 강의다', async ({ page }) => {
  await page.goto('/java/lecture/07');
  await expect(page.getByTestId('lecture-status')).toHaveText('끝내려면: 영상, 노트, 퀴즈 절반 이상');

  await page.getByText('영상 봤어요').click();
  await expect(page.getByTestId('lecture-status')).toHaveText('끝내려면: 노트, 퀴즈 절반 이상');

  await page.reload();
  await expect(page.locator('#check-videoWatched')).toHaveAttribute('aria-checked', 'true');

  await page.goto('/java');
  await expect(page.getByTestId('resume')).toContainText('07강. for 반복문');
});

test('이전·다음으로 이동하고, 끝 강은 한쪽만 있다', async ({ page }) => {
  await page.goto('/java/lecture/05');
  await page.getByTestId('lecture-next').click();
  await expect(page).toHaveURL(/\/java\/lecture\/06$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('06강. if 조건문 및 switch-case문');

  await page.goto('/java/lecture/01');
  await expect(page.getByTestId('lecture-prev')).toHaveCount(0);
  await page.goto('/python/lecture/18');
  await expect(page.getByTestId('lecture-next')).toHaveCount(0);
});

test('없는 강의 번호면 없는 강의', async ({ page }) => {
  await page.goto('/python/lecture/22');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('없는 강의예요');
});
