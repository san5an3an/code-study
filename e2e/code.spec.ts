import { expect, test, type Page } from '@playwright/test';

// 코드 탭 확인. public/content 는 npm run sync 결과

const fileTabs = (page: Page) => page.getByRole('tablist', { name: '예제 파일' }).getByRole('tab');
// 퀴즈 탭 편집기도 숨은 채 같이 있어서 예제 파일 편집기만 고름
const editor = (page: Page) => page.locator('.cm-content[aria-label$=".java 코드"]');

test('03강 코드 탭은 파일 3개를 보여 주고, 첫 파일 코드와 미리 돌린 결과가 보임', async ({
  page,
}) => {
  await page.goto('/java/lecture/03?tab=code');
  await expect(fileTabs(page)).toHaveText([
    'AssignExample.java',
    'DataTypeExample.java',
    'VariableExample.java',
  ]);
  await expect(fileTabs(page).first()).toHaveAttribute('aria-selected', 'true');
  await expect(editor(page)).toContainText('public class AssignExample');
  await expect(page.getByTestId('run-stdout')).toHaveText('50\n60\n50\n80\n85\n');
  await expect(page.getByTestId('run-stderr')).toHaveCount(0);
});

test('고른 파일은 주소에 남아 새로고침해도 유지되고, 목록에 없는 이름이면 첫 파일을 엶', async ({
  page,
}) => {
  await page.goto('/java/lecture/03?tab=code');
  await fileTabs(page).nth(1).click();
  await expect(page).toHaveURL(/\/java\/lecture\/03\?tab=code&file=DataTypeExample\.java$/);
  await expect(editor(page)).toContainText('public class DataTypeExample');
  await page.reload();
  await expect(fileTabs(page).nth(1)).toHaveAttribute('aria-selected', 'true');

  await page.goto('/java/lecture/03?tab=code&file=Nope.java');
  await expect(fileTabs(page).first()).toHaveAttribute('aria-selected', 'true');
});

test('일부러 실패하는 예제는 에러 출력과 종료 코드를 보여 줌', async ({ page }) => {
  await page.goto('/java/lecture/20?tab=code&file=UncaughtException.java');
  await expect(page.getByTestId('run-stdout')).toHaveText('1\n');
  await expect(page.getByTestId('run-stderr')).toContainText(
    'java.lang.ArithmeticException: / by zero',
  );
  await expect(page.getByText('에러로 끝났어요(종료 코드 1).')).toBeVisible();
});

test('주석에만 Scanner 가 있는 예제는 미리 돌린 결과가 있고, main 없는 파일은 이유를 알려 줌', async ({
  page,
}) => {
  // 주석 속 Scanner 때문에 입력이 필요한 예제로 잘못 분류된 적이 있음
  await page.goto('/java/lecture/06?tab=code&file=SwitchChar.java');
  await expect(page.getByTestId('run-stdout')).toContainText('=');
  await page.goto('/java/lecture/21?tab=code&file=Mountain.java');
  await expect(page.getByText('혼자 실행하는 파일이 아니에요', { exact: false })).toBeVisible();
});

test('코드를 고치면 알림과 원래대로 버튼이 나오고, 누르면 원래 코드로 돌아옴', async ({ page }) => {
  await page.goto('/java/lecture/03?tab=code');
  await expect(editor(page)).toContainText('int score = 50;');
  await expect(page.getByRole('alert')).toHaveCount(0);

  await editor(page).getByText('int score = 50;').click();
  await page.keyboard.press('End');
  await page.keyboard.type(' // 고침');
  await expect(editor(page)).toContainText('50을 넣어요 // 고침');
  await expect(page.getByRole('alert')).toHaveText(
    '코드를 고쳤어요. 실행을 누르면 고친 코드로 돌려요. 아래는 원래 코드의 결과예요.',
  );

  await page.getByRole('button', { name: '원래대로' }).click();
  await expect(editor(page)).not.toContainText('// 고침');
  await expect(page.getByRole('alert')).toHaveCount(0);
});

test('편집기 글자 색이 Cobalt 토큰을 따르고, 어둡게 바꾸면 같이 바뀜', async ({ page }) => {
  await page.goto('/java/lecture/03?tab=code');
  const keyword = editor(page).getByText('public', { exact: true }).first();
  await expect(keyword).toBeVisible();

  const read = () =>
    keyword.evaluate((el) => {
      const probe = document.createElement('span');
      probe.style.color = 'var(--semantic-fg-brand-default)';
      document.body.append(probe);
      const token = getComputedStyle(probe).color;
      probe.remove();
      return { keyword: getComputedStyle(el).color, token };
    });

  const light = await read();
  expect(light.keyword).toBe(light.token);
  await page.getByTestId('theme-toggle').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  const dark = await read();
  expect(dark.keyword).toBe(dark.token);
  expect(dark.keyword).not.toBe(light.keyword);
});

test('예제 코드에 오타를 내면 그 자리에 밑줄과 컴파일러 문구가 뜨고, 고치면 사라짐', async ({
  page,
}) => {
  await page.goto('/java/lecture/03?tab=code');
  await editor(page).getByText('int score = 50;').click();
  await page.keyboard.press('End');
  await page.keyboard.insertText('\n        Sytem.out.println(score);');
  const underline = page.locator('.cm-lintRange-error');
  await expect(underline).toHaveText('Sytem');
  await underline.hover();
  await expect(page.locator('.cm-tooltip-lint')).toHaveText('package Sytem does not exist');

  await page.getByRole('button', { name: '원래대로' }).click();
  await expect(page.locator('.cm-lintRange-error')).toHaveCount(0);
});
