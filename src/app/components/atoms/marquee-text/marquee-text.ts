import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  effect,
  inject,
  input,
} from '@angular/core';

// 칸보다 긴 글자만 흐르게 함. 언제 흐를지는 styles.css 의 .marquee 규칙이 정함(가리킬 때, 선택됐을 때)
@Component({
  selector: 'app-marquee-text',
  template: `<span class="marquee-inner">{{ text() }}</span>`,
  host: { class: 'marquee' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarqueeText {
  readonly text = input.required<string>();

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private observer: ResizeObserver | null = null;

  constructor() {
    afterNextRender(() => {
      this.observer = new ResizeObserver(() => this.measure());
      this.observer.observe(this.host.nativeElement);
    });
    effect(() => {
      this.text();
      queueMicrotask(() => this.measure());
    });
    inject(DestroyRef).onDestroy(() => this.observer?.disconnect());
  }

  // 안쪽 글자는 평소 inline 이라 넘침은 바깥 상자에서 잼(transform 은 scrollWidth 에 안 잡힘)
  private measure() {
    const outer = this.host.nativeElement;
    const distance = outer.scrollWidth - outer.clientWidth;
    if (distance > 1) {
      outer.dataset['overflow'] = '';
      outer.style.setProperty('--marquee-distance', `${distance}px`);
      // 글자가 길수록 천천히, 초당 약 30px, 최소 3초
      outer.style.setProperty('--marquee-duration', `${Math.max(3, distance / 30 + 2)}s`);
    } else {
      delete outer.dataset['overflow'];
    }
  }
}
