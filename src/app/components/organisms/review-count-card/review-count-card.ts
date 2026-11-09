import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideNotebookPen } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';

// 홈의 오답 노트 카드: 틀린 문제 수와 review page로 가는 링크. 버튼은 카드 머리 오른쪽 action 자리에 둠
@Component({
  selector: 'app-review-count-card',
  imports: [RouterLink, HlmButtonImports, HlmCardImports, NgIcon],
  providers: [provideIcons({ lucideNotebookPen })],
  template: `
    <div hlmCard data-testid="review-card">
      <div hlmCardHeader>
        <p hlmCardDescription>오답 노트</p>
        <h3 hlmCardTitle class="text-base tabular-nums">틀린 문제 {{ count() }}개</h3>
        <div hlmCardAction>
          <a hlmBtn variant="outline" [routerLink]="href()">
            <ng-icon name="lucideNotebookPen" size="16" />
            오답 노트 풀기
          </a>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewCountCard {
  readonly count = input.required<number>();
  readonly href = input.required<string>();
}
