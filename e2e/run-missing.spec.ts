import { expect, test } from '@playwright/test';

// 실행 서버가 없는 곳(빌드한 파일을 다른 서버로 연 경우)에서 실행을 누르면 이유를 알려 줌
test('실행 주소가 404 면 실행 서버를 켜라는 안내가 나옴', async ({ page }) => {
  await page.route('**/api/run', (route) =>
    route.fulfill({ status: 404, contentType: 'text/plain', body: 'Not Found' }),
  );
  await page.goto('/java/lecture/03?tab=code&file=AssignExample.java');
  await page.getByRole('button', { name: '실행', exact: true }).click();
  await expect(page.getByTestId('run-error')).toHaveText(
    '코드 실행 서버가 없어요. 터미널에서 npm start 로 켜 주세요.',
  );
});
