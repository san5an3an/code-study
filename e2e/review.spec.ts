import { expect, test, type Page } from '@playwright/test';

import { CNT_ANSWER, writeCode } from './code-answer';
import { AT, savedProgress, seedOnce, wrongKeys } from './progress-seed';

// 오답 노트 확인. 01강 3번은 정답이 여러 개(1, 3), 03강 2번은 OX(정답 X), 03강 5번은 스스로 체크
// 08강 11번, 07강 12번은 채점하는 코드 문제, 05강 9번은 출력이 사람마다 달라 채점 안 하는 코드 문제

function wrongOf(...keys: string[]) {
  const wrong = Object.fromEntries(
    keys.map((key) => {
      const [lectureId, n] = key.split('-');
      return [key, { lectureId, n: Number(n), at: AT }];
    }),
  );
  return { version: 1, lastLectureId: null, lectures: {}, wrong };
}

async function seedWrong(page: Page, ...keys: string[]) {
  await seedOnce(page, wrongOf(...keys));
}

test('틀린 문제가 없으면 빈 화면이 뜨고, 퀴즈 풀러 가기는 처음 강의 퀴즈로 감', async ({
  page,
}) => {
  await page.goto('/java/review');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('오답 노트');
  const empty = page.getByTestId('review-empty');
  await expect(empty).toContainText('틀린 문제가 아직 없어요');
  await empty.getByRole('link', { name: '퀴즈 풀러 가기' }).click();
  await expect(page).toHaveURL(/\/java\/lecture\/01\?tab=quiz$/);
});

test('빈 화면의 퀴즈 풀러 가기는 마지막에 본 강의 퀴즈로 감', async ({ page }) => {
  await seedOnce(page, { ...wrongOf(), lastLectureId: '07' });
  await page.goto('/java/review');
  await expect(
    page.getByTestId('review-empty').getByRole('link', { name: '퀴즈 풀러 가기' }),
  ).toHaveAttribute('href', '/java/lecture/07?tab=quiz');
});

test('틀린 문제를 강의 순서로 묶고, 묶음 제목에 찾은 문제 수를 쓰며 그 강의 퀴즈로 가는 링크를 둠', async ({
  page,
}) => {
  await seedWrong(page, '04-1', '03-5', '03-2');
  await page.goto('/java/review');
  const groups = page.locator('[data-testid^="review-group-"]');
  await expect(groups).toHaveCount(2);
  await expect(groups.nth(0)).toHaveAttribute('data-testid', 'review-group-03');
  await expect(groups.nth(1)).toHaveAttribute('data-testid', 'review-group-04');
  await expect(page.getByRole('heading', { name: '03강. 변수와 상수 · 2문제' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '04강. 기본 자료형 · 1문제' })).toBeVisible();
  const cards = page.getByTestId('review-group-03').getByRole('group');
  await expect(cards.nth(0)).toHaveAttribute('data-testid', 'review-03-2');
  await expect(cards.nth(1)).toHaveAttribute('data-testid', 'review-03-5');
  await expect(page.getByRole('group', { name: '03강 2번 문제' })).toBeVisible();
  await expect(page.getByTestId('review-03-2').getByText('오답 노트에 있어요')).toHaveCount(0);

  await page
    .getByTestId('review-group-03')
    .getByRole('link', { name: '이 강의 퀴즈로 가기' })
    .click();
  await expect(page).toHaveURL(/\/java\/lecture\/03\?tab=quiz$/);
});

test('퀴즈 파일에 없는 번호와 모르는 강의 기록만 있으면 빈 화면이 뜸', async ({ page }) => {
  await seedWrong(page, '03-99', '99-1');
  await page.goto('/java/review');
  await expect(page.getByTestId('review-empty')).toBeVisible();
});

test('오답 노트에서 맞히면 기록에서 빠지지만 카드는 남고, 최고 기록은 생기지 않으며, 다시 열면 빈 화면이 뜸', async ({
  page,
}) => {
  await seedWrong(page, '03-2');
  await page.goto('/java/review');
  const card = page.getByTestId('review-03-2');
  await card.getByRole('button', { name: 'X', exact: true }).click();
  await expect(card.getByText('맞았어요')).toBeVisible();
  expect(await wrongKeys(page)).toEqual([]);
  expect((await savedProgress(page)).lectures['03']?.quizBest).toBeUndefined();
  await expect(card).toBeVisible();
  await page.reload();
  await expect(page.getByTestId('review-empty')).toBeVisible();
});

test('오답 노트에서 또 틀리면 기록이 남고 틀린 시각만 새로 씀', async ({ page }) => {
  await seedWrong(page, '03-2');
  await page.goto('/java/review');
  await page.getByTestId('review-03-2').getByRole('button', { name: 'O', exact: true }).click();
  await expect(page.getByTestId('review-03-2').getByText('틀렸어요')).toBeVisible();
  const saved = await savedProgress(page);
  expect(Object.keys(saved.wrong)).toEqual(['03-2']);
  expect(saved.wrong['03-2'].at).not.toBe(AT);
});

