import type { Locator, Page } from '@playwright/test';

// 퀴즈 탭과 오답 노트 화면 테스트가 같이 쓰는 코드 문제 답 도우미

// 코드 문제 편집기에 글을 붙여 넣음. 붙여 넣기라 괄호 자동 닫기가 끼어들지 않음
export async function writeCode(page: Page, card: Locator, code: string) {
  await card.locator('.cm-content').click();
  await page.keyboard.insertText(code);
}

// 08강 11번(break 로 3 에서 멈추기)의 맞는 답
export const CNT_ANSWER =
  'int cnt = 0;\nwhile (true) {\ncnt = cnt + 1;\nif (cnt == 3) {\nbreak;\n}\n}\nSystem.out.println(cnt);';
