import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  resource,
} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { COURSES, courseOf } from '../../../config/courses';
import type { CourseId } from '../../../domain/course';
import type { LectureContentSummary } from '../../../domain/lecture-content';
import { completedLectures } from '../../../domain/lecture-progress';
import { reviewCount } from '../../../domain/review-groups';
import { fetchContentText } from '../../../services/content-text';
import { ProgressService } from '../../../services/progress.service';
import { ThemeService } from '../../../services/theme.service';
import { ThemeToggle } from '../../molecules/theme-toggle/theme-toggle';
import { AppSidebar } from '../../organisms/app-sidebar/app-sidebar';
import { AppShell } from '../../templates/app-shell/app-shell';

// 과목 주소(/java, /python) 아래 화면들의 공통 틀. 진도와 테마를 가져와 app-shell 에 넣음
@Component({
  selector: 'app-course-shell-page',
  imports: [AppShell, AppSidebar, ThemeToggle, RouterOutlet],
  template: `
    <app-shell [title]="course().title + ' 기초 강의 복습'">
      <app-sidebar
        shellSidebar
        [courses]="courses"
        [course]="course()"
        [completed]="completed()"
        [reviewCount]="reviewCount()"
        (courseChange)="goCourse($event)"
      />
      <app-theme-toggle shellActions [theme]="theme.theme()" (toggle)="theme.toggle()" />
      <router-outlet />
    </app-shell>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseShellPage {
  // 라우터가 주소의 :course 값을 넣어 줌. 라우트 설정이 java 와 python 만 통과시킴
  readonly courseId = input.required<CourseId>({ alias: 'course' });

  protected readonly theme = inject(ThemeService);
  private readonly progress = inject(ProgressService);
  private readonly router = inject(Router);

  protected readonly courses = COURSES;
  protected readonly course = computed(() => courseOf(this.courseId()));
  private readonly data = computed(() => this.progress.progress(this.courseId())());
  protected readonly completed = computed(() =>
    completedLectures(
      this.data(),
      this.course().lectures.map((l) => l.id),
    ),
  );

  // 강의별 퀴즈 문제 수. review page에 안 나오는 기록을 빼고 세는 데 씀
  private readonly summary = resource({
    params: () => `${this.courseId()}/index.json`,
    loader: async ({ params, abortSignal }) =>
      JSON.parse(await fetchContentText(params, abortSignal)) as LectureContentSummary[],
  });
  // 문제 수를 불러오기 전이나 못 불러오면 0 이라 사이드바 badge 가 안 보임
  protected readonly reviewCount = computed(() => {
    if (!this.summary.hasValue()) return 0;
    const counts = Object.fromEntries(this.summary.value().map((s) => [s.id, s.questions]));
    return reviewCount(this.course(), this.data().wrong, counts);
  });

  protected goCourse(id: CourseId) {
    if (id !== this.courseId()) void this.router.navigate(['/', id]);
  }
}
