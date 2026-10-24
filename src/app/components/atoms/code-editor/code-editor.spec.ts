import { TestBed } from '@angular/core/testing';
import { language } from '@codemirror/language';
import { forEachDiagnostic, type Diagnostic } from '@codemirror/lint';
import { Text } from '@codemirror/state';
import { EditorView, runScopeHandlers } from '@codemirror/view';

import type { CourseId } from '../../../domain/course';

import { CodeEditor } from './code-editor';
import { diagnosticRange } from './code-editor-setup';

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

  it('오타 검사 결과를 받으면 그 자리에 밑줄을 긋고, 지금 글과 다른 코드로 낸 결과는 무시함', async () => {
    const source = 'class A {\n    Sytem.out.println(1);\n}\n';
    const { fixture, view } = await render(source);
    const shown = () => {
      const found: Pick<Diagnostic, 'from' | 'to' | 'message'>[] = [];
      forEachDiagnostic(view.state, (d, from, to) => found.push({ from, to, message: d.message }));
      return found;
    };
    const diagnostic = {
      file: 'A.java',
      line: 2,
      column: 9,
      severity: 'error' as const,
      message: 'package Sytem does not exist',
    };

    fixture.componentRef.setInput('check', { source: 'class B {}', diagnostics: [diagnostic] });
    fixture.detectChanges();
    await new Promise((r) => setTimeout(r));
    expect(shown()).toEqual([]);

    fixture.componentRef.setInput('check', { source, diagnostics: [diagnostic] });
    fixture.detectChanges();
    await vi.waitFor(() =>
      expect(shown()).toEqual([{ from: 14, to: 19, message: 'package Sytem does not exist' }]),
    );
    expect(source.slice(14, 19)).toBe('Sytem');
  });
});

describe('오타 자리 계산', () => {
  const doc = Text.of(['int a = ;', '', 'Sytem.out']);
  it('칸에서 시작하는 이름 전체, 이름 뒤 기호면 앞 이름, 그 밖의 기호면 한 글자, 줄 끝이면 앞 글자를 가리킴', () => {
    expect(diagnosticRange(doc, { line: 1, column: 0 })).toEqual({ from: 0, to: 3 });
    expect(diagnosticRange(doc, { line: 3, column: 5 })).toEqual({ from: 11, to: 16 });
    expect(diagnosticRange(doc, { line: 1, column: 8 })).toEqual({ from: 8, to: 9 });
    expect(diagnosticRange(doc, { line: 1, column: 9 })).toEqual({ from: 8, to: 9 });
  });

  it('빈 줄은 길이 0 으로, 없는 줄이면 null', () => {
    expect(diagnosticRange(doc, { line: 2, column: 0 })).toEqual({ from: 10, to: 10 });
    expect(diagnosticRange(doc, { line: 4, column: 0 })).toBeNull();
  });
});
