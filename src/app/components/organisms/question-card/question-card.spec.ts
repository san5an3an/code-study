import { TestBed } from '@angular/core/testing';
import { EditorView } from '@codemirror/view';

import type { QuizQuestion } from '../../../domain/lecture-content';
import { EMPTY_ANSWER, type Answer } from '../../../domain/quiz-answer';
import { QuestionCard } from './question-card';

function question(over: Partial<QuizQuestion>): QuizQuestion {
  return {
    n: 3,
    kind: 'choice',
    label: '객관식',
    outsideLecture: false,
    prompt: '고르세요.',
    options: ['`7`', '`7.0`', '`"7"`'],
    correct: [2],
    answerHead: '2번 `7.0`',
    isExample: false,
    explanation: '실수예요.',
    ...over,
  };
}

// 카드가 내보낸 새 답을 다시 입력으로 넣어, 부모가 답을 들고 있는 것처럼 돌림
function render(q: QuizQuestion, inReview = false) {
  const fixture = TestBed.createComponent(QuestionCard);
  const answers: Answer[] = [];
  fixture.componentRef.setInput('q', q);
  fixture.componentRef.setInput('inReview', inReview);
  fixture.componentInstance.answerChange.subscribe((a) => {
    answers.push(a);
    fixture.componentRef.setInput('answer', a);
    fixture.detectChanges();
  });
  fixture.detectChanges();
  const el = fixture.nativeElement as HTMLElement;
  const button = (text: string) =>
    [...el.querySelectorAll('button')].find((b) => b.textContent!.trim().startsWith(text))!;
  return { el, answers, button };
}

describe('문제 카드', () => {
  it('머리에 문제 번호, 종류, 강의 밖 내용, 오답 노트 표시를 붙임', () => {
    const { el } = render(question({ outsideLecture: true }), true);
    const card = el.querySelector('[data-testid="quiz-3"]')!;
    expect(card.getAttribute('role')).toBe('group');
    expect(card.textContent).toContain('3번 문제');
    expect(card.textContent).toContain('객관식');
    expect(card.textContent).toContain('강의 밖 내용');
    expect(card.textContent).toContain('오답 노트에 있어요');
  });

  it('객관식 보기를 누르면 바로 채점하고 보기를 잠그며 정답과 해설을 보여 줌', () => {
    const { el, answers, button } = render(question({}));
    expect(el.querySelector('[data-testid="quiz-explanation"]')).toBeNull();
    button('1.').click();
    expect(answers.at(-1)).toEqual({ ...EMPTY_ANSWER, picked: [1], graded: true });
    expect(el.textContent).toContain('틀렸어요');
    expect(button('2.').disabled).toBe(true);
    const explanation = el.querySelector('[data-testid="quiz-explanation"]')!;
    expect(explanation.innerHTML).toContain('<code>7.0</code>');
  });

  it('OX 정답을 누르면 맞았어요, 다시 풀기를 누르면 빈 답으로 돌아감', () => {
    const { el, answers, button } = render(
      question({ kind: 'ox', label: 'OX', options: [], correct: ['O'] }),
    );
    button('O').click();
    expect(el.textContent).toContain('맞았어요');
    button('다시 풀기').click();
    expect(answers.at(-1)).toBe(EMPTY_ANSWER);
    expect(el.textContent).not.toContain('맞았어요');
  });

  it('정답이 여러 개면 체크박스로 고르고 채점하기를 눌러야 채점함', () => {
    const { el, button } = render(question({ correct: [1, 3] }));
    expect(button('채점하기').disabled).toBe(true);
    const boxes = el.querySelectorAll<HTMLButtonElement>('hlm-checkbox button');
    boxes[0].click();
    boxes[2].click();
    expect(el.querySelector('[data-testid="quiz-explanation"]')).toBeNull();
    button('채점하기').click();
    expect(el.textContent).toContain('맞았어요');
  });

  it('스스로 체크하는 문제는 정답 보기 뒤 해설과 맞았어요, 틀렸어요 버튼이 나오고 예시 답안이면 제목이 바뀜', () => {
    const { el, answers, button } = render(
      question({
        kind: 'write',
        label: '직접 짜보기',
        options: [],
        correct: [],
        isExample: true,
        answerHead: '',
      }),
    );
    const box = el.querySelector('textarea')!;
    box.value = 'int a = 1;';
    box.dispatchEvent(new Event('input'));
    expect(answers.at(-1)!.text).toBe('int a = 1;');
    button('정답 보기').click();
    expect(el.querySelector('[data-testid="quiz-explanation"]')!.textContent).toContain(
      '예시 답안',
    );
    button('틀렸어요').click();
    expect(answers.at(-1)!.self).toBe('wrong');
    expect(button('틀렸어요').getAttribute('aria-pressed')).toBe('true');
  });

  it('예시 답안이 코드인 직접 쓰기 문제는 코드 편집기로, 말로 답하는 문제는 글 칸으로 답함', async () => {
    const code = render(
      question({ kind: 'write', label: '코드 작성', explanation: '```java\nint a = 1;\n```' }),
    );
    expect(code.el.querySelector('textarea')).toBeNull();
    await vi.waitFor(() => expect(code.el.querySelector('.cm-content')).not.toBeNull());
    expect(code.el.querySelector('.cm-content')!.getAttribute('aria-label')).toBe(
      '3번 문제 내 답 코드',
    );
    const view = EditorView.findFromDOM(code.el.querySelector('.cm-editor') as HTMLElement)!;
    view.dispatch({ changes: { from: 0, insert: 'int b;' } });
    expect(code.answers.at(-1)).toEqual({ ...EMPTY_ANSWER, text: 'int b;' });

    const prose = render(question({ kind: 'write', label: '에러 찾기', explanation: '세미콜론' }));
    expect(prose.el.querySelector('textarea')).not.toBeNull();
    expect(prose.el.querySelector('app-code-editor')).toBeNull();
  });
});
