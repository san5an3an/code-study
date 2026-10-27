import { expect, test } from '@playwright/test';

import { CNT_ANSWER, writeCode } from './code-answer';
import { AT, seedOnce, wrongKeys } from './progress-seed';

// 퀴즈 탭 확인. 03강: 1번 객관식(정답 3), 2번 OX(정답 X), 5번 실행 결과(스스로 체크), 11번 예시 답안

test('03강 퀴즈는 문제 12개를 차례로 보여 주고, 요약 줄은 0문제에서 시작함', async ({ page }) => {
  await page.goto('/java/lecture/03?tab=quiz');
  await expect(page.getByRole('group', { name: /번 문제$/ })).toHaveCount(12);
  await expect(page.getByTestId('quiz-summary')).toHaveText(
    '12문제 중 0문제 풀었어요 · 맞음 0 · 틀림 0',
  );
  await expect(page.getByTestId('quiz-1').getByText('객관식')).toBeVisible();
});

test('객관식은 정답을 누르면 바로 맞았어요가 뜨고 보기가 잠기며, 정답 줄은 흐려지지 않음', async ({
  page,
}) => {
  await page.goto('/java/lecture/03?tab=quiz');
  const q = page.getByTestId('quiz-1');
  await q.getByRole('button', { name: '3. 7.' }).click();
  await expect(q.getByText('맞았어요')).toBeVisible();
  await expect(q.getByTestId('quiz-explanation')).toContainText('7.0');
  await expect(q.getByRole('button', { name: '1. 3' })).toBeDisabled();
  await expect(q.getByRole('button', { name: '3. 7.' })).toHaveCSS('opacity', '1');
  await expect(page.getByTestId('quiz-summary')).toHaveText(
    '12문제 중 1문제 풀었어요 · 맞음 1 · 틀림 0',
  );
});

test('객관식을 틀리면 고른 줄은 빨강, 정답 줄은 초록 바탕이 되고 나머지 줄은 흐려짐', async ({
  page,
}) => {
  await page.goto('/java/lecture/03?tab=quiz');
  const q = page.getByTestId('quiz-1');
  const wrong = q.getByRole('button', { name: '2. -5' });
  const right = q.getByRole('button', { name: '3. 7.' });
  const other = q.getByRole('button', { name: '1. 3' });
  const before = await right.evaluate((el) => getComputedStyle(el).backgroundColor);
  await wrong.click();
  await expect(wrong).toHaveAttribute('data-quiz-tone', 'wrong');
  await expect(right).toHaveAttribute('data-quiz-tone', 'right');
  await expect(other).toHaveCSS('opacity', '0.6');
  const bg = (el: Element) => getComputedStyle(el).backgroundColor;
  const [wrongBg, rightBg] = [await wrong.evaluate(bg), await right.evaluate(bg)];
  expect(rightBg).not.toBe(before);
  expect(wrongBg).not.toBe(before);
  expect(wrongBg).not.toBe(rightBg);
});

test('OX 를 틀리면 틀렸어요가 뜨고, 다시 풀기를 누르면 처음 상태로 돌아감', async ({ page }) => {
  await page.goto('/java/lecture/03?tab=quiz');
  const q = page.getByTestId('quiz-2');
  await q.getByRole('button', { name: 'O', exact: true }).click();
  await expect(q.getByText('틀렸어요')).toBeVisible();
  await expect(q.getByRole('button', { name: 'O', exact: true })).toHaveCSS('opacity', '1');
  await expect(q.getByRole('button', { name: 'X', exact: true })).toHaveCSS('opacity', '1');
  await q.getByRole('button', { name: '다시 풀기' }).click();
  await expect(q.getByText('틀렸어요')).toHaveCount(0);
  await expect(q.getByRole('button', { name: 'O', exact: true })).toBeEnabled();
  await expect(page.getByTestId('quiz-summary')).toContainText('0문제 풀었어요');
});

