import { TestBed } from '@angular/core/testing';

import { OverallProgressCard } from './overall-progress-card';

function render(done: number, total: number) {
  const fixture = TestBed.createComponent(OverallProgressCard);
  fixture.componentRef.setInput('done', done);
  fixture.componentRef.setInput('total', total);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('전체 진행률 카드', () => {
  it('끝낸 강의 수를 퍼센트, 진행 막대, 문구로 그림', () => {
    const el = render(5, 22);
    expect(el.textContent).toContain('23%');
    expect(el.textContent).toContain('22강 중 5강 끝냄');
    const bar = el.querySelector('[data-slot="progress"]')!;
    expect(bar.getAttribute('aria-label')).toBe('전체 진행률');
    expect(bar.getAttribute('aria-valuenow')).toBe('23');
  });

  it('끝낸 강의가 하나도 없으면 0%', () => {
    expect(render(0, 18).textContent).toContain('0%');
  });
});
