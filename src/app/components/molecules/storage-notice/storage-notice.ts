import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTriangleAlert } from '@ng-icons/lucide';
import { HlmAlertImports } from '@spartan-ng/helm/alert';

// 브라우저 저장이 막혔을 때만 보이는 안내. 아이콘 배치는 Spartan 알림창 규칙을 따름
@Component({
  selector: 'app-storage-notice',
  imports: [HlmAlertImports, NgIcon],
  providers: [provideIcons({ lucideTriangleAlert })],
  template: `
    @if (!persisted()) {
      <hlm-alert data-testid="storage-notice">
        <ng-icon name="lucideTriangleAlert" size="16" />
        <h4 hlmAlertTitle>진도가 저장되지 않아요</h4>
        <p hlmAlertDescription class="col-start-2 break-keep">
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
