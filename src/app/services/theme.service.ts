import { DOCUMENT, Injectable, inject, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'code-study:theme';

// 첫 값은 index.html 이 화면을 그리기 전에 넣은 data-theme 값을 따름
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly current = signal<Theme>(this.read());

  readonly theme = this.current.asReadonly();

  private read(): Theme {
    return this.document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  set(next: Theme) {
    const root = this.document.documentElement;
    // transition 이 걸린 요소만 늦게 바뀌어 잠깐 흐려 보이므로 테마를 바꾸는 순간만 transition 을 끔
    const freeze = this.document.createElement('style');
    freeze.textContent = '*,*::before,*::after{transition:none!important}';
    this.document.head.appendChild(freeze);
    root.setAttribute('data-theme', next);
    void this.document.defaultView?.getComputedStyle(this.document.body).color;
    requestAnimationFrame(() => freeze.remove());
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // 저장이 막혀도 이번 화면에서는 바뀐 테마가 유지됨
    }
    this.current.set(next);
  }

  toggle() {
    this.set(this.read() === 'dark' ? 'light' : 'dark');
  }
}
