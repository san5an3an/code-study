import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  LucideBookOpen,
  LucideCircleCheck,
  LucideHouse,
  LucideNotebookPen,
} from '@lucide/angular';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';

import type { Course, CourseId } from '../../../domain/course';
import { MarqueeText } from '../../atoms/marquee-text/marquee-text';
import { CourseSwitcher } from '../../molecules/course-switcher/course-switcher';

// 왼쪽 사이드바: 과목 고르기 메뉴, 홈과 오답 노트 링크, 부별 강의 목록
@Component({
  selector: 'app-sidebar',
  imports: [
    HlmSidebarImports,
    RouterLink,
    RouterLinkActive,
    LucideHouse,
    LucideNotebookPen,
    LucideBookOpen,
    LucideCircleCheck,
    MarqueeText,
    CourseSwitcher,
  ],
  template: `
    <hlm-sidebar collapsible="icon" aria-label="강의 목록">
      <div hlmSidebarHeader>
        <app-course-switcher
          [courses]="courses()"
          [currentId]="course().id"
          (select)="courseChange.emit($event)"
        />
      </div>

      <div hlmSidebarContent>
        <div hlmSidebarGroup>
          <div hlmSidebarGroupContent>
            <ul hlmSidebarMenu>
              <li hlmSidebarMenuItem>
                <a
                  hlmSidebarMenuButton
                  [routerLink]="base()"
                  routerLinkActive
                  #home="routerLinkActive"
                  [routerLinkActiveOptions]="{ exact: true }"
                  [isActive]="home.isActive"
                  tooltip="홈"
                >
                  <svg lucideHouse class="shrink-0" [size]="16"></svg>
                  <span>홈</span>
                </a>
              </li>
              <li hlmSidebarMenuItem>
                <a
                  hlmSidebarMenuButton
                  [routerLink]="base() + '/review'"
                  routerLinkActive
                  #review="routerLinkActive"
                  [isActive]="review.isActive"
                  tooltip="오답 노트"
                >
                  <svg lucideNotebookPen class="shrink-0" [size]="16"></svg>
                  <span>오답 노트</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        @for (part of course().parts; track part.id) {
          <div hlmSidebarGroup [attr.data-testid]="'part-' + part.id">
            <div hlmSidebarGroupLabel>{{ part.id }}부. {{ part.title }}</div>
            <div hlmSidebarGroupContent>
              <ul hlmSidebarMenu>
                @for (lecture of lecturesOf(part.id); track lecture.id) {
                  @let done = completed().has(lecture.id);
                  <li hlmSidebarMenuItem>
                    <a
                      hlmSidebarMenuButton
                      [routerLink]="base() + '/lecture/' + lecture.id"
                      routerLinkActive
                      #rla="routerLinkActive"
                      [isActive]="rla.isActive"
                      [tooltip]="lecture.id + '강 ' + lecture.title + (done ? ' (끝냄)' : '')"
                      [attr.data-testid]="'lecture-link-' + lecture.id"
                      [attr.data-done]="done ? '' : null"
                    >
                      <!-- 끝낸 강의는 책 아이콘 대신 체크 아이콘이라 사이드바를 접어도 구분됨 -->
                      @if (done) {
                        <svg lucideCircleCheck class="quiz-right shrink-0" [size]="16" aria-hidden="true"></svg>
                      } @else {
                        <svg lucideBookOpen class="shrink-0" [size]="16"></svg>
                      }
                      <span
                        class="w-6 shrink-0 tabular-nums text-muted-foreground group-data-[collapsible=icon]:hidden"
                        >{{
                        lecture.id
                      }}</span>
                      <app-marquee-text [text]="lecture.title" />
                      @if (done) {
                        <span class="sr-only">끝냄</span>
                      }
                    </a>
                  </li>
                }
              </ul>
            </div>
          </div>
        }
      </div>
      <button hlmSidebarRail aria-label="사이드바 접기·펴기"></button>
    </hlm-sidebar>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppSidebar {
  readonly courses = input.required<readonly Course[]>();
  readonly course = input.required<Course>();
  readonly completed = input.required<ReadonlySet<string>>();
  readonly courseChange = output<CourseId>();

  protected readonly base = computed(() => '/' + this.course().id);

  protected lecturesOf(part: number) {
    return this.course().lectures.filter((l) => l.part === part);
  }
}
