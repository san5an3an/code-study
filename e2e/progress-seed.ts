import type { Page } from '@playwright/test';

// 퀴즈 탭과 오답 노트 화면 테스트가 같이 쓰는 자바 진도 저장값 도우미
export const PROGRESS_KEY = 'code-study:java:progress';
export const AT = '2026-10-19T12:00:00.000Z';

// 새로고침할 때마다 저장값을 다시 넣지 않도록 페이지를 처음 열 때 한 번만 넣음
export function seedOnce(page: Page, value: object) {
  return page.addInitScript(
    ([key, json]) => {
      if (sessionStorage.getItem('seeded')) return;
      sessionStorage.setItem('seeded', '1');
      localStorage.setItem(key, json);
    },
    [PROGRESS_KEY, JSON.stringify(value)] as const,
  );
}

export function savedProgress(page: Page) {
  return page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? 'null'), PROGRESS_KEY);
}

export async function wrongKeys(page: Page) {
  return Object.keys((await savedProgress(page)).wrong);
}
