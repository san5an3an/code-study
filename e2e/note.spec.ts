import { expect, test } from '@playwright/test';

// 노트 탭 확인: 본문 모양, 표 칸 줄바꿈, 강의 옮기기, 불러오기 실패, 폰 폭

test('03강 노트에 소제목, 표, 코드 상자가 보이고 화면의 큰 제목은 하나뿐임', async ({ page }) => {
  await page.goto('/java/lecture/03');
  const note = page.getByTestId('note');
  await expect(
    note.getByRole('heading', { level: 2, name: '이 강의에서 배우는 것' }),
  ).toBeVisible();
  await expect(note.locator('table').first()).toBeVisible();
  await expect(note.locator('pre code').first()).toBeVisible();
  await expect(page.locator('h1')).toHaveCount(1);

  const style = await note.evaluate((el) => {
    const s = getComputedStyle(el);
    return { maxWidth: s.maxWidth, lineHeight: s.lineHeight, wordBreak: s.wordBreak };
  });
  expect(style).toEqual({ maxWidth: '640px', lineHeight: '26px', wordBreak: 'keep-all' });
});

test('06강 표의 else if 칸은 <br> 6개가 실제 줄바꿈으로 들어가고 <br> 글자는 안 보임', async ({
  page,
}) => {
  await page.goto('/java/lecture/06');
  const cell = page.getByTestId('note').locator('td', { hasText: '조건1이 true이면 실행' });
  await expect(cell.locator('br')).toHaveCount(6);
  await expect(cell).not.toContainText('<br>');
});

test('다음 강의 버튼을 누르면 그 강의 노트로 바뀜', async ({ page }) => {
  await page.goto('/java/lecture/03');
  await expect(page.getByTestId('note')).toContainText('데이터란?');
  await page.getByTestId('lecture-next').click();
  await expect(page).toHaveURL(/\/java\/lecture\/04$/);
  await expect(page.getByTestId('note')).toContainText('자료형이 뭐예요?');
  await expect(page.getByTestId('note')).not.toContainText('데이터란?');
});

test('노트 파일을 못 받으면 npm run sync 안내가 뜸', async ({ page }) => {
  await page.route('**/content/java/03/note.md', (route) =>
    route.fulfill({ status: 404, body: '' }),
  );
  await page.goto('/java/lecture/03');
  await expect(page.getByTestId('note-error')).toContainText('npm run sync');
});

test('폰 폭 390px 에서 06강을 열어도 넓은 표와 코드 때문에 페이지가 옆으로 밀리지 않음', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/java/lecture/06');
  await expect(page.getByTestId('note')).toBeVisible();
  const width = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(width).toBe(390);
});
