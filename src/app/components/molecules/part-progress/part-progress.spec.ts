import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { partSummaries } from '../../../domain/course-summary';
import { JAVA_COURSE } from '../../../domain/lectures-java';
import { PartProgress } from './part-progress';

function render(index: number, completed: string[]) {
  TestBed.configureTestingModule({ providers: [provideRouter([])] });
  const summary = partSummaries(JAVA_COURSE, new Set(completed))[index];
  const fixture = TestBed.createComponent(PartProgress);
  fixture.componentRef.setInput('summary', summary);
  fixture.componentRef.setInput('href', '/java/lecture/' + summary.first.id);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('부별 진행 카드', () => {
  it('카드 전체가 그 부 첫 강의로 가는 링크', () => {
    const link = render(1, []).querySelector('a')!;
    expect(link.getAttribute('href')).toBe('/java/lecture/06');
    expect(link.textContent).toContain('06강부터');
  });

  it('끝낸 수/강의 수와 막대 값', () => {
    const el = render(0, ['01', '03']);
    expect(el.textContent).toContain('2/5강');
    expect(el.querySelector('[data-slot="progress"]')!.getAttribute('aria-valuenow')).toBe('40');
  });
});