test('정답이 여러 개인 객관식은 모두 고른 뒤 채점하기를 눌러야 채점함', async ({ page }) => {
  await page.goto('/java/lecture/01?tab=quiz');
  const q = page.getByTestId('quiz-3');
  const grade = q.getByRole('button', { name: '채점하기' });
  await expect(grade).toBeDisabled();
  await q.getByRole('checkbox').nth(0).click();
  await expect(q.getByText('맞았어요')).toHaveCount(0);
  await q.getByRole('checkbox').nth(2).click();
  await grade.click();
  await expect(q.getByText('맞았어요')).toBeVisible();
  await expect(grade).toHaveCount(0);
});

test('실행 결과 문제는 답을 쓰고 정답 보기를 누른 뒤 스스로 체크하고, 쓴 답은 남음', async ({
  page,
}) => {
  await page.goto('/java/lecture/03?tab=quiz');
  const q = page.getByTestId('quiz-5');
  await expect(q.getByTestId('quiz-explanation')).toHaveCount(0);
  await q.getByLabel('내 답').fill('2.4\n7\nB');
  await q.getByRole('button', { name: '정답 보기' }).click();
  await expect(q.getByTestId('quiz-explanation')).toContainText('7.0');
  await expect(page.getByTestId('quiz-summary')).toContainText('0문제 풀었어요');
  await q.getByRole('button', { name: '틀렸어요' }).click();
  await expect(page.getByTestId('quiz-summary')).toHaveText(
    '12문제 중 1문제 풀었어요 · 맞음 0 · 틀림 1',
  );
  await expect(q.getByLabel('내 답')).toHaveValue('2.4\n7\nB');
});

test('예시 답안 문제는 해설 제목이 예시 답안임', async ({ page }) => {
  await page.goto('/java/lecture/03?tab=quiz');
  const q = page.getByTestId('quiz-11');
  await q.getByRole('button', { name: '정답 보기' }).click();
  await expect(
    q.getByTestId('quiz-explanation').getByText('예시 답안', { exact: true }),
  ).toBeVisible();
});

test('강의 밖 내용 표시는 13강 10번에만 붙음', async ({ page }) => {
  await page.goto('/java/lecture/13?tab=quiz');
  // 노트 본문에도 같은 말이 있어서 문제 카드 안에서만 셈
  await expect(page.getByRole('group').getByText('강의 밖 내용', { exact: true })).toHaveCount(1);
  await expect(page.getByTestId('quiz-10').getByText('강의 밖 내용')).toBeVisible();
});

test('다른 강의로 가면 풀던 답이 비워지고, 노트 탭을 보고 돌아오면 답이 남음', async ({ page }) => {
  await page.goto('/java/lecture/03?tab=quiz');
  await page.getByTestId('quiz-2').getByRole('button', { name: 'X', exact: true }).click();
  await page.getByTestId('tab-note').click();
  await expect(page.getByTestId('note')).toBeVisible();
  await page.getByTestId('tab-quiz').click();
  await expect(page.getByTestId('quiz-summary')).toHaveText(
    '12문제 중 1문제 풀었어요 · 맞음 1 · 틀림 0',
  );

  await page.getByTestId('lecture-next').click();
  // 이동 링크는 탭 이름 없이 강의 주소로만 가서(원본과 같음) 퀴즈 탭을 다시 엶
  await expect(page).toHaveURL(/\/java\/lecture\/04$/);
  await page.getByTestId('tab-quiz').click();
  await expect(page.getByTestId('quiz-summary')).toContainText('0문제 풀었어요');
});

test('퀴즈 파일을 못 받으면 npm run sync 안내가 뜸', async ({ page }) => {
  await page.route('**/content/java/03/quiz.json', (route) =>
    route.fulfill({ status: 404, body: '' }),
  );
  await page.goto('/java/lecture/03?tab=quiz');
  await expect(page.getByTestId('quiz-error')).toContainText('npm run sync');
});

