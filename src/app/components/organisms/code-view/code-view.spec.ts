import { TestBed } from '@angular/core/testing';
import { EditorView } from '@codemirror/view';

import { MEMORY_STOPPED, OUTPUT_STOPPED, type CodeFile, type CodeRun } from '../../../core/run-api';
import { CodeView, type CodeRunRequest, type LiveRun } from './code-view';

const RUN = { stdout: '50\n', stderr: '', exitCode: 0, timedOut: false };
const FILES: CodeFile[] = [
  { file: 'A.java', className: 'A', hasMain: true, needsInput: false, run: RUN },
  { file: 'B.java', className: 'B', hasMain: false, needsInput: false, run: null },
];
const SOURCE = 'class A {}\n';

function render(inputs: Record<string, unknown> = {}) {
  const fixture = TestBed.createComponent(CodeView);
  const events = {
    file: [] as string[],
    run: [] as CodeRunRequest[],
    code: [] as string[],
    reset: 0,
  };
  const all = {
    course: 'java',
    status: 'ready',
    files: FILES,
    sourceStatus: 'ready',
    source: SOURCE,
    ...inputs,
  };
  for (const [k, v] of Object.entries(all)) fixture.componentRef.setInput(k, v);
  fixture.componentInstance.fileChange.subscribe((f) => events.file.push(f));
  fixture.componentInstance.run.subscribe((r) => events.run.push(r));
  fixture.componentInstance.codeChange.subscribe((c) => events.code.push(c));
  fixture.componentInstance.reset.subscribe(() => events.reset++);
  fixture.detectChanges();
  const el = fixture.nativeElement as HTMLElement;
  const button = (text: string) =>
    [...el.querySelectorAll('button')].find((b) => b.textContent!.trim() === text);
  const alerts = () => [...el.querySelectorAll('[role="alert"]')].map((a) => a.textContent!.trim());
  return { fixture, el, events, button, alerts };
}

async function editor(el: HTMLElement) {
  await vi.waitFor(() => expect(el.querySelector('.cm-editor')).not.toBeNull());
  return EditorView.findFromDOM(el.querySelector('.cm-editor') as HTMLElement)!;
}

