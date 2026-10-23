import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LucideTriangleAlert } from '@lucide/angular';
import { HlmAlertImports } from '@spartan-ng/helm/alert';

// 브라우저 저장이 막혔을 때만 보이는 안내. Spartan 의 아이콘 배치 규칙이 ng-icon 에만 걸려 있어 lucide 아이콘에 같은 배치를 직접 줌
@Component({
  selector: 'app-storage-notice',
  imports: [HlmAlertImports, LucideTriangleAlert],
  template: `
    @if (!persisted()) {
      <hlm-alert class="grid-cols-[auto_1fr] gap-x-2" data-testid="storage-notice">
        <svg lucideTriangleAlert class="row-span-2 translate-y-0.5" [size]="16"></svg>
        <h4 hlmAlertTitle class="col-start-2">진도가 저장되지 않아요</h4>
        <p hlmAlertDescription class="col-start-2">
          이 브라우저는 저장이 막혀 있어서, 새로고침하면 진도가 사라져요.
        </p>
      </hlm-alert>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StorageNotice {
  readonly persisted = input.required<boolean>();
}
