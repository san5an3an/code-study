import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import {
  LucideChevronsUpDown,
  LucideCoffee,
  LucideDynamicIcon,
  LucideSquareTerminal,
} from '@lucide/angular';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';

import type { Course, CourseId } from '../../../domain/course';

const ICONS = { java: LucideCoffee, python: LucideSquareTerminal } as const;

// 사이드바 맨 위 과목 고르기 메뉴. 고른 과목을 알리기만 하고 주소 이동은 이 컴포넌트를 쓰는 부모가 맡음
@Component({
  selector: 'app-course-switcher',
  imports: [HlmSidebarImports, HlmDropdownMenuImports, LucideDynamicIcon, LucideChevronsUpDown],
  template: `
    <ul hlmSidebarMenu>
      <li hlmSidebarMenuItem>
        <button
          hlmSidebarMenuButton
          size="lg"
          type="button"
          [hlmDropdownMenuTrigger]="menu"
          side="right"
          align="start"
          [tooltip]="current().title + ' (과목 바꾸기)'"
          data-testid="course-switcher"
        >
          <div
            class="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
          >
            <svg [lucideIcon]="icons[current().id]" [size]="16"></svg>
          </div>
          <div class="grid flex-1 text-start leading-tight">
            <span class="truncate font-semibold">{{ current().title }} 복습</span>
            <span class="truncate text-xs text-muted-foreground">{{ current().subtitle }}</span>
          </div>
          <svg lucideChevronsUpDown class="ms-auto shrink-0" [size]="16"></svg>
        </button>
        <ng-template #menu>
          <hlm-dropdown-menu class="w-56">
            <hlm-dropdown-menu-group>
              <hlm-dropdown-menu-label>과목</hlm-dropdown-menu-label>
              @for (course of courses(); track course.id) {
                <button
                  hlmDropdownMenuRadio
                  [checked]="course.id === current().id"
                  [keepOpen]="false"
                  [attr.data-testid]="'course-option-' + course.id"
                  (triggered)="select.emit(course.id)"
                >
                  <svg [lucideIcon]="icons[course.id]" class="shrink-0" [size]="16"></svg>
                  {{ course.title }}
                  <span class="text-xs text-muted-foreground">{{ course.subtitle }}</span>
                  <hlm-dropdown-menu-radio-indicator />
                </button>
              }
            </hlm-dropdown-menu-group>
          </hlm-dropdown-menu>
        </ng-template>
      </li>
    </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseSwitcher {
  readonly courses = input.required<readonly Course[]>();
  readonly currentId = input.required<CourseId>();
  readonly select = output<CourseId>();

  protected readonly icons = ICONS;
  protected readonly current = computed(
    () => this.courses().find((c) => c.id === this.currentId()) ?? this.courses()[0],
  );
}