test('OX 를 틀리면 새로고침해도 그 문제에 오답 노트 표시가 남음', async ({ page }) => {
  await page.goto('/java/lecture/03?tab=quiz');
  await page.getByTestId('quiz-2').getByRole('button', { name: 'O', exact: true }).click();
  await page.reload();
  await expect(page.getByTestId('quiz-2').getByText('오답 노트에 있어요')).toBeVisible();
  await expect(page.getByTestId('quiz-1').getByText('오답 노트에 있어요')).toHaveCount(0);
});

test('스스로 체크에서 틀렸어요를 누르면 오답 노트에 들어가고, 맞았어요로 바꾸면 빠짐', async ({
  page,
}) => {
  await page.goto('/java/lecture/03?tab=quiz');
  const q = page.getByTestId('quiz-5');
  await q.getByRole('button', { name: '정답 보기' }).click();
  await q.getByRole('button', { name: '틀렸어요' }).click();
  expect(await wrongKeys(page)).toEqual(['03-5']);
  await q.getByRole('button', { name: '맞았어요' }).click();
  expect(await wrongKeys(page)).toEqual([]);
});

test('오답 노트에 있던 문제를 퀴즈 탭에서 맞히면 표시가 사라짐', async ({ page }) => {
  await seedOnce(page, {
    version: 1,
    lastLectureId: null,
    lectures: {},
    wrong: { '03-2': { lectureId: '03', n: 2, at: AT } },
  });
  await page.goto('/java/lecture/03?tab=quiz');
  const q = page.getByTestId('quiz-2');
  await expect(q.getByText('오답 노트에 있어요')).toBeVisible();
  await q.getByRole('button', { name: 'X', exact: true }).click();
  await expect(q.getByText('오답 노트에 있어요')).toHaveCount(0);
  expect(await wrongKeys(page)).toEqual([]);
});

test('최고 기록은 새로고침 뒤에도 보이고, 덜 맞힌 판으로는 내려가지 않음', async ({ page }) => {
  await page.goto('/java/lecture/03?tab=quiz');
  await expect(page.getByTestId('quiz-best')).toHaveCount(0);
  await page.getByTestId('quiz-1').getByRole('button', { name: '3. 7.' }).click();
  await page.getByTestId('quiz-2').getByRole('button', { name: 'X', exact: true }).click();
  await expect(page.getByTestId('quiz-best')).toHaveText('최고 기록 2 / 12');
  await page.reload();
  await expect(page.getByTestId('quiz-best')).toHaveText('최고 기록 2 / 12');
  await page.getByTestId('quiz-1').getByRole('button', { name: '3. 7.' }).click();
  await page.reload();
  await expect(page.getByTestId('quiz-best')).toHaveText('최고 기록 2 / 12');
});

test('다시 풀기와 처음부터 다시는 저장된 기록을 지우지 않음', async ({ page }) => {
  await page.goto('/java/lecture/03?tab=quiz');
  await page.getByTestId('quiz-2').getByRole('button', { name: 'O', exact: true }).click();
  await page.getByTestId('quiz-2').getByRole('button', { name: '다시 풀기' }).click();
  await expect(page.getByTestId('quiz-2').getByText('틀렸어요')).toHaveCount(0);
  await page.getByTestId('quiz-1').getByRole('button', { name: '3. 7.' }).click();
  await page.getByRole('button', { name: '처음부터 다시' }).click();
  await expect(page.getByTestId('quiz-summary')).toContainText('0문제 풀었어요');
  await page.reload();
  await expect(page.getByTestId('quiz-2').getByText('오답 노트에 있어요')).toBeVisible();
  await expect(page.getByTestId('quiz-best')).toHaveText('최고 기록 1 / 12');
});

test('저장이 막혀도 퀴즈는 풀리고 페이지 에러가 없음', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new DOMException('막힘', 'SecurityError');
      },
    });
  });
  await page.goto('/java/lecture/03?tab=quiz');
  await page.getByTestId('quiz-2').getByRole('button', { name: 'O', exact: true }).click();
  await expect(page.getByTestId('quiz-2').getByText('틀렸어요')).toBeVisible();
  await expect(page.getByTestId('quiz-2').getByText('오답 노트에 있어요')).toBeVisible();
  expect(errors).toEqual([]);
});

