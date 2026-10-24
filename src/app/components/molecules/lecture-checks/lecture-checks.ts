import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { LucideCircleCheck } from '@lucide/angular';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';

import type { CheckKey, Missing } from '../../../domain/lecture-progress';

export type CheckChange = { key: CheckKey; on: boolean };

const CHECKS: { key: CheckKey; label: string }[] = [
  { key: 'videoWatched', label: '영상 봤어요' },
  { key: 'noteRead', label: '노트 읽었어요' },
];

const MISSING_LABEL: Record<Missing, string> = { video: '영상', note: '노트', quiz: '퀴즈 절반 이상' };

// 강의 제목 아래 진도 체크박스 2개와 완료까지 남은 항목 표시. 체크 상태 저장은 이 컴포넌트를 쓰는 부모가 맡음
@Component({
  selector: 'app-lecture-checks',
  imports: [HlmCheckboxImports, LucideCircleCheck],
  template: `
    <div class="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm" data-testid="lecture-checks">
      @for (check of checks; track check.key) {
        <label [for]="'check-' + check.key" class="flex cursor-pointer items-center gap-2">
          <hlm-checkbox
            [inputId]="'check-' + check.key"
            [checked]="checked()[check.key]"
            (checkedChange)="checkChange.emit({ key: check.key, on: $event })"
          />
          {{ check.label }}
        </label>
      }
      @if (missing().length === 0) {
        <p class="quiz-right flex items-center gap-1 font-semibold" data-testid="lecture-status">
          <svg lucideCircleCheck [size]="16"></svg>
          끝낸 강의예요
        </p>
      } @else {
        <p class="text-muted-foreground" data-testid="lecture-status">끝내려면: {{ missingText() }}</p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LectureChecks {
  readonly checked = input.required<Record<CheckKey, boolean>>();
  readonly missing = input.required<readonly Missing[]>();
  readonly checkChange = output<CheckChange>();

  protected readonly checks = CHECKS;
  protected readonly missingText = computed(() =>
    this.missing()
      .map((m) => MISSING_LABEL[m])
      .join(', '),
  );
}
