import { ChangeDetectionStrategy, Component, input } from '@angular/core';

// 아직 옮기지 않은 화면 자리. 라우트 data 의 title 을 보여 줌
@Component({
  selector: 'app-pending-page',
  template: `
    <h1 class="text-xl font-semibold">{{ title() }}</h1>
    <p class="mt-2 text-muted-foreground">이 화면은 옮기는 중이에요.</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PendingPage {
  readonly title = input('');
}
