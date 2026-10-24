import type { CanMatchFn, Routes } from '@angular/router';

import { CourseShellPage } from './components/pages/course-shell-page/course-shell-page';
import { HomePage } from './components/pages/home-page/home-page';
import { LecturePage } from './components/pages/lecture-page/lecture-page';
import { NotFoundPage } from './components/pages/not-found-page/not-found-page';
import { PendingPage } from './components/pages/pending-page/pending-page';
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
      { path: 'lecture/:id', component: LecturePage },
      { path: 'review', component: PendingPage, data: { title: '오답 노트' } },
      { path: '**', component: NotFoundPage },
    ],
  },
  { path: '**', component: NotFoundPage },
];
