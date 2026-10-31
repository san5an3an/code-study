import { expect, test, type Page } from '@playwright/test';

import { writeCode } from './code-answer';

// 파이썬 코드 탭과 퀴즈 코드 문제. 개발 서버의 /api/run, /api/check, /api/check-snippet 으로 python3 를 실제로 돌림
// 퀴즈 탭 편집기도 숨은 채 같이 있어서 예제 파일 편집기만 고름
const editor = (page: Page) => page.locator('.cm-content[aria-label$=".py 코드"]');
const heading = (page: Page) => page.locator('#run-result-heading');
const runButton = (page: Page) => page.getByRole('button', { name: '실행', exact: true });

async function replaceCode(page: Page, code: string) {
  await editor(page).click();
  await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.insertText(code);
}

test('파이썬 예제를 고치지 않고 실행하면 미리 돌려 둔 결과와 같은 출력이 나옴', async ({
  page,
}) => {
  await page.goto('/python/lecture/08?tab=code&file=quote_pairs.py');
  await expect(heading(page)).toHaveText('미리 돌려 둔 결과');
  await runButton(page).click();
  await expect(heading(page)).toHaveText('방금 실행한 결과');
  await expect(page.getByTestId('run-stdout')).toHaveText(
    'Life is \'too\' short\nLife is "too" short\n',
  );
});

test('입력값 칸의 값이 input() 으로 들어감', async ({ page }) => {
  await page.goto('/python/lecture/08?tab=code');
  await replaceCode(page, 'name = input()\nage = int(input())\nprint(f"{name}님 {age + 1}살")\n');
  await expect(page.locator('label[for^="stdin-"]')).toContainText('input() 으로 받을 값');
  await page.getByLabel('입력값').fill('파이썬\n19');
  await runButton(page).click();
  await expect(page.getByTestId('run-stdout')).toHaveText('파이썬님 20살\n');
});

test('실행 중 에러는 Traceback 과 종료 코드를 보여 주고 컴파일 에러 안내는 안 나옴', async ({
  page,
}) => {
  await page.goto('/python/lecture/08?tab=code');
  await replaceCode(page, 'print("앞")\nprint(nope)\n');
  await runButton(page).click();
  await expect(page.getByTestId('run-stdout')).toHaveText('앞\n');
  const stderr = page.getByTestId('run-stderr');
  await expect(stderr).toContainText('File "escape_chars.py", line 2');
  await expect(stderr).toContainText("NameError: name 'nope' is not defined");
  await expect(stderr).not.toContainText('\x1b');
  await expect(stderr).not.toContainText('code-study-py-run-');
  await expect(page.getByTestId('run-status')).toHaveText('에러로 끝났어요(종료 코드 1).');
  await expect(page.getByTestId('compile-error')).toHaveCount(0);
});

test('예제 코드에 문법 오타를 내면 그 자리에 밑줄과 파이썬 문구가 뜨고, 고치면 사라짐', async ({
  page,
}) => {
  await page.goto('/python/lecture/08?tab=code');
  await replaceCode(page, 'count = 3\nprint(count\n');
  const underline = page.locator('.cm-lintRange-error');
  // 괄호가 이름 바로 뒤라 밑줄은 앞 이름에 그어짐(자바 "Sytem." 과 같은 규칙)
  await expect(underline).toHaveText('print');
  await underline.hover();
  await expect(page.locator('.cm-tooltip-lint')).toHaveText("SyntaxError: '(' was never closed");

  await page.keyboard.press('ControlOrMeta+End');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('End');
  await page.keyboard.insertText(')');
  await expect(page.locator('.cm-lintRange-error')).toHaveCount(0);
});

test('파이썬 퀴즈 코드 문제도 편집기로 쓰고 문법 오타에 밑줄이 뜸', async ({ page }) => {
  await page.goto('/python/lecture/08?tab=quiz');
  const card = page.getByTestId('quiz-11');
  const quizEditor = card.locator('.cm-content');
  await expect(quizEditor).toHaveAttribute('aria-label', '11번 문제 내 답 코드');
  await quizEditor.click();
  await page.keyboard.insertText('word = "Hi"\nif word\n    print(word)');
  await expect(card.locator('.cm-lintRange-error')).toHaveCount(1);
  await card.locator('.cm-lintRange-error').hover();
  await expect(page.locator('.cm-tooltip-lint')).toHaveText("SyntaxError: expected ':'");
});

test('파이썬 퀴즈 코드 문제에 맞는 답을 쓰고 채점하기를 누르면 맞았어요가 뜨고 맞음으로 기록됨', async ({
  page,
}) => {
  await page.goto('/python/lecture/08?tab=quiz');
  const q = page.getByTestId('quiz-11');
  await writeCode(page, q, 'word = "Hi"\nprint((word + " ") * 2 + word)');
  await q.getByRole('button', { name: '채점하기' }).click();
  await expect(q.getByTestId('quiz-grade')).toContainText('맞았어요. 출력이 정답과 같아요');
  await expect(page.getByTestId('quiz-summary')).toContainText('맞음 1 · 틀림 0');
});

test('파이썬 퀴즈 코드 문제를 틀리면 다른 줄을, 실행 에러면 Traceback 끝 줄을 보여 주고 틀림으로 기록함', async ({
  page,
}) => {
  await page.goto('/python/lecture/08?tab=quiz');
  const q = page.getByTestId('quiz-11');
  await writeCode(page, q, 'print("Hi Hi")');
  await q.getByRole('button', { name: '채점하기' }).click();
  const grade = q.getByTestId('quiz-grade');
  await expect(grade).toContainText('틀렸어요. 1번째 줄이 달라요');
  await expect(grade).toContainText('Hi Hi Hi');
  await expect(page.getByTestId('quiz-summary')).toContainText('맞음 0 · 틀림 1');

  await q.getByRole('button', { name: '다시 풀기' }).click();
  await writeCode(page, q, 'word = "Hi"\nprint(wrod)');
  await q.getByRole('button', { name: '채점하기' }).click();
  await expect(grade).toContainText('실행 중에 에러가 나서 멈췄어요');
  await expect(grade).toContainText("NameError: name 'wrod' is not defined");
  await expect(grade).not.toContainText('Traceback');
});

test('파이썬 퀴즈 힌트 보기를 누르면 한 단계씩 열리고 3단계는 빈칸 코드임', async ({ page }) => {
  await page.goto('/python/lecture/08?tab=quiz');
  const q = page.getByTestId('quiz-11');
  await q.getByRole('button', { name: '힌트 보기 (1/3)' }).click();
  await expect(q.getByTestId('quiz-hint-1')).toContainText('반복');
  await expect(q.getByTestId('quiz-hint-2')).toHaveCount(0);
  await q.getByRole('button', { name: '힌트 보기 (2/3)' }).click();
  await q.getByRole('button', { name: '힌트 보기 (3/3)' }).click();
  await expect(q.getByTestId('quiz-hint-3').locator('pre')).toContainText('___');
});
