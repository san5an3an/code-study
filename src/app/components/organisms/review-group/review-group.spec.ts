import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import type { QuizQuestion } from '../../../domain/lecture-content';
import type { ReviewGroup as Group } from '../../../domain/review-groups';
import type { QuizAnswerChange } from '../quiz-view/quiz-view';
import { ReviewGroup } from './review-group';

function ox(n: number): QuizQuestion {
  return {
    n,
    kind: 'ox',
    label: 'OX',
    outsideLecture: false,
    prompt: `${n}번 글`,
    options: [],
    correct: ['O'],
    answerHead: 'O',
    isExample: false,
    explanation: '',
  };
}

const LECTURE = { id: '03', part: 1, title: '변수와 상수', folder: '03' };

function render(group: Group) {
  TestBed.configureTestingModule({ providers: [provideRouter([])] });
  const fixture = TestBed.createComponent(ReviewGroup);
  const changes: QuizAnswerChange[] = [];
  fixture.componentRef.setInput('group', group);
  fixture.componentRef.setInput('base', '/java');
  fixture.componentInstance.answerChange.subscribe((c) => changes.push(c));
  fixture.detectChanges();
  return { el: fixture.nativeElement as HTMLElement, changes };
}

describe('오답 노트 강의 묶음', () => {
  it('제목 줄에 강의 번호, 제목, 찾은 문제 수를 쓰고 그 제목으로 묶음 이름을 붙임', () => {
    const { el } = render({ lecture: LECTURE, questions: [ox(2), ox(5)], failed: false });
    const section = el.querySelector('[data-testid="review-group-03"]')!;
    const heading = el.querySelector('h2')!;
    expect(heading.textContent!.replace(/\s+/g, ' ').trim()).toBe('03강. 변수와 상수 · 2문제');
    expect(section.getAttribute('aria-labelledby')).toBe(heading.id);
  });

  it('이 강의 퀴즈로 가기는 그 강의의 퀴즈 탭으로 감', () => {
    const { el } = render({ lecture: LECTURE, questions: [ox(2)], failed: false });
    const link = [...el.querySelectorAll('a')].find((a) =>
      a.textContent!.includes('이 강의 퀴즈로'),
    )!;
    expect(link.getAttribute('href')).toBe('/java/lecture/03?tab=quiz');
  });

  it('카드 id 앞에 강의 번호를 붙이고, 오답 노트 표시는 붙이지 않으며, 화면 낭독기 이름에만 강의 번호가 들어감', () => {
    const { el } = render({ lecture: LECTURE, questions: [ox(2)], failed: false });
    const card = el.querySelector('[data-testid="review-03-2"]')!;
    expect(card).not.toBeNull();
    expect(card.textContent).not.toContain('오답 노트에 있어요');
    const title = el.querySelector(`#${card.getAttribute('aria-labelledby')}`)!;
    expect(title.querySelector('.sr-only')!.textContent!.trim()).toBe('03강');
    expect(title.textContent!.replace(/\s+/g, ' ').trim()).toBe('03강 2번 문제');
  });

  it('카드에서 답하면 문제와 새 답을 같이 내보냄', () => {
    const { el, changes } = render({ lecture: LECTURE, questions: [ox(2)], failed: false });
    const o = [...el.querySelectorAll('button')].find((b) => b.textContent!.trim() === 'O')!;
    o.click();
    expect(changes).toHaveLength(1);
    expect(changes[0].q.n).toBe(2);
    expect(changes[0].answer).toMatchObject({ picked: ['O'], graded: true });
  });

  it('퀴즈 파일을 못 불러온 묶음은 문제 수 없이 제목을 두고 sync 안내를 보여 줌', () => {
    const { el } = render({ lecture: LECTURE, questions: [], failed: true });
    expect(el.querySelector('h2')!.textContent!.replace(/\s+/g, ' ').trim()).toBe(
      '03강. 변수와 상수',
    );
    expect(el.querySelector('[data-testid="review-error-03"]')!.textContent).toContain(
      'npm run sync',
    );
    expect(el.querySelector('[data-testid^="review-03-"]')).toBeNull();
  });
});
