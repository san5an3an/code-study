import { TestBed } from '@angular/core/testing';
import { language } from '@codemirror/language';
import { EditorView, runScopeHandlers } from '@codemirror/view';

import type { CourseId } from '../../../domain/course';

import { CodeEditor } from './code-editor';

const SOURCE = 'public class A {\n  int score = 50;\n}\n';

async function render(value = SOURCE, course: CourseId = 'java') {
  const fixture = TestBed.createComponent(CodeEditor);
  const changes: string[] = [];
  fixture.componentRef.setInput('value', value);
  fixture.componentRef.setInput('label', 'A.java 코드');
  fixture.componentRef.setInput('course', course);
  fixture.componentInstance.valueChange.subscribe((v) => changes.push(v));
  fixture.detectChanges();
  const el = fixture.nativeElement as HTMLElement;
  // 편집기 코드를 따로 불러오고 나서 .cm-content 가 생김
  await vi.waitFor(() => expect(el.querySelector('.cm-content')).not.toBeNull());
  fixture.detectChanges();
  const view = EditorView.findFromDOM(el.querySelector('.cm-editor') as HTMLElement)!;
  return { fixture, el, view, changes };
}

describe('코드 편집기', () => {
  it('불러오기 전엔 자리 표시를 보여 주고, 다 불러오면 코드와 읽어 줄 이름이 들어간 편집기로 바뀜', async () => {
    const fixture = TestBed.createComponent(CodeEditor);
    fixture.componentRef.setInput('value', SOURCE);
    fixture.componentRef.setInput('label', 'A.java 코드');
    fixture.componentRef.setInput('course', 'java');
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('[aria-busy="true"]')).not.toBeNull();

    await vi.waitFor(() => expect(el.querySelector('.cm-content')).not.toBeNull());
    fixture.detectChanges();
    expect(el.querySelector('[aria-busy="true"]')).toBeNull();
    expect(el.querySelector('.cm-content')!.getAttribute('aria-label')).toBe('A.java 코드');
    expect(el.querySelector('.cm-content')!.textContent).toContain('int score = 50;');
  });

  it('편집기에서 글을 고치면 고친 전체 글을 부모에게 알림', async () => {
    const { view, changes } = await render();
    view.dispatch({ changes: { from: 0, insert: '// 고침\n' } });
    expect(changes).toEqual([`// 고침\n${SOURCE}`]);
  });

  it('부모가 값을 바꾸면 편집기 글이 그 값으로 바뀌고, 그 일로는 다시 알리지 않음', async () => {
    const { fixture, view, changes } = await render();
    fixture.componentRef.setInput('value', 'class B {}\n');
    fixture.detectChanges();
    await vi.waitFor(() => expect(view.state.doc.toString()).toBe('class B {}\n'));
    expect(changes).toEqual([]);
  });

  it('Tab 을 누르면 커서 줄이 공백 4칸 들여써지고, Shift+Tab 이면 다시 내어써짐', async () => {
    const { view } = await render('int a = 1;\n');
    const press = (shiftKey: boolean) =>
      runScopeHandlers(view, new KeyboardEvent('keydown', { key: 'Tab', shiftKey }), 'editor');

    expect(press(false)).toBe(true);
    expect(view.state.doc.line(1).text).toBe('    int a = 1;');
    expect(press(true)).toBe(true);
    expect(view.state.doc.line(1).text).toBe('int a = 1;');
  });

  it('과목에 맞는 언어로 문법을 읽음', async () => {
    expect((await render(SOURCE, 'java')).view.state.facet(language)?.name).toBe('java');
    expect((await render('print("hi")\n', 'python')).view.state.facet(language)?.name).toBe(
      'python',
    );
  });
});
