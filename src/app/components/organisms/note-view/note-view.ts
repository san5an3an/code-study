import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';

// 노트 탭 화면. 불러오는 중, 불러오기 실패, 아직 노트가 없는 과목, 본문 네 상태를 그림
export type NoteStatus = 'loading' | 'error' | 'none' | 'ready';

@Component({
  selector: 'app-note-view',
  imports: [HlmEmptyImports, HlmSkeletonImports],
  template: `
    @switch (status()) {
      @case ('loading') {
        <div
          class="flex max-w-[40rem] flex-col gap-3"
          aria-busy="true"
          aria-label="노트 불러오는 중"
        >
          <hlm-skeleton class="h-6 w-1/2" />
          <hlm-skeleton class="h-4 w-full" />
          <hlm-skeleton class="h-4 w-5/6" />
        </div>
      }
      @case ('error') {
        <div hlmEmpty class="border" data-testid="note-error">
          <div hlmEmptyHeader>
            <h3 hlmEmptyTitle>노트를 못 불러왔어요</h3>
            <p hlmEmptyDescription>터미널에서 <code>npm run sync</code> 를 먼저 돌려 주세요.</p>
          </div>
        </div>
      }
      @case ('none') {
        <div hlmEmpty class="border" data-testid="note-none">
          <div hlmEmptyHeader>
            <h3 hlmEmptyTitle>아직 노트가 없어요</h3>
            <p hlmEmptyDescription>이 과목은 강의 노트를 아직 만들지 않았어요.</p>
          </div>
        </div>
      }
      @case ('ready') {
        <article class="ods-prose" data-testid="note" [innerHTML]="html()"></article>
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoteView {
  readonly status = input.required<NoteStatus>();
  // noteHtml 로 바꾼 노트 HTML. 위험한 태그는 [innerHTML] 이 걸러 냄
  readonly html = input('');
}
