import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import type { EditorView } from '@codemirror/view';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';

import type { CodeCheck } from '../../../core/run-api';
import type { CourseId } from '../../../domain/course';

// 코드 편집기. 브라우저에서만 만들고, 편집기 코드는 처음 쓸 때 따로 불러옴. 글이 바뀌면 새 글을 부모에게 알림
@Component({
  selector: 'app-code-editor',
  imports: [HlmSkeletonImports],
  template: `
    @if (!ready()) {
      <hlm-skeleton
        class="block h-40 w-full"
        aria-busy="true"
        [attr.aria-label]="label() + ' 불러오는 중'"
      />
    }
    <div #mount></div>
  `,
  host: { class: 'block', 'data-testid': 'code-editor' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeEditor {
  readonly value = input.required<string>();
  // 편집 칸을 읽어 주는 이름. 예: "AssignExample.java 코드"
  readonly label = input.required<string>();
  // 문법 색칠에 쓸 언어. 편집기를 만들 때 한 번만 읽음
  readonly course = input.required<CourseId>();
  // 오타 검사 결과. 결과를 낸 코드 글이 지금 편집기 글과 같을 때만 밑줄을 다시 그림
  readonly check = input<CodeCheck | null>(null);
  readonly valueChange = output<string>();

  private readonly mount = viewChild.required<ElementRef<HTMLElement>>('mount');
  private readonly view = signal<EditorView | null>(null);
  protected readonly ready = signal(false);

  constructor() {
    const destroyRef = inject(DestroyRef);
    let destroyed = false;
    destroyRef.onDestroy(() => {
      destroyed = true;
      this.view()?.destroy();
    });

    afterNextRender(async () => {
      const { createEditor } = await import('./code-editor-setup');
      if (destroyed) return;
      this.view.set(
        createEditor(this.mount().nativeElement, this.value(), this.label(), this.course(), (v) =>
          this.valueChange.emit(v),
        ),
      );
      this.ready.set(true);
    });

    // 원래대로처럼 부모가 값을 바꾸면 편집기 글도 맞춤
    effect(async () => {
      const view = this.view();
      const value = this.value();
      if (!view) return;
      const { replaceDoc } = await import('./code-editor-setup');
      replaceDoc(view, value);
    });

    effect(async () => {
      const view = this.view();
      const check = this.check();
      if (!view || !check) return;
      const { showDiagnostics } = await import('./code-editor-setup');
      showDiagnostics(view, check);
    });
  }
}