test('코드로 답하는 문제는 편집기로 쓰고, 오타를 내면 그 자리에 밑줄과 컴파일러 문구가 뜸', async ({
  page,
}) => {
  await page.goto('/java/lecture/02?tab=quiz');
  // 02강 10번 에러 찾기는 말로 답하는 문제라 글 칸, 12번 직접 짜보기는 코드 편집기
  await expect(page.getByTestId('quiz-10').getByLabel('내 답')).toBeVisible();
  const card = page.getByTestId('quiz-12');
  const editor = card.locator('.cm-content');
  await expect(editor).toHaveAttribute('aria-label', '12번 문제 내 답 코드');

  await editor.click();
  await page.keyboard.insertText('System.out.print("이름: ");\nSytem.out.println("홍길동");');
  const underline = card.locator('.cm-lintRange-error');
  await expect(underline).toHaveText('Sytem');
  await underline.hover();
  await expect(page.locator('.cm-tooltip-lint')).toHaveText('package Sytem does not exist');

  // 오타를 고치면 밑줄이 사라짐
  await underline.click();
  // Sytem 의 Sy 뒤에 s 를 넣어 System 으로 고침
  await page.keyboard.press('Home');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.insertText('s');
  await expect(card.locator('.cm-line').nth(1)).toHaveText('System.out.println("홍길동");');
  await expect(card.locator('.cm-lintRange-error')).toHaveCount(0);
});

test('코드 문제에 맞는 답을 쓰고 채점하기를 누르면 맞았어요가 뜨고 맞음으로 기록되며, 코드를 고치면 다시 채점하라고 함', async ({
  page,
}) => {
  await page.goto('/java/lecture/08?tab=quiz');
  const q = page.getByTestId('quiz-11');
  await writeCode(page, q, CNT_ANSWER);
  await q.getByRole('button', { name: '채점하기' }).click();
  await expect(q.getByTestId('quiz-grade')).toContainText('맞았어요. 출력이 정답과 같아요');
  await expect(page.getByTestId('quiz-summary')).toContainText('맞음 1 · 틀림 0');
  await expect(q.getByTestId('quiz-explanation')).toHaveCount(0);

  // 채점하는 동안 버튼이 잠기며 편집기 포커스가 빠지므로 마지막 줄 끝을 다시 눌러서 이어 씀
  await q.locator('.cm-line').last().click();
  await page.keyboard.press('End');
  await page.keyboard.insertText('\nSystem.out.println(cnt);');
  await expect(q.locator('.cm-line').last()).toHaveText('System.out.println(cnt);');
  await expect(q.locator('.cm-line')).toHaveCount(9);
  await expect(q.getByTestId('quiz-grade')).toContainText('채점한 뒤에 코드를 고쳤어요');
  await q.getByRole('button', { name: '다시 채점하기' }).click();
  await expect(q.getByTestId('quiz-grade')).toContainText('틀렸어요. 2번째 줄이 달라요');
  await expect(page.getByTestId('quiz-summary')).toContainText('맞음 0 · 틀림 1');
});

test('코드 문제를 틀리면 처음 다른 줄을 보여 주고 오답 노트에 넣으며, 맞았어요로 바꾸면 빠짐', async ({
  page,
}) => {
  await page.goto('/java/lecture/07?tab=quiz');
  const q = page.getByTestId('quiz-12');
  // (1) 만 쓰고 (2) 구구단을 빼먹은 답
  await writeCode(
    page,
    q,
    'int sum = 0;\nfor (int i = 1; i <= 10; i++) {\nsum = sum + i;\n}\nSystem.out.println("합계: " + sum);',
  );
  await q.getByRole('button', { name: '채점하기' }).click();
  const grade = q.getByTestId('quiz-grade');
  await expect(grade).toContainText('틀렸어요. 2번째 줄이 달라요');
  await expect(grade).toContainText('3*1=3');
  await expect(grade).toContainText('(줄 없음)');
  expect(await wrongKeys(page)).toEqual(['07-12']);
  await q.getByRole('button', { name: '맞았어요' }).click();
  expect(await wrongKeys(page)).toEqual([]);
  await expect(page.getByTestId('quiz-summary')).toContainText('맞음 1 · 틀림 0');
});

