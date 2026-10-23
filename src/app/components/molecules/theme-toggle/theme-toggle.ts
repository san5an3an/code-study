import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { LucideMoon, LucideSun } from '@lucide/angular';
import { HlmButtonImports } from '@spartan-ng/helm/button';

// 밝게/어둡게 버튼. 지금 테마를 받아 반대로 바꾸라고 알림
@Component({
  selector: 'app-theme-toggle',
  imports: [HlmButtonImports, LucideSun, LucideMoon],
  template: `
    <button
      hlmBtn
      variant="ghost"
      size="icon"
      type="button"
      [attr.aria-label]="nextLabel()"
      [attr.title]="nextLabel()"
      data-testid="theme-toggle"
      (click)="toggle.emit()"
    >
      @if (theme() === 'dark') {
        <svg lucideSun [size]="16"></svg>
      } @else {
        <svg lucideMoon [size]="16"></svg>
      }
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggle {
  readonly theme = input.required<'light' | 'dark'>();
  readonly toggle = output<void>();

  protected readonly nextLabel = computed(() =>
    this.theme() === 'dark' ? '밝은 화면으로' : '어두운 화면으로',
  );
}
