import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';

import { LECTURE_TABS, tabOf, type LectureTab } from '../../../domain/lecture-view';

// 강의 배치: 부·강 제목 + 체크 + 탭 4개 + 이동. 탭 안에 무엇을 넣을지는 쓰는 쪽이 정함
@Component({
  selector: 'app-lecture-template',
  imports: [HlmTabsImports],
  template: `
    <div class="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <header class="flex flex-col gap-2">
        <p class="text-sm text-muted-foreground">{{ partLabel() }}</p>
        <h1 class="text-xl font-semibold">{{ title() }}</h1>
        <ng-content select="[lectureChecks]" />
      </header>

      <hlm-tabs [tab]="tab()" (tabActivated)="pick($event)">
        <hlm-tabs-list aria-label="강의 내용">
          @for (t of tabs; track t.value) {
            <button [hlmTabsTrigger]="t.value" [attr.data-testid]="'tab-' + t.value">{{ t.label }}</button>
          }
        </hlm-tabs-list>
        <div hlmTabsContent="note" class="pt-2"><ng-content select="[tabNote]" /></div>
        <div hlmTabsContent="quiz" class="pt-2"><ng-content select="[tabQuiz]" /></div>
        <div hlmTabsContent="code" class="pt-2"><ng-content select="[tabCode]" /></div>
        <div hlmTabsContent="material" class="pt-2"><ng-content select="[tabMaterial]" /></div>
      </hlm-tabs>

      <ng-content select="[lectureNav]" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LectureTemplate {
  readonly partLabel = input('');
  readonly title = input.required<string>();
  readonly tab = input.required<LectureTab>();
  readonly tabChange = output<LectureTab>();

  protected readonly tabs = LECTURE_TABS;

  // 지금 탭을 다시 알리는 경우는 내보내지 않음
  protected pick(value: string) {
    const next = tabOf(value);
    if (next !== this.tab()) this.tabChange.emit(next);
  }
}