test('컴파일 에러면 밑줄부터 고치라고 하고 기록하지 않으며, 실행 중 에러는 틀림으로 기록함', async ({
  page,
}) => {
  await page.goto('/java/lecture/08?tab=quiz');
  const q = page.getByTestId('quiz-11');
  await writeCode(page, q, 'int a = ;');
  await q.getByRole('button', { name: '채점하기' }).click();
  await expect(q.getByTestId('quiz-grade')).toContainText('먼저 빨간 밑줄을 고쳐 봐요');
  await expect(q.getByTestId('quiz-grade')).toContainText('1번째 줄:');
  await expect(page.getByTestId('quiz-summary')).toContainText('0문제 풀었어요');

  await q.getByRole('button', { name: '다시 풀기' }).click();
  await writeCode(page, q, 'int[] a = new int[1];\na[3] = 1;');
  await q.getByRole('button', { name: '채점하기' }).click();
  await expect(q.getByTestId('quiz-grade')).toContainText('실행 중에 에러가 나서 멈췄어요');
  await expect(q.getByTestId('quiz-grade')).toContainText('ArrayIndexOutOfBoundsException');
  expect(await wrongKeys(page)).toEqual(['08-11']);
});

test('힌트 보기를 누를 때마다 한 단계씩 열리고, 다시 풀기를 누르면 닫힘', async ({ page }) => {
  await page.goto('/java/lecture/08?tab=quiz');
  const q = page.getByTestId('quiz-11');
  await expect(q.getByTestId('quiz-hint-1')).toHaveCount(0);
  await q.getByRole('button', { name: '힌트 보기 (1/3)' }).click();
  await expect(q.getByTestId('quiz-hint-1')).toContainText('while (true)');
  await expect(q.getByTestId('quiz-hint-2')).toHaveCount(0);
  await q.getByRole('button', { name: '힌트 보기 (2/3)' }).click();
  await q.getByRole('button', { name: '힌트 보기 (3/3)' }).click();
  await expect(q.getByTestId('quiz-hint-3').locator('pre')).toContainText('cnt = cnt + ___;');
  await expect(q.getByRole('button', { name: /힌트 보기/ })).toHaveCount(0);
  await q.getByRole('button', { name: '다시 풀기' }).click();
  await expect(q.getByTestId('quiz-hint-1')).toHaveCount(0);
  await expect(q.getByRole('button', { name: '힌트 보기 (1/3)' })).toBeVisible();
});

test('출력이 사람마다 다른 코드 문제는 채점하기 대신 스스로 체크 안내가 뜸', async ({ page }) => {
  await page.goto('/java/lecture/05?tab=quiz');
  const q = page.getByTestId('quiz-9');
  await expect(q.getByTestId('quiz-no-grading')).toContainText('자동 채점을 안 해요');
  await expect(q.getByRole('button', { name: '채점하기' })).toHaveCount(0);
  await expect(q.getByRole('button', { name: '힌트 보기 (1/3)' })).toBeVisible();
});

test('문제 글에 출력 모양이 없는 16강 12번에만 출력 예가 뜸', async ({ page }) => {
  await page.goto('/java/lecture/16?tab=quiz');
  await expect(page.getByTestId('quiz-12').getByTestId('quiz-output-example')).toContainText(
    '2020년은 윤년',
  );
  await expect(page.getByTestId('quiz-output-example')).toHaveCount(1);
});