test('스스로 체크 문제는 맞았어요로 빠지고 틀렸어요로 다시 들어감', async ({ page }) => {
  await seedWrong(page, '03-5');
  await page.goto('/java/review');
  const card = page.getByTestId('review-03-5');
  await card.getByRole('button', { name: '정답 보기' }).click();
  await card.getByRole('button', { name: '맞았어요' }).click();
  expect(await wrongKeys(page)).toEqual([]);
  await card.getByRole('button', { name: '틀렸어요' }).click();
  expect(await wrongKeys(page)).toEqual(['03-5']);
});

test('정답이 여러 개인 문제도 모두 고르고 채점하기를 누르면 맞혀서 빠짐', async ({ page }) => {
  await seedWrong(page, '01-3');
  await page.goto('/java/review');
  const card = page.getByTestId('review-01-3');
  await card.getByRole('checkbox').nth(0).click();
  await card.getByRole('checkbox').nth(2).click();
  await card.getByRole('button', { name: '채점하기' }).click();
  await expect(card.getByText('맞았어요')).toBeVisible();
  expect(await wrongKeys(page)).toEqual([]);
});

test('다시 풀기는 카드만 비우고 기록은 그대로 둠', async ({ page }) => {
  await seedWrong(page, '03-2');
  await page.goto('/java/review');
  const card = page.getByTestId('review-03-2');
  await card.getByRole('button', { name: 'O', exact: true }).click();
  await card.getByRole('button', { name: '다시 풀기' }).click();
  await expect(card.getByText('틀렸어요')).toHaveCount(0);
  await expect(card.getByRole('button', { name: 'O', exact: true })).toBeEnabled();
  expect(await wrongKeys(page)).toEqual(['03-2']);
});

test('퀴즈 파일을 못 받은 강의는 제목과 sync 안내를 보여 주고, 다른 강의 묶음은 그대로 보임', async ({
  page,
}) => {
  await seedWrong(page, '03-2', '04-1');
  await page.route('**/content/java/03/quiz.json', (route) =>
    route.fulfill({ status: 404, body: '' }),
  );
  await page.goto('/java/review');
  await expect(page.getByRole('heading', { name: '03강. 변수와 상수', exact: true })).toBeVisible();
  await expect(page.getByTestId('review-error-03')).toContainText('npm run sync');
  await expect(page.getByTestId('review-04-1')).toBeVisible();
});

test('오답 노트에 있을 때 사이드바 오답 노트를 다시 눌러도 맞힌 카드가 그대로 남음', async ({
  page,
}) => {
  await seedWrong(page, '03-2');
  await page.goto('/java/review');
  await page.getByTestId('review-03-2').getByRole('button', { name: 'X', exact: true }).click();
  await page.getByRole('link', { name: '오답 노트' }).click();
  await expect(page.getByTestId('review-03-2').getByText('맞았어요')).toBeVisible();
});

test('퀴즈 탭에서 틀린 문제가 오답 노트에 나옴', async ({ page }) => {
  await page.goto('/java/lecture/03?tab=quiz');
  await page.getByTestId('quiz-2').getByRole('button', { name: 'O', exact: true }).click();
  await page.getByRole('link', { name: '오답 노트' }).click();
  await expect(page).toHaveURL(/\/java\/review$/);
  await expect(page.getByTestId('review-03-2')).toBeVisible();
});

test('저장이 막혀도 오답 노트 빈 화면이 뜨고 페이지 에러가 없음', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new DOMException('막힘', 'SecurityError');
      },
    });
  });
  await page.goto('/java/review');
  await expect(page.getByTestId('review-empty')).toBeVisible();
  expect(errors).toEqual([]);
});

test('파이썬 퀴즈에서 틀린 문제가 파이썬 오답 노트에 나오고, 자바 오답 노트에는 안 나옴', async ({
  page,
}) => {
  await page.goto('/python/review');
  await expect(page.getByTestId('review-empty')).toBeVisible();
  await page.goto('/python/lecture/08?tab=quiz');
  // 08강 1번은 OX 이고 정답은 O
  await page.getByTestId('quiz-1').getByRole('button', { name: 'X', exact: true }).click();
  await page.getByRole('link', { name: '오답 노트' }).click();
  await expect(page).toHaveURL(/\/python\/review$/);
  await expect(page.getByTestId('review-08-1')).toBeVisible();
  await page.goto('/java/review');
  await expect(page.getByTestId('review-empty')).toBeVisible();
});

test('어두운 화면에서 빈 화면 아이콘 칸 바탕이 페이지 바탕과 다름', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('code-study:theme', 'dark'));
  await page.goto('/java/review');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  const media = page.getByTestId('review-empty').locator('[data-slot="empty-media"]');
  const bg = await media.evaluate((el) => getComputedStyle(el).backgroundColor);
  const pageBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bg).not.toBe(pageBg);
});

