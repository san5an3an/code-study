import type { CanMatchFn, Routes } from '@angular/router';

import { CourseShellPage } from './components/pages/course-shell-page/course-shell-page';
import { NotFoundPage } from './components/pages/not-found-page/not-found-page';
import { PendingPage } from './components/pages/pending-page/pending-page';
import { DEFAULT_COURSE } from './config/courses';
import { isCourseId } from './domain/course';

// 첫 칸이 java·python 일 때만 과목 틀을 씀
const courseMatch: CanMatchFn = (_route, segments) => isCourseId(segments[0]?.path);

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: DEFAULT_COURSE },
  {
    path: ':course',
    canMatch: [courseMatch],
    component: CourseShellPage,
    children: [
      { path: '', component: PendingPage, data: { title: '홈' } },
      { path: 'lecture/:id', component: PendingPage, data: { title: '강의' } },
      { path: 'review', component: PendingPage, data: { title: '오답 노트' } },
      { path: '**', component: NotFoundPage },
    ],
  },
  { path: '**', component: NotFoundPage },
];