describe('코드 탭 화면', () => {
  it('예제 파일 탭을 그리고 주소의 파일이 없으면 첫 파일을 열며, 탭을 누르면 파일 이름을 알림', () => {
    const { el, events } = render({ file: 'Nope.java' });
    const tabs = [...el.querySelectorAll('[role="tablist"][aria-label="예제 파일"] [role="tab"]')];
    expect(tabs.map((t) => t.textContent!.trim())).toEqual(['A.java', 'B.java']);
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    (tabs[1] as HTMLElement).click();
    expect(events.file).toEqual(['B.java']);
  });

  it('미리 돌려 둔 결과를 보여 주고, 실행을 누르면 지금 코드와 입력값을 알림', () => {
    const { el, events, button } = render();
    expect(el.querySelector('#run-result-heading')!.textContent!.trim()).toBe('미리 돌려 둔 결과');
    expect(el.querySelector('[data-testid="run-stdout"]')!.textContent).toBe('50\n');
    const stdin = el.querySelector('textarea') as HTMLTextAreaElement;
    stdin.value = '7';
    stdin.dispatchEvent(new Event('input'));
    button('실행')!.click();
    expect(events.run).toEqual([{ source: SOURCE, stdin: '7' }]);
  });

  it('코드를 고치면 알림과 원래대로가 나오고, 원래대로를 누르면 원래 글로 돌아가고 부모에게 알림', async () => {
    const { fixture, el, events, button, alerts } = render();
    expect(alerts()).toEqual([]);
    const view = await editor(el);
    view.dispatch({ changes: { from: 0, insert: '// 고침\n' } });
    fixture.detectChanges();
    expect(events.code).toEqual([`// 고침\n${SOURCE}`]);
    expect(alerts()).toEqual([
      '코드를 고쳤어요. 실행을 누르면 고친 코드로 돌려요. 아래는 원래 코드의 결과예요.',
    ]);
    button('원래대로')!.click();
    fixture.detectChanges();
    await vi.waitFor(() => expect(view.state.doc.toString()).toBe(SOURCE));
    expect(events.reset).toBe(1);
    expect(alerts()).toEqual([]);
  });

  it('방금 실행한 결과를 보여 주고, 실행 뒤에 또 고치면 알림', async () => {
    const live: LiveRun = {
      source: SOURCE,
      result: { ok: true, compile: { ...RUN, stdout: '' }, run: { ...RUN, stdout: '고친 42\n' } },
    };
    const { fixture, el, alerts } = render({ live });
    expect(el.querySelector('#run-result-heading')!.textContent!.trim()).toBe('방금 실행한 결과');
    expect(el.querySelector('[data-testid="run-stdout"]')!.textContent).toBe('고친 42\n');
    const view = await editor(el);
    view.dispatch({ changes: { from: 0, insert: '//' } });
    fixture.detectChanges();
    expect(alerts()).toEqual(['실행한 뒤에 코드를 또 고쳤어요. 아래 결과는 고치기 전 코드예요.']);
  });

  it('컴파일 에러, 에러 종료, 시간 초과, 서버 거절, 실행 중을 나눠 보여 줌', () => {
    const compileFail: LiveRun = {
      source: SOURCE,
      result: {
        ok: true,
        compile: { ...RUN, stdout: '', stderr: 'A.java:1: error', exitCode: 1 },
        run: null,
      },
    };
    const c = render({ live: compileFail });
    expect(c.el.textContent).toContain('컴파일 에러라 실행하지 않았어요');
    expect(c.el.querySelector('[data-testid="compile-error"]')!.textContent).toContain('A.java:1');

    const crash = render({
      files: [{ ...FILES[0], run: { ...RUN, stderr: 'boom', exitCode: 1 } }],
    });
    expect(crash.el.textContent).toContain('에러로 끝났어요(종료 코드 1).');
    const slow = render({ files: [{ ...FILES[0], run: { ...RUN, timedOut: true } }] });
    expect(slow.el.textContent).toContain('시간 제한(5초)을 넘겨 멈췄어요.');
    const status = (run: Partial<CodeRun>) =>
      render({ files: [{ ...FILES[0], run: { ...RUN, ...run } }] }).el.querySelector(
        '[data-testid="run-status"]',
      )?.textContent;
    expect(status({ exitCode: null, stderr: `${MEMORY_STOPPED}\n` })).toBe(
      '메모리를 256MB 넘게 써서 멈췄어요.',
    );
    expect(status({ exitCode: null, stdout: `x\n${OUTPUT_STOPPED}` })).toBe(
      '출력이 64KB를 넘어 멈췄어요.',
    );
    expect(status({ exitCode: null })).toBe('실행이 도중에 강제로 끝났어요.');
    expect(status({ exitCode: 0 })).toBeUndefined();

    const refused = render({ runError: '이미 실행 중인 코드가 많아요.', running: true });
    expect(refused.el.querySelector('[data-testid="run-error"]')!.textContent).toBe(
      '이미 실행 중인 코드가 많아요.',
    );
    expect(refused.button('실행 중…')!.disabled).toBe(true);
  });

  it('입력값 칸 안내는 자바면 Scanner, 파이썬이면 input() 으로 받는다고 함', () => {
    const label = (course: string) =>
      render({ course }).el.querySelector('label')!.textContent!.replace(/\s+/g, ' ');
    expect(label('java')).toContain('Scanner 로 받을 값');
    expect(label('python')).toContain('input() 으로 받을 값');
    expect(label('python')).not.toContain('Scanner');
  });

  it('main 없는 파일은 이유를 알려 주고 실행 버튼과 입력값 칸이 없음', () => {
    const { el, button } = render({ file: 'B.java' });
    expect(el.textContent).toContain('혼자 실행하는 파일이 아니에요');
    expect(button('실행')).toBeUndefined();
    expect(el.querySelector('textarea')).toBeNull();
  });

  it('목록 불러오는 중, 실패, 코드 실행이 없는 과목, 빈 목록, 파일 불러오기 실패를 그림', () => {
    expect(render({ status: 'loading' }).el.querySelector('[aria-busy="true"]')).not.toBeNull();
    expect(render({ status: 'error' }).el.textContent).toContain('npm run sync');
    expect(render({ status: 'none' }).el.textContent).toContain('코드 탭은 준비 중이에요');
    expect(render({ files: [] }).el.querySelector('[data-testid="code-error"]')).not.toBeNull();
    expect(
      render({ sourceStatus: 'error' }).el.querySelector('[data-testid="code-error"]'),
    ).not.toBeNull();
  });
});