test('오답 노트에서 코드 문제를 맞히면 기록에서 빠지지만 카드는 남고, 최고 기록은 생기지 않음', async ({
  page,
}) => {
  await seedWrong(page, '08-11');
  await page.goto('/java/review');
  const card = page.getByTestId('review-08-11');
  await writeCode(page, card, CNT_ANSWER);
  await card.getByRole('button', { name: '채점하기' }).click();
  await expect(card.getByTestId('quiz-grade')).toContainText('맞았어요. 출력이 정답과 같아요');
  expect(await wrongKeys(page)).toEqual([]);
  expect((await savedProgress(page)).lectures['08']?.quizBest).toBeUndefined();
  await expect(card).toBeVisible();
  await page.reload();
  await expect(page.getByTestId('review-empty')).toBeVisible();
});

test('오답 노트에서 코드 문제를 또 틀리면 처음 다른 줄을 보여 주고, 기록은 남고 틀린 시각만 새로 씀', async ({
  page,
}) => {
  await seedWrong(page, '07-12');
  await page.goto('/java/review');
  const card = page.getByTestId('review-07-12');
  // (1) 만 쓰고 (2) 구구단을 빼먹은 답
  await writeCode(
    page,
    card,
    'int sum = 0;\nfor (int i = 1; i <= 10; i++) {\nsum = sum + i;\n}\nSystem.out.println("합계: " + sum);',
  );
  await card.getByRole('button', { name: '채점하기' }).click();
  await expect(card.getByTestId('quiz-grade')).toContainText('틀렸어요. 2번째 줄이 달라요');
  const saved = await savedProgress(page);
  expect(Object.keys(saved.wrong)).toEqual(['07-12']);
  expect(saved.wrong['07-12'].at).not.toBe(AT);
});

test('오답 노트의 코드 문제도 오타에 밑줄이 뜨고, 컴파일 에러로 채점하면 기록을 건드리지 않음', async ({
  page,
}) => {
  await seedWrong(page, '08-11');
  await page.goto('/java/review');
  const card = page.getByTestId('review-08-11');
  await expect(card.locator('.cm-content')).toHaveAttribute(
    'aria-label',
    '08강 11번 문제 내 답 코드',
  );
  await writeCode(page, card, 'Sytem.out.println(3);');
  await expect(card.locator('.cm-lintRange-error')).toHaveText('Sytem');
  await card.getByRole('button', { name: '채점하기' }).click();
  await expect(card.getByTestId('quiz-grade')).toContainText('먼저 빨간 밑줄을 고쳐 봐요');
  expect((await savedProgress(page)).wrong['08-11'].at).toBe(AT);
});

test('채점을 기다리는 동안 버튼이 잠기고, 그사이 다시 풀기를 누르면 늦게 온 결과는 버림', async ({
  page,
}) => {
  await seedWrong(page, '08-11');
  let release = () => {};
  const gate = new Promise<void>((resolve) => (release = resolve));
  await page.route('**/api/run-snippet', async (route) => {
    await gate;
    await route.continue();
  });
  await page.goto('/java/review');
  const card = page.getByTestId('review-08-11');
  await writeCode(page, card, CNT_ANSWER);
  await card.getByRole('button', { name: '채점하기' }).click();
  await expect(card.getByRole('button', { name: '채점하는 중…' })).toBeDisabled();
  await card.getByRole('button', { name: '다시 풀기' }).click();
  const answered = page.waitForResponse('**/api/run-snippet');
  release();
  await answered;
  await expect(card.getByRole('button', { name: '채점하기' })).toBeVisible();
  await expect(card.getByTestId('quiz-grade')).toHaveCount(0);
  expect(await wrongKeys(page)).toEqual(['08-11']);
});

test('오답 노트의 코드 문제도 힌트 보기를 누를 때마다 한 단계씩 열림', async ({ page }) => {
  await seedWrong(page, '08-11');
  await page.goto('/java/review');
  const card = page.getByTestId('review-08-11');
  await card.getByRole('button', { name: '힌트 보기 (1/3)' }).click();
  await expect(card.getByTestId('quiz-hint-1')).toContainText('while (true)');
  await expect(card.getByTestId('quiz-hint-2')).toHaveCount(0);
  await card.getByRole('button', { name: '힌트 보기 (2/3)' }).click();
  await expect(card.getByTestId('quiz-hint-2')).toBeVisible();
});

test('출력이 사람마다 다른 코드 문제는 오답 노트에서도 채점하기 대신 스스로 체크 안내가 뜸', async ({
  page,
}) => {
  await seedWrong(page, '05-9');
  await page.goto('/java/review');
  const card = page.getByTestId('review-05-9');
  await expect(card.getByTestId('quiz-no-grading')).toContainText('자동 채점을 안 해요');
  await expect(card.getByRole('button', { name: '채점하기' })).toHaveCount(0);
});
