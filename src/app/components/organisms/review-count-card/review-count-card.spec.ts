import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ReviewCountCard } from './review-count-card';

function render(count: number) {
  TestBed.configureTestingModule({ providers: [provideRouter([])] });
  const fixture = TestBed.createComponent(ReviewCountCard);
  fixture.componentRef.setInput('count', count);
  fixture.componentRef.setInput('href', '/java/review');
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('오답 노트 카드', () => {
  it('틀린 문제 수와 review page로 가는 링크', () => {
    const el = render(3);
    expect(el.querySelector('[data-slot="card-title"]')!.textContent).toContain('틀린 문제 3개');
    const link = el.querySelector('[data-slot="card-action"] a')!;
    expect(link.getAttribute('href')).toBe('/java/review');
    expect(link.textContent).toContain('오답 노트 풀기');
  });
});
