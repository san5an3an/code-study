import { expect, test } from '@playwright/test';

// 강의 화면 확인: 제목, 진도 체크, 탭, 이전·다음 버튼, 홈 이어서 하기 갱신

test('강의를 열면 부 이름, 강의 제목, 노트 탭이 먼저 보이고 다른 탭을 누르면 주소 끝에 탭 이름이 붙음', async ({ page }) => {
  await page.goto('/python/lecture/08');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('08강. 문자열');
  // 사이드바에도 같은 부 이름이 있어서 강의 제목이 있는 header 안에서만 찾음
  await expect(page.locator('header:has(h1)').getByText('3부. 문자열', { exact: true })).toBeVisible();
  await expect(page.getByTestId('tab-note')).toHaveAttribute('aria-selected', 'true');
  // 파이썬은 노트가 아직 없어서 없다는 안내가 보임
  await expect(page.getByTestId('note-none')).toBeVisible();

  await page.getByTestId('tab-quiz').click();
  await expect(page).toHaveURL(/\/python\/lecture\/08\?tab=quiz$/);
  await expect(page.getByText('퀴즈 탭은 옮기는 중이에요.')).toBeVisible();

  await page.reload();
  await expect(page.getByTestId('tab-quiz')).toHaveAttribute('aria-selected', 'true');

  await page.getByTestId('tab-note').click();
  await expect(page).toHaveURL(/\/python\/lecture\/08$/);
});

test('주소의 탭 이름이 없는 탭이면 노트 탭을 보여 줌', async ({ page }) => {
  await page.goto('/java/lecture/03?tab=video');
  await expect(page.getByTestId('tab-note')).toHaveAttribute('aria-selected', 'true');
});

test('진도 체크를 켜면 새로고침해도 남고, 강의를 열면 홈의 이어서 하기가 그 강의를 가리킴', async ({ page }) => {
  await page.goto('/java/lecture/07');
  await expect(page.getByTestId('lecture-status')).toHaveText('끝내려면: 영상, 노트, 퀴즈 절반 이상');

  await page.getByText('영상 봤어요').click();
  await expect(page.getByTestId('lecture-status')).toHaveText('끝내려면: 노트, 퀴즈 절반 이상');

  await page.reload();
  await expect(page.locator('#check-videoWatched')).toHaveAttribute('aria-checked', 'true');

  await page.goto('/java');
  await expect(page.getByTestId('resume')).toContainText('07강. for 반복문');
});

test('이전·다음 버튼으로 강의를 옮겨 다니고, 첫 강의엔 이전 버튼이, 마지막 강의엔 다음 버튼이 없음', async ({ page }) => {
  await page.goto('/java/lecture/05');
  await page.getByTestId('lecture-next').click();
  await expect(page).toHaveURL(/\/java\/lecture\/06$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('06강. if 조건문 및 switch-case문');

  await page.goto('/java/lecture/01');
  await expect(page.getByTestId('lecture-prev')).toHaveCount(0);
  await page.goto('/python/lecture/18');
  await expect(page.getByTestId('lecture-next')).toHaveCount(0);
});

test('없는 강의 번호로 들어오면 없는 강의라는 제목이 뜸', async ({ page }) => {
  await page.goto('/python/lecture/22');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('없는 강의예요');
});
