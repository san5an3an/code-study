import { RenderMode, ServerRoute } from '@angular/ssr';

// 화면은 브라우저에서만 그림. 진도(localStorage)와 코드 편집기가 브라우저 전용이라 서버는 화면 파일과 실행 API만 맡음
export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Client,
  },
];
