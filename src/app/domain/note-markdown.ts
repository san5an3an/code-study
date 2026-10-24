// 노트 마크다운을 화면에 넣을 HTML 글로 바꿈. 위험한 태그 거르기는 Angular [innerHTML] 이 맡음
import { Marked } from 'marked';

const noteMarked = new Marked({
  gfm: true,
  async: false,
  renderer: {
    // 노트 맨 위 "# 03강. …" 은 강의 화면 제목과 같아서 빼고 그림. 나머지 제목은 기본 모양
    heading({ depth }) {
      return depth === 1 ? '' : false;
    },
  },
});

export function noteHtml(markdown: string): string {
  return noteMarked.parse(markdown, { async: false });
}

// 퀴즈 보기, 정답 머리 줄처럼 한 줄짜리 마크다운. 문단 태그 없이 `코드`, **굵게** 만 바꿈
export function inlineHtml(markdown: string): string {
  return noteMarked.parseInline(markdown, { async: false });
}
