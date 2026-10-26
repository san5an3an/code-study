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

const CODE_Q = question({
  kind: 'write',
  label: '직접 짜보기',
  options: [],
  correct: [],
  isExample: true,
  answerHead: '',
  explanation: '```java\nSystem.out.println(1);\n```',
  expectedOutput: '1\n',
  hints: ['쉬운 **설명**', '- 할 일', '```java\n___\n```'],
});

// 코드 문제용. 처음 답과 채점 중 여부를 넣고, 카드가 내보낸 채점 요청도 모음
function renderCode(q: QuizQuestion, answer: Answer = EMPTY_ANSWER, grading = false) {
  const fixture = TestBed.createComponent(QuestionCard);
  const answers: Answer[] = [];
  const requests: string[] = [];
  fixture.componentRef.setInput('q', q);
  fixture.componentRef.setInput('answer', answer);
  fixture.componentRef.setInput('grading', grading);
  fixture.componentInstance.answerChange.subscribe((a) => {
    answers.push(a);
    fixture.componentRef.setInput('answer', a);
    fixture.detectChanges();
  });
  fixture.componentInstance.gradeRequest.subscribe((s) => requests.push(s));
  fixture.detectChanges();
  const el = fixture.nativeElement as HTMLElement;
  const button = (text: string) =>
    [...el.querySelectorAll('button')].find((b) => b.textContent!.trim().startsWith(text));
  const text = (testId: string) =>
    el.querySelector(`[data-testid="${testId}"]`)?.textContent ?? null;
  return { el, answers, requests, button, text };
}

