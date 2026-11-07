import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideChevronRight } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';

import type { Lecture } from '../../../domain/course';

// 강의 화면 아래 이전·다음 강의 이동 링크. 첫 강의엔 이전 링크가, 마지막 강의엔 다음 링크가 없음
@Component({
  selector: 'app-lecture-nav',
  imports: [RouterLink, HlmButtonImports, NgIcon],
  providers: [provideIcons({ lucideChevronLeft, lucideChevronRight })],
  template: `
    <nav aria-label="강의 이동" class="flex items-center justify-between gap-2">
      @if (prev(); as lecture) {
        <a
          hlmBtn
          variant="outline"
          [routerLink]="base() + '/lecture/' + lecture.id"
          data-testid="lecture-prev"
        >
          <ng-icon name="lucideChevronLeft" size="16" />
          {{ lecture.id }}강
        </a>
      } @else {
        <span></span>
      }
      @if (next(); as lecture) {
        <a
          hlmBtn
          variant="outline"
          [routerLink]="base() + '/lecture/' + lecture.id"
          data-testid="lecture-next"
        >
          {{ lecture.id }}강
          <ng-icon name="lucideChevronRight" size="16" />
        </a>
      }
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LectureNav {
  readonly prev = input<Lecture>();
  readonly next = input<Lecture>();
  // 과목 주소 앞부분. 예: /java
  readonly base = input.required<string>();
}
