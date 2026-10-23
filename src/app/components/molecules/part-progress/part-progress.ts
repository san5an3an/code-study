import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideArrowRight } from '@lucide/angular';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmProgressImports } from '@spartan-ng/helm/progress';

import { percent, type PartSummary } from '../../../domain/course-summary';

// 부 하나의 진행 카드. 카드 전체가 그 부 첫 강의로 가는 링크
@Component({
  selector: 'app-part-progress',
  imports: [RouterLink, HlmCardImports, HlmProgressImports, LucideArrowRight],
  template: `
    <a
      [routerLink]="href()"
      [attr.data-testid]="'home-part-' + summary().part.id"
      class="group block h-full rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <div hlmCard size="sm" class="h-full transition-colors group-hover:bg-muted/50">
        <div hlmCardContent>
          <div class="flex items-center justify-between gap-2 text-sm">
            <span class="font-medium">{{ summary().part.title }}</span>
            <span class="tabular-nums text-muted-foreground">
              {{ summary().done }}/{{ summary().total }}강
            </span>
          </div>
          <hlm-progress
            class="mt-2"
            [value]="value()"
            [attr.aria-label]="summary().part.title + ' 진행률'"
          >
            <hlm-progress-indicator />
          </hlm-progress>
          <p class="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            {{ summary().first.id }}강부터
            <svg lucideArrowRight [size]="12"></svg>
          </p>
        </div>
      </div>
    </a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartProgress {
  readonly summary = input.required<PartSummary>();
  readonly href = input.required<string>();

  protected readonly value = computed(() => percent(this.summary().done, this.summary().total));
}
