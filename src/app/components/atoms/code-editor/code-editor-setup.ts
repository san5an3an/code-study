// CodeMirror 편집기 만들기. 첫 화면 크기를 늘리지 않도록 code-editor 가 코드 탭을 처음 열 때만 이 파일을 따로 불러옴
import { indentWithTab } from '@codemirror/commands';
import { java } from '@codemirror/lang-java';
import { python } from '@codemirror/lang-python';
import {
  HighlightStyle,
  indentUnit,
  syntaxHighlighting,
  type LanguageSupport,
} from '@codemirror/language';
import { lintGutter, setDiagnostics, type Diagnostic } from '@codemirror/lint';
import { Annotation, type Text } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { tags } from '@lezer/highlight';
import { basicSetup } from 'codemirror';

import type { CodeCheck, CodeDiagnostic } from '../../../core/run-api';
import type { CourseId } from '../../../domain/course';

// 바깥에서 값을 넣은 변경 표시. 이 표시가 붙은 변경은 부모에게 다시 알리지 않음
const fromOutside = Annotation.define<boolean>();

// Cobalt 엔 코드 색 토큰이 없어 의미 색을 빌림. 전부 CSS 변수라 어두운 화면으로 바꾸면 색도 따라 바뀜
const cobaltHighlight = HighlightStyle.define([
  {
    tag: [tags.keyword, tags.modifier, tags.controlKeyword, tags.definitionKeyword],
    color: 'var(--semantic-fg-brand-default)',
  },
  { tag: [tags.string, tags.character], color: 'var(--semantic-fg-success-default)' },
  { tag: [tags.number, tags.bool, tags.null], color: 'var(--semantic-fg-warning-default)' },
  {
    tag: [tags.comment, tags.lineComment, tags.blockComment],
    color: 'var(--semantic-fg-neutral-subtlest)',
  },
]);

const cobaltTheme = EditorView.theme({
  '&': {
    color: 'var(--component-prose-code-fg)',
    backgroundColor: 'var(--component-prose-code-bg)',
    borderRadius: 'var(--semantic-radius-control)',
    // 안쪽 outline 은 가로로 밀리는 글자에 덮여 오른쪽 선이 사라져서 편집기는 테두리로 그음
    border: 'var(--semantic-border-width-default) solid var(--component-prose-code-border)',
    fontSize: '0.875rem',
  },
  '&.cm-focused': { outline: '2px solid var(--ring)' },
  '.cm-scroller': { fontFamily: 'var(--base-font-family-mono)', lineHeight: '1.5' },
  '.cm-content': { caretColor: 'var(--component-prose-code-fg)' },
  '.cm-gutters': {
    backgroundColor: 'transparent',
    color: 'var(--semantic-fg-neutral-subtlest)',
    border: 'none',
  },
  // basicSetup 이 넣는 현재 줄 강조는 원래 앱처럼 안 보이게 함. 접기 화살표는 IDE 처럼 남겨 둠
  '.cm-activeLine, .cm-activeLineGutter': { backgroundColor: 'transparent' },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection': {
    backgroundColor: 'color-mix(in oklch, var(--semantic-fg-brand-default) 25%, transparent)',
  },
  // 마우스를 올리면 뜨는 오타 문구 상자. 앱의 팝오버 색을 써서 어두운 화면에서도 읽힘
  '.cm-tooltip': {
    backgroundColor: 'var(--popover)',
    color: 'var(--popover-foreground)',
    border: 'var(--semantic-border-width-default) solid var(--border)',
    borderRadius: 'var(--semantic-radius-control)',
  },
  '.cm-diagnostic': { fontFamily: 'var(--base-font-family-mono)', maxWidth: '36rem' },
  '.cm-diagnostic-error': { borderLeftColor: 'var(--semantic-fg-danger-default)' },
  '.cm-diagnostic-warning': { borderLeftColor: 'var(--semantic-fg-warning-default)' },
});

