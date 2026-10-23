import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { findLecture } from '../../../domain/course';
import { lectureContext } from '../../../domain/lecture-view';
import { PYTHON_COURSE } from '../../../domain/lectures-python';
import { LectureNav } from './lecture-nav';

function render(id: string) {
  const { prev, next } = lectureContext(PYTHON_COURSE, findLecture(PYTHON_COURSE, id)!);
  const fixture = TestBed.createComponent(LectureNav);
  fixture.componentRef.setInput('prev', prev);
  fixture.componentRef.setInput('next', next);
  fixture.componentRef.setInput('base', '/python');
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('강의 이동', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));

  it('중간 강은 이전·다음 링크 둘 다', () => {
    const el = render('08');
    expect(el.querySelector('[data-testid="lecture-prev"]')!.getAttribute('href')).toBe('/python/lecture/07');
    expect(el.querySelector('[data-testid="lecture-next"]')!.getAttribute('href')).toBe('/python/lecture/09');
    expect(el.querySelector('[data-testid="lecture-next"]')!.textContent).toContain('09강');
  });

  it('첫 강은 다음만, 마지막 강은 이전만', () => {
    expect(render('01').querySelector('[data-testid="lecture-prev"]')).toBeNull();
    const last = render('18');
    expect(last.querySelector('[data-testid="lecture-next"]')).toBeNull();
    expect(last.querySelector('[data-testid="lecture-prev"]')!.getAttribute('href')).toBe('/python/lecture/17');
  });
});
