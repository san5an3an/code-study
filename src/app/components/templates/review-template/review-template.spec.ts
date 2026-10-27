import { Component, input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ReviewTemplate, type ReviewView } from './review-template';

// 묶음 자리에 넣은 내용이 ready 일 때만 보이는지 보려고 감싸서 그림
@Component({
  imports: [ReviewTemplate],
  template: `
    <app-review-template [view]="view()" [quizLink]="quizLink()">
      <p reviewGroups data-testid="slot">묶음 자리</p>
    </app-review-template>
  `,
})
class Host {
  readonly view = input<ReviewView>('ready');
  readonly quizLink = input<string | null>(null);
}

function render(view: ReviewView, quizLink: string | null = null) {
  const fixture = TestBed.createComponent(Host);
  fixture.componentRef.setInput('view', view);
  fixture.componentRef.setInput('quizLink', quizLink);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('오답 노트 화면 틀', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));

  it('제목과 한 줄 설명을 늘 보여 주고, ready 일 때만 묶음 자리를 그림', () => {
    const el = render('ready');
    expect(el.querySelector('h1')!.textContent).toBe('오답 노트');
    expect(el.textContent).toContain('퀴즈에서 틀린 문제만 모아 다시 풀어요');
    expect(el.querySelector('[data-testid="slot"]')).not.toBeNull();
    expect(render('empty').querySelector('[data-testid="slot"]')).toBeNull();
  });

  it('틀린 문제가 없으면 빈 화면과 마지막에 본 강의 퀴즈로 가는 버튼을 보여 줌', () => {
    const el = render('empty', '/java/lecture/07');
    const empty = el.querySelector('[data-testid="review-empty"]')!;
    expect(empty.textContent).toContain('틀린 문제가 아직 없어요');
    expect(empty.querySelector('a')!.getAttribute('href')).toBe('/java/lecture/07?tab=quiz');
    expect(empty.querySelector('a')!.textContent!.trim()).toBe('퀴즈 풀러 가기');
  });

  it('불러오는 중엔 이름표가 붙은 회색 상자 하나만 보여 줌', () => {
    const el = render('loading');
    expect(el.querySelector('[aria-label="오답 노트 불러오는 중"]')).not.toBeNull();
    expect(el.querySelector('[data-testid="review-empty"]')).toBeNull();
  });

  it('퀴즈가 없는 과목은 안내만 보여 주고 퀴즈 풀러 가기 버튼이 없음', () => {
    const el = render('none', '/python/lecture/01');
    expect(el.querySelector('[data-testid="review-none"]')!.textContent).toContain(
      '이 과목은 아직 퀴즈가 없어요',
    );
    expect(el.querySelector('a')).toBeNull();
  });
});