// 과목마다 문법 색칠과 자동 들여쓰기 규칙
const LANGUAGES: Record<CourseId, () => LanguageSupport> = { java, python };

export function createEditor(
  parent: HTMLElement,
  doc: string,
  label: string,
  course: CourseId,
  onChange: (value: string) => void,
): EditorView {
  return new EditorView({
    parent,
    doc,
    extensions: [
      basicSetup,
      // Tab 은 들여쓰기, Shift+Tab 은 내어쓰기. 키보드로 편집기를 빠져나갈 땐 Esc 다음 Tab
      keymap.of([indentWithTab]),
      // 예제 코드가 모두 공백 4칸 들여쓰기라 한 단계를 4칸으로 맞춤(기본값은 2칸)
      indentUnit.of('    '),
      LANGUAGES[course](),
      syntaxHighlighting(cobaltHighlight),
      cobaltTheme,
      // 오타 검사 결과가 있는 줄 번호 옆에 빨간 점을 찍음. 점이나 밑줄에 마우스를 올리면 컴파일러 문구가 뜸
      lintGutter(),
      EditorView.contentAttributes.of({ 'aria-label': label }),
      EditorView.updateListener.of((update) => {
        if (!update.docChanged) return;
        if (update.transactions.some((tr) => tr.annotation(fromOutside))) return;
        onChange(update.state.doc.toString());
      }),
    ],
  });
}

// 컴파일러가 알려 준 줄, 칸을 편집기 글 위치로 바꿈. 그 칸에서 시작하는 이름, 숫자, 문자열 전체에 밑줄을 긋고,
// 칸이 이름 바로 뒤의 기호를 가리키면(예: "Sytem." 의 점) 앞 이름에, 그 밖의 기호면 한 글자, 줄 끝이면 앞 글자에 그음.
// 글이 바뀌어 없는 줄이면 null
export function diagnosticRange(
  doc: Text,
  d: Pick<CodeDiagnostic, 'line' | 'column'>,
): { from: number; to: number } | null {
  if (d.line < 1 || d.line > doc.lines) return null;
  const line = doc.line(d.line);
  const from = line.from + Math.min(Math.max(d.column, 0), line.length);
  const at = from - line.from;
  const word = /^\w+/.exec(line.text.slice(at))?.[0].length ?? 0;
  if (word > 0) return { from, to: from + word };
  // 따옴표에서 시작하면 같은 줄의 닫는 따옴표까지 문자열 전체
  const quoted =
    /^("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/.exec(line.text.slice(at))?.[0].length ?? 0;
  if (quoted > 0) return { from, to: from + quoted };
  const before = /\w+$/.exec(line.text.slice(0, at))?.[0].length ?? 0;
  if (before > 0 && at < line.length) return { from: from - before, to: from };
  if (from < line.to) return { from, to: from + 1 };
  return line.length > 0 ? { from: from - 1, to: from } : { from, to: from };
}

// 오타 검사 결과를 밑줄과 줄 번호 옆 표시로 보여 줌. 결과가 지금 글로 검사한 것일 때만 바꿔 그림
export function showDiagnostics(view: EditorView, check: CodeCheck) {
  if (view.state.doc.toString() !== check.source) return;
  const list: Diagnostic[] = [];
  for (const d of check.diagnostics) {
    const range = diagnosticRange(view.state.doc, d);
    if (range) list.push({ ...range, severity: d.severity, message: d.message });
  }
  view.dispatch(setDiagnostics(view.state, list));
}

// 바깥에서 값이 바뀌었을 때(원래대로 누름 등) 편집기 글을 통째로 바꿈. 같으면 아무것도 안 함
export function replaceDoc(view: EditorView, value: string) {
  const current = view.state.doc.toString();
  if (current === value) return;
  view.dispatch({
    changes: { from: 0, to: current.length, insert: value },
    annotations: fromOutside.of(true),
  });
}
