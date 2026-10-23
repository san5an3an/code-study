import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { JAVA_COURSE } from '../../../domain/lectures-java';
import { resumeOf } from '../../../domain/course-summary';
import { ResumeCard } from './resume-card';

function render(lastLectureId: string | null) {
  TestBed.configureTestingModule({ providers: [provideRouter([])] });
  const resume = resumeOf(JAVA_COURSE, lastLectureId);
  const fixture = TestBed.createComponent(ResumeCard);
  fixture.componentRef.setInput('resume', resume);
  fixture.componentRef.setInput('href', '/java/lecture/' + resume.lecture.id);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('이어서 하기 카드', () => {
  it('마지막에 본 강의가 있으면 그 강의로 가는 이어서 하기 링크', () => {
    const el = render('07');
    const link = el.querySelector('a')!;
    expect(link.getAttribute('href')).toBe('/java/lecture/07');
    expect(link.textContent).toContain('이어서 하기');
    expect(el.textContent).toContain('07강.');
  });

  it('본 강의가 없으면 01강부터 시작하기 링크', () => {
    const el = render(null);
    expect(el.textContent).toContain('처음 시작');
    expect(el.querySelector('a')!.textContent).toContain('01강부터 시작하기');
  });
});
