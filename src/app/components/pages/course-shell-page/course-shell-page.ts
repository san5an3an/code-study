import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { COURSES, courseOf } from '../../../config/courses';
import type { CourseId } from '../../../domain/course';
import { completedLectures } from '../../../domain/lecture-progress';
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
  protected readonly completed = computed(() =>
    completedLectures(
      this.progress.progress(this.courseId())(),
      this.course().lectures.map((l) => l.id),
    ),
  );

  protected goCourse(id: CourseId) {
    if (id !== this.courseId()) void this.router.navigate(['/', id]);
  }
}
