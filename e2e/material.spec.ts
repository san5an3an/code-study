import { expect, test, type Page } from '@playwright/test';

// 강의 자료 탭 확인. public/content 는 npm run sync 결과

const slider = (page: Page) => page.getByRole('slider', { name: '장면 고르기' });
const position = (page: Page) => page.getByTestId('frame-position');

test('자동 받아쓰기 안내, 첫 장면, 받아쓰기 598줄이 보임', async ({ page }) => {
  await page.goto('/java/lecture/03?tab=material');
  await expect(page.getByText('자동 받아쓰기라 틀린 글자가 있을 수 있어요.')).toBeVisible();
  const image = page.getByTestId('frame-image');
  await expect(image).toHaveAttribute('src', '/frames/java/03/t00m00s.jpg');
  await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBe(1280);
  await expect(position(page)).toHaveText('1 / 44 · 00:00');
  await expect(page.getByTestId('transcript-count')).toHaveText('598줄');
  await expect(page.getByTestId('transcript').locator('li')).toHaveCount(598);
  // 손잡이는 하나만 있음
  await expect(page.getByRole('slider')).toHaveCount(1);
});

test('이전, 다음 버튼과 키보드 화살표로 장면을 넘김', async ({ page }) => {
  await page.goto('/java/lecture/03?tab=material');
  await expect(page.getByRole('button', { name: '이전 장면' })).toBeDisabled();
  await page.getByRole('button', { name: '다음 장면' }).click();
  await expect(position(page)).toHaveText('2 / 44 · 00:15');
  await page.getByRole('region', { name: '화면 캡처' }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(position(page)).toHaveText('3 / 44 · 00:30');
  await page.keyboard.press('ArrowLeft');
  await expect(position(page)).toHaveText('2 / 44 · 00:15');
});

test('슬라이더에서 화살표를 누르면 한 칸씩만 움직이고, End 로 마지막 장면에 감', async ({
  page,
}) => {
  await page.goto('/java/lecture/03?tab=material');
  await slider(page).focus();
  await page.keyboard.press('ArrowRight');
  await expect(position(page)).toHaveText('2 / 44 · 00:15');
  await page.keyboard.press('End');
  await expect(position(page)).toHaveText('44 / 44 · 26:00');
  await expect(page.getByRole('button', { name: '다음 장면' })).toBeDisabled();
});

test('받아쓰기 시각을 누르면 그 직전 장면으로 가고, 그 장면의 줄이 표시됨', async ({ page }) => {
  await page.goto('/java/lecture/03?tab=material');
  await page.getByRole('button', { name: '01:06 장면 보기' }).click();
  // 01:06 직전 캡처는 00:30. 같은 화면은 지워 둬서 00:30 다음이 05:00
  await expect(position(page)).toHaveText('3 / 44 · 00:30');
  await expect(page.getByTestId('frame-image')).toHaveAttribute(
    'src',
    '/frames/java/03/t00m30s.jpg',
  );
  const lines = page.getByTestId('transcript').locator('li');
  await expect(lines.filter({ hasText: '01:06' })).toHaveAttribute('data-current', 'true');
  await expect(lines.filter({ hasText: '00:00' })).toHaveAttribute('data-current', 'false');
});

test('검색하면 줄이 걸러지고 찾은 글자가 칠해짐. 없으면 안내가 나옴', async ({ page }) => {
  await page.goto('/java/lecture/03?tab=material');
  const search = page.getByRole('searchbox', { name: '받아쓰기 검색' });
  await search.fill('변수');
  await expect(page.getByTestId('transcript-count')).toHaveText('598줄 중 49줄');
  await expect(page.getByTestId('transcript').locator('li')).toHaveCount(49);
  await expect(page.getByTestId('transcript').locator('mark').first()).toHaveText('변수');
  await search.fill('쿠버네티스');
  await expect(page.getByText('"쿠버네티스"가 들어간 줄이 없어요.')).toBeVisible();
});

test('이 장면 말 보기는 검색어를 지우고 받아쓰기 칸 안에서만 그 자리로 스크롤함', async ({
  page,
}) => {
  await page.goto('/java/lecture/03?tab=material');
  await slider(page).focus();
  for (let n = 0; n < 3; n++) await page.keyboard.press('ArrowRight');
  await expect(position(page)).toHaveText('4 / 44 · 05:00');
  await page.getByRole('searchbox', { name: '받아쓰기 검색' }).fill('변수');
  const button = page.getByRole('button', { name: '이 장면 말 보기' });
  await button.scrollIntoViewIfNeeded();
  const pageY = await page.evaluate(() => window.scrollY);
  await button.click();
  await expect(page.getByTestId('transcript-count')).toHaveText('598줄');
  const current = page.getByTestId('transcript').locator('li[data-current="true"]').first();
  await expect(current).toContainText('05:');
  // 받아쓰기 칸 맨 위에 그 줄이 옴. 페이지는 움직이지 않음
  await expect
    .poll(() =>
      current.evaluate((li) => {
        const box = li.closest('.ng-scroll-viewport')!;
        return Math.round(li.getBoundingClientRect().top - box.getBoundingClientRect().top);
      }),
    )
    .toBe(0);
  expect(await page.evaluate(() => window.scrollY)).toBe(pageY);
});

test('다른 탭을 보고 돌아오면 장면이 남고, 다른 강의로 가면 첫 장면임', async ({ page }) => {
  await page.goto('/java/lecture/03?tab=material');
  await page.getByRole('button', { name: '다음 장면' }).click();
  await page.getByRole('tab', { name: '노트' }).click();
  await page.getByRole('tab', { name: '강의 자료' }).click();
  await expect(position(page)).toHaveText('2 / 44 · 00:15');
  await page
    .getByRole('navigation', { name: '강의 이동' })
    .getByRole('link', { name: '04강' })
    .click();
  await page.getByRole('tab', { name: '강의 자료' }).click();
  await expect(position(page)).toContainText('1 / ');
  await expect(page.getByTestId('frame-image')).toHaveAttribute('src', /\/frames\/java\/04\//);
});

test('자료 파일이 없으면 sync 안내가 나옴', async ({ page }) => {
  await page.route('**/content/java/03/frames.json', (route) =>
    route.fulfill({ status: 404, body: '' }),
  );
  await page.goto('/java/lecture/03?tab=material');
  await expect(page.getByText('강의 자료를 못 불러왔어요')).toBeVisible();
});

test('파이썬은 아직 강의 자료가 없다고 알려 줌', async ({ page }) => {
  await page.goto('/python/lecture/01?tab=material');
  await expect(page.getByTestId('material-none')).toContainText('아직 강의 자료가 없어요');
});

test('어두운 화면에서도 지금 장면 줄, 슬라이더 길, 검색어 칠하기가 배경과 다른 색임', async ({
  page,
}) => {
  await page.goto('/java/lecture/03?tab=material');
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
  await page.getByRole('searchbox', { name: '받아쓰기 검색' }).fill('변수');
  const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  const bgOf = (selector: string) =>
    page
      .locator(selector)
      .first()
      .evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(await bgOf('[data-slot="slider-track"]')).not.toBe(bodyBg);
  expect(await bgOf('.transcript-line mark')).not.toBe(bodyBg);
  await page.getByRole('searchbox', { name: '받아쓰기 검색' }).fill('');
  const line = page.locator('.transcript-line[data-current="true"]').first();
  expect(await line.evaluate((el) => getComputedStyle(el).boxShadow)).toContain('inset');
});
