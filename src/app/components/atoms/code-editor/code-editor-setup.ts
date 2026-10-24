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
import { Annotation } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { tags } from '@lezer/highlight';
import { basicSetup } from 'codemirror';

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
  // basicSetup 이 넣는 접기 칸과 현재 줄 강조는 원래 앱처럼 안 보이게 함
  '.cm-foldGutter': { display: 'none' },
  '.cm-activeLine, .cm-activeLineGutter': { backgroundColor: 'transparent' },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection': {
    backgroundColor: 'color-mix(in oklch, var(--semantic-fg-brand-default) 25%, transparent)',
  },
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
      EditorView.contentAttributes.of({ 'aria-label': label }),
      EditorView.updateListener.of((update) => {
        if (!update.docChanged) return;
        if (update.transactions.some((tr) => tr.annotation(fromOutside))) return;
        onChange(update.state.doc.toString());
      }),
    ],
  });
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
