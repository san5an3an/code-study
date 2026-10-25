import { expect, test, type Page } from '@playwright/test';

// 코드 탭 실행 버튼. 개발 서버의 /api/run 으로 자바를 실제로 돌림
// 퀴즈 탭 편집기도 숨은 채 같이 있어서 예제 파일 편집기만 고름
const editor = (page: Page) => page.locator('.cm-content[aria-label$=".java 코드"]');
const heading = (page: Page) => page.locator('#run-result-heading');
const runButton = (page: Page) => page.getByRole('button', { name: '실행', exact: true });

async function replaceCode(page: Page, code: string) {
  await editor(page).click();
  await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.insertText(code);
}

const program = (body: string) =>
  `public class AssignExample {\n  public static void main(String[] args) {\n    ${body}\n  }\n}\n`;

test('원래 코드를 실행하면 결과 제목이 방금 실행한 결과로 바뀜', async ({ page }) => {
  await page.goto('/java/lecture/03?tab=code');
  await expect(heading(page)).toHaveText('미리 돌려 둔 결과');
  await runButton(page).click();
  await expect(heading(page)).toHaveText('방금 실행한 결과');
  await expect(page.getByTestId('run-stdout')).toHaveText('50\n60\n50\n80\n85\n');
});

test('고친 코드를 실행하고 또 고치면 알려 주며, 원래대로를 누르면 처음 상태로 돌아옴', async ({
  page,
}) => {
  await page.goto('/java/lecture/03?tab=code');
  await replaceCode(page, program('System.out.println("고친 코드 " + (6 * 7));'));
  await expect(page.getByRole('alert')).toContainText('실행을 누르면 고친 코드로 돌려요');

  await runButton(page).click();
  await expect(page.getByTestId('run-stdout')).toHaveText('고친 코드 42\n');
  await expect(page.getByRole('alert')).toHaveCount(0);

  await editor(page).click();
  await page.keyboard.press('ControlOrMeta+End');
  await page.keyboard.insertText('// 또 고침');
  await expect(page.getByRole('alert')).toHaveText(
    '실행한 뒤에 코드를 또 고쳤어요. 아래 결과는 고치기 전 코드예요.',
  );

  await page.getByRole('button', { name: '원래대로' }).click();
  await expect(heading(page)).toHaveText('미리 돌려 둔 결과');
  await expect(editor(page)).toContainText('int score = 50;');
});

test('입력값 칸의 값이 Scanner 로 들어감', async ({ page }) => {
  await page.goto('/java/lecture/03?tab=code');
  await replaceCode(
    page,
    program(
      'var sc = new java.util.Scanner(System.in);\n    System.out.println(sc.nextLine() + "님 " + (sc.nextInt() + 1) + "살");',
    ),
  );
  await page.getByLabel('입력값').fill('자바\n19');
  await runButton(page).click();
  await expect(page.getByTestId('run-stdout')).toHaveText('자바님 20살\n');
});

test('컴파일 에러면 에러를 보여 주고 실행하지 않았다고 알림', async ({ page }) => {
  await page.goto('/java/lecture/03?tab=code');
  await replaceCode(page, program('int a = ;'));
  await runButton(page).click();
  await expect(page.getByText('컴파일 에러라 실행하지 않았어요', { exact: false })).toBeVisible();
  await expect(page.getByTestId('compile-error')).toContainText('AssignExample.java:3');
});

test('실행 중엔 버튼이 잠기고, 서버가 거절하면 이유를 보여 줌', async ({ page }) => {
  let release: () => void = () => {};
  const gate = new Promise<void>((r) => (release = r));
  await page.route('**/api/run', async (route) => {
    await gate;
    await route.fulfill({
      status: 429,
      contentType: 'application/json',
      body: JSON.stringify({
        ok: false,
        error: '이미 실행 중인 코드가 많아요. 잠시 뒤에 다시 눌러 주세요.',
      }),
    });
  });
  await page.goto('/java/lecture/03?tab=code');
  await runButton(page).click();
  await expect(page.getByRole('button', { name: '실행 중…' })).toBeDisabled();
  release();
  await expect(page.getByTestId('run-error')).toHaveText(
    '이미 실행 중인 코드가 많아요. 잠시 뒤에 다시 눌러 주세요.',
  );
  await expect(runButton(page)).toBeEnabled();
  await expect(heading(page)).toHaveText('미리 돌려 둔 결과');
});

test('main 없는 파일엔 실행 버튼과 입력값 칸이 없음', async ({ page }) => {
  await page.goto('/java/lecture/21?tab=code&file=Mountain.java');
  await expect(page.getByText('혼자 실행하는 파일이 아니에요', { exact: false })).toBeVisible();
  await expect(runButton(page)).toHaveCount(0);
  await expect(page.getByLabel('입력값')).toHaveCount(0);
});
