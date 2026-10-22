import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';

// 앱 틀 배치: 왼쪽 사이드바 + 위쪽 줄(접기·제목·오른쪽 버튼) + 본문. 무엇을 넣을지는 쓰는 쪽이 정함
@Component({
  selector: 'app-shell',
  imports: [HlmSidebarImports, HlmSeparatorImports],
  template: `
    <div hlmSidebarWrapper>
      <ng-content select="[shellSidebar]" />
      <main hlmSidebarInset>
        <header
          class="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4"
        >
          <button hlmSidebarTrigger class="-ms-1" srOnlyText="사이드바 접기·펴기"></button>
          <hlm-separator orientation="vertical" class="me-2 data-vertical:h-4 data-vertical:self-auto" />
          <span class="text-sm font-medium">{{ title() }}</span>
          <div class="ms-auto flex items-center gap-1">
            <ng-content select="[shellActions]" />
          </div>
        </header>
        <div class="flex flex-1 flex-col p-4 md:p-6">
          <ng-content />
        </div>
      </main>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShell {
  readonly title = input.required<string>();
}