describe('문제 카드 코드 채점과 힌트', () => {
  it('출력 예가 있는 문제만 문제 글 밑에 출력 예를 보여 줌', () => {
    const shown = renderCode({ ...CODE_Q, outputExample: '2020년은 윤년\n2024년은 윤년\n' });
    expect(shown.text('quiz-output-example')).toContain('출력 예');
    expect(shown.el.querySelector('[data-testid="quiz-output-example"] pre')!.textContent).toBe(
      '2020년은 윤년\n2024년은 윤년\n',
    );
    expect(renderCode(CODE_Q).text('quiz-output-example')).toBeNull();
  });

  it('힌트 보기를 누를 때마다 한 단계씩 열리고, 다 열면 버튼이 사라짐', () => {
    const { el, answers, button } = renderCode(CODE_Q);
    expect(el.querySelector('[data-testid="quiz-hint-1"]')).toBeNull();
    button('힌트 보기 (1/3)')!.click();
    expect(el.querySelector('[data-testid="quiz-hint-1"]')!.innerHTML).toContain(
      '<strong>설명</strong>',
    );
    expect(el.querySelector('[data-testid="quiz-hint-2"]')).toBeNull();
    button('힌트 보기 (2/3)')!.click();
    button('힌트 보기 (3/3)')!.click();
    expect(el.querySelector('[data-testid="quiz-hint-3"] pre')).not.toBeNull();
    expect(button('힌트 보기')).toBeUndefined();
    expect(answers.at(-1)!.hintsShown).toBe(3);
  });

  it('채점하기는 코드를 써야 눌리고, 누르면 그때 편집기 글을 내보냄', () => {
    expect(renderCode(CODE_Q).button('채점하기')!.disabled).toBe(true);
    const { requests, button } = renderCode(CODE_Q, { ...EMPTY_ANSWER, text: 'int a;' });
    button('채점하기')!.click();
    expect(requests).toEqual(['int a;']);
  });

  it('채점 결과를 기다리는 동안은 채점하는 중으로 바뀌고 눌리지 않음', () => {
    const { button } = renderCode(CODE_Q, { ...EMPTY_ANSWER, text: 'int a;' }, true);
    expect(button('채점하는 중')!.disabled).toBe(true);
    expect(button('채점하기')).toBeUndefined();
  });

  it('예시 답안 출력이 null 인 문제는 채점하기 대신 스스로 체크 안내를 보여 줌', () => {
    const { button, text } = renderCode({ ...CODE_Q, expectedOutput: null });
    expect(button('채점하기')).toBeUndefined();
    expect(text('quiz-no-grading')).toContain('자동 채점을 안 해요');
  });

  it('틀리면 처음 다른 줄의 기대한 출력과 내 출력을 보여 주고, 직접 바꾸는 버튼이 나옴', () => {
    const grade = {
      source: 'x',
      outcome: 'wrong' as const,
      diff: { line: 2, expected: '3*2=6', actual: null },
    };
    const { el, answers, button, text } = renderCode(CODE_Q, {
      ...EMPTY_ANSWER,
      text: 'x',
      grade,
      self: 'wrong',
    });
    expect(text('quiz-grade')).toContain('틀렸어요. 2번째 줄이 달라요');
    expect(text('quiz-grade')).toContain('기대한 출력');
    expect(text('quiz-grade')).toContain('3*2=6');
    expect(text('quiz-grade')).toContain('(줄 없음)');
    expect(el.textContent).toContain('채점이 이상하면 직접 바꿔요:');
    expect(el.querySelector('[data-testid="quiz-explanation"]')).toBeNull();
    expect(button('다시 채점하기')).toBeDefined();
    button('맞았어요')!.click();
    expect(answers.at(-1)!.self).toBe('right');
  });

  it('다른 줄의 공백은 코드 칸에 그대로 두고, 빈 줄과 없는 줄은 코드 칸 밖에 말로 보여 줌', () => {
    const { el } = renderCode(CODE_Q, {
      ...EMPTY_ANSWER,
      text: 'x',
      grade: {
        source: 'x',
        outcome: 'wrong',
        diff: { line: 1, expected: 'pen     1500', actual: '' },
      },
    });
    const codes = [...el.querySelectorAll('[data-testid="quiz-grade"] dd code')].map(
      (c) => c.textContent,
    );
    expect(codes).toEqual(['pen     1500']);
    expect(el.querySelector('[data-testid="quiz-grade"] dl')!.textContent).toContain('(빈 줄)');
  });

  it('맞으면 맞았어요를 보여 줌', () => {
    const { text } = renderCode(CODE_Q, {
      ...EMPTY_ANSWER,
      text: 'x',
      grade: { source: 'x', outcome: 'right' },
      self: 'right',
    });
    expect(text('quiz-grade')).toContain('맞았어요. 출력이 정답과 같아요');
  });

  it('5초를 넘겨 멈추면 그 이유를, 실행 에러면 에러 앞 세 줄을 보여 줌', () => {
    const timeout = renderCode(CODE_Q, {
      ...EMPTY_ANSWER,
      text: 'x',
      grade: { source: 'x', outcome: 'runError', exitCode: null, timedOut: true, stderr: '' },
    });
    expect(timeout.text('quiz-grade')).toContain('5초가 넘게 걸려서 멈췄어요');
    expect(timeout.el.querySelector('[data-testid="quiz-grade"] pre')).toBeNull();

    const stderr =
      'Exception in thread "main" java.lang.ArithmeticException\n\tat A\n\tat B\n\tat C';
    const crash = renderCode(CODE_Q, {
      ...EMPTY_ANSWER,
      text: 'x',
      grade: { source: 'x', outcome: 'runError', exitCode: 1, timedOut: false, stderr },
    });
    expect(crash.text('quiz-grade')).toContain('실행 중에 에러가 나서 멈췄어요');
    expect(crash.el.querySelector('[data-testid="quiz-grade"] pre')!.textContent).toBe(
      'Exception in thread "main" java.lang.ArithmeticException\n\tat A\n\tat B',
    );
  });

  it('컴파일 에러면 밑줄부터 고치라고 하고 첫 에러만 보여 주며, 직접 바꾸는 버튼은 안 나옴', () => {
    const diagnostics = [
      {
        file: 'Main.java',
        line: 1,
        column: 4,
        severity: 'error' as const,
        message: "';' expected",
      },
      { file: 'Main.java', line: 3, column: 0, severity: 'error' as const, message: '두 번째' },
    ];
    const { el, text } = renderCode(CODE_Q, {
      ...EMPTY_ANSWER,
      text: 'x',
      grade: { source: 'x', outcome: 'compileError', diagnostics },
    });
    expect(text('quiz-grade')).toContain('먼저 빨간 밑줄을 고쳐 봐요');
    expect(text('quiz-grade')).toContain("1번째 줄: ';' expected");
    expect(text('quiz-grade')).not.toContain('두 번째');
    expect(el.textContent).not.toContain('채점이 이상하면');
    expect(el.textContent).not.toContain('스스로 체크해 봐요');
  });

  it('채점한 뒤에 코드를 고치면 다시 채점하라고 알려 줌', () => {
    const grade = { source: 'old', outcome: 'right' as const };
    expect(
      renderCode(CODE_Q, { ...EMPTY_ANSWER, text: 'old', grade }).text('quiz-grade'),
    ).not.toContain('채점한 뒤에 코드를 고쳤어요');
    expect(
      renderCode(CODE_Q, { ...EMPTY_ANSWER, text: 'new', grade }).text('quiz-grade'),
    ).toContain('채점한 뒤에 코드를 고쳤어요');
  });
});
