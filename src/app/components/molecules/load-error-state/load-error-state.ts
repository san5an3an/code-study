import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';

// 강의 file을 load 못 했을 때 npm run sync 안내를 Spartan empty block으로 render
@Component({
  selector: 'app-load-error-state',
  imports: [HlmEmptyImports],
  // host element가 box를 안 만들어서 안쪽 empty block이 원래 자리의 layout을 그대로 keep
  host: { class: 'contents' },
  template: `
    <div hlmEmpty class="border">
      <div hlmEmptyHeader>
        <h3 hlmEmptyTitle>{{ heading() }}</h3>
        <p hlmEmptyDescription>터미널에서 <code>npm run sync</code> 를 먼저 돌려 주세요.</p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadErrorState {
  readonly heading = input.required<string>();
}
