import type { CanMatchFn, Routes } from '@angular/router';

import { CourseShellPage } from './components/pages/course-shell-page/course-shell-page';
import { HomePage } from './components/pages/home-page/home-page';
import { NotFoundPage } from './components/pages/not-found-page/not-found-page';
import { DEFAULT_COURSE } from './config/courses';
import { isCourseId } from './domain/course';

// 주소 첫 부분이 java 나 python 일 때만 과목 화면 틀을 씀
const courseMatch: CanMatchFn = (_route, segments) => isCourseId(segments[0]?.path);

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: DEFAULT_COURSE },
  {
    path: ':course',
    canMatch: [courseMatch],
    component: CourseShellPage,
    children: [
      { path: '', component: HomePage },
      // 강의 화면은 노트, 퀴즈, 코드를 다 담아 커서 그 주소로 들어갈 때만 따로 불러옴. 첫 화면 크기를 한도(1MB) 안에 두기 위함
      {
        path: 'lecture/:id',
        loadComponent: () =>
          import('./components/pages/lecture-page/lecture-page').then((m) => m.LecturePage),
      },
      // 오답 노트도 여러 강의 퀴즈와 문제 카드를 담아서 그 주소로 들어갈 때만 따로 불러옴
      {
        path: 'review',
        loadComponent: () =>
          import('./components/pages/review-page/review-page').then((m) => m.ReviewPage),
      },
      { path: '**', component: NotFoundPage },
    ],
  },
  { path: '**', component: NotFoundPage },
];
