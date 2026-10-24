import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideChevronLeft, LucideChevronRight } from '@lucide/angular';
import { HlmButtonImports } from '@spartan-ng/helm/button';

import type { Lecture } from '../../../domain/course';

// 강의 화면 아래 이전·다음 강의 이동 링크. 첫 강의엔 이전 링크가, 마지막 강의엔 다음 링크가 없음
@Component({
  selector: 'app-lecture-nav',
  imports: [RouterLink, HlmButtonImports, LucideChevronLeft, LucideChevronRight],
  template: `
    <nav aria-label="강의 이동" class="flex items-center justify-between gap-2">
      @if (prev(); as lecture) {
        <a hlmBtn variant="outline" [routerLink]="base() + '/lecture/' + lecture.id" data-testid="lecture-prev">
          <svg lucideChevronLeft [size]="16"></svg>
          {{ lecture.id }}강
        </a>
      } @else {
        <span></span>
      }
      @if (next(); as lecture) {
        <a hlmBtn variant="outline" [routerLink]="base() + '/lecture/' + lecture.id" data-testid="lecture-next">
          {{ lecture.id }}강
          <svg lucideChevronRight [size]="16"></svg>
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
