import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmProgressImports } from '@spartan-ng/helm/progress';

import { percent } from '../../../domain/course-summary';

// 전체 진행률 카드: 제목, 큰 퍼센트 숫자, 진행 막대
@Component({
  selector: 'app-overall-progress-card',
  imports: [HlmCardImports, HlmProgressImports],
  template: `
    <div hlmCard class="h-full" data-testid="overall-progress">
      <div hlmCardHeader>
        <p hlmCardDescription>전체 진행률</p>
        <h3 hlmCardTitle class="text-3xl font-semibold tabular-nums">{{ value() }}%</h3>
      </div>
      <div hlmCardContent>
        <hlm-progress [value]="value()" aria-label="전체 진행률">
          <hlm-progress-indicator />
        </hlm-progress>
        <p class="mt-2 text-sm tabular-nums text-muted-foreground">
          {{ total() }}강 중 {{ done() }}강 끝냄
        </p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverallProgressCard {
  readonly done = input.required<number>();
  readonly total = input.required<number>();

  protected readonly value = computed(() => percent(this.done(), this.total()));
}
