import { TestBed } from '@angular/core/testing';

import type { QuizQuestion } from '../../../domain/lecture-content';
import { EMPTY_ANSWER, type Answer } from '../../../domain/quiz-answer';
import { QuizView, type QuizAnswerChange, type QuizStatus } from './quiz-view';

function question(n: number, correct: string): QuizQuestion {
  return {
    n,
    kind: 'ox',
    label: 'OX',
    outsideLecture: false,
    prompt: `${n}번 맞나요?`,
    options: [],
    correct: [correct],
    answerHead: correct,
    isExample: false,
    explanation: '',
  };
}

const QUESTIONS = [question(1, 'O'), question(2, 'X'), question(3, 'O')];

function render(inputs: {
  status?: QuizStatus;
  questions?: QuizQuestion[];
  answers?: Record<number, Answer>;
  best?: { right: number; total: number; at: string } | null;
  inReview?: number[];
}) {
  const fixture = TestBed.createComponent(QuizView);
  const changes: QuizAnswerChange[] = [];
  let resets = 0;
  fixture.componentRef.setInput('status', inputs.status ?? 'ready');
  fixture.componentRef.setInput('questions', inputs.questions ?? QUESTIONS);
  fixture.componentRef.setInput('answers', inputs.answers ?? {});
  fixture.componentRef.setInput('best', inputs.best ?? null);
  fixture.componentRef.setInput('inReview', inputs.inReview ?? []);
  fixture.componentInstance.answerChange.subscribe((c) => changes.push(c));
  fixture.componentInstance.resetAll.subscribe(() => resets++);
  fixture.detectChanges();
  return { el: fixture.nativeElement as HTMLElement, changes, resets: () => resets };
}

const graded = (picked: string): Answer => ({ ...EMPTY_ANSWER, picked: [picked], graded: true });

describe('퀴즈 탭 화면', () => {
  it('문제 카드를 문제 수만큼 그리고, 요약 줄에 푼 수와 맞음, 틀림을 셈', () => {
    const { el } = render({ answers: { 1: graded('O'), 2: graded('O') } });
    expect(el.querySelectorAll('app-question-card')).toHaveLength(3);
    expect(
      el.querySelector('[data-testid="quiz-summary"]')!.textContent!.replace(/\s+/g, ' ').trim(),
    ).toBe('3문제 중 2문제 풀었어요 · 맞음 1 · 틀림 1');
  });

  it('최고 기록이 있을 때만 최고 기록을 붙임', () => {
    expect(render({}).el.querySelector('[data-testid="quiz-best"]')).toBeNull();
    const { el } = render({ best: { right: 2, total: 3, at: '' } });
    expect(el.querySelector('[data-testid="quiz-best"]')!.textContent).toContain('최고 기록 2 / 3');
  });

  it('오답 노트에 있는 문제 카드에만 표시를 붙임', () => {
    const { el } = render({ inReview: [2] });
    expect(el.querySelector('[data-testid="quiz-1"]')!.textContent).not.toContain(
      '오답 노트에 있어요',
    );
    expect(el.querySelector('[data-testid="quiz-2"]')!.textContent).toContain('오답 노트에 있어요');
  });

  it('카드에서 답이 바뀌면 문제와 새 답을 부모에게 알림', () => {
    const { el, changes } = render({});
    const o = [...el.querySelectorAll<HTMLButtonElement>('[data-testid="quiz-2"] button')].find(
      (b) => b.textContent!.trim() === 'O',
    )!;
    o.click();
    expect(changes).toEqual([{ q: QUESTIONS[1], answer: graded('O') }]);
  });

  it('손댄 문제가 있을 때만 처음부터 다시가 보이고, 누르면 부모에게 알림', () => {
    expect(render({}).el.textContent).not.toContain('처음부터 다시');
    const { el, resets } = render({ answers: { 1: graded('O') } });
    [...el.querySelectorAll('button')]
      .find((b) => b.textContent!.includes('처음부터 다시'))!
      .click();
    expect(resets()).toBe(1);
  });

  it('불러오는 중, 실패, 퀴즈 없는 과목, 문제가 0개인 파일 상태를 그림', () => {
    expect(render({ status: 'loading' }).el.querySelector('[aria-busy="true"]')).not.toBeNull();
    expect(render({ status: 'error' }).el.textContent).toContain('npm run sync');
    expect(render({ status: 'none' }).el.textContent).toContain('아직 퀴즈가 없어요');
    expect(render({ questions: [] }).el.querySelector('[data-testid="quiz-error"]')).not.toBeNull();
  });
});
