import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';

import { pickTokens, readTokenSources, USED, usedTokens, VARS } from './cobalt-tokens.ts';

const CSS = `/* 원본 제목 */

:root {
  /* bg */
  --a-bg   : #fff;
  --a-line : var(--b-gray);
  /* fg */
  --a-fg   : #000;
  --b-gray : #888;
}

:root[data-theme="dark"] {
  --a-bg : #111;
  --a-fg : #eee;
}
`;

test('소스에 이름이 나오는 토큰과 그 토큰 값이 var() 로 부르는 토큰을 씀', () => {
  assert.deepEqual([...usedTokens(CSS, ['color: var(--a-line);'])].sort(), [
    '--a-line',
    '--b-gray',
  ]);
  assert.deepEqual([...usedTokens(CSS, ['--a-bg-extra'])], []);
});

test('쓰는 토큰만 남기고 블록 모양은 그대로, 선언이 다 빠진 소제목 주석은 뺌', () => {
  const out = pickTokens(CSS, ['var(--a-fg)']);
  assert.match(out, /^\/\* npm run tokens 로/);
  assert.doesNotMatch(out, /원본 제목|--a-bg|--a-line|--b-gray|\/\* bg \*\//);
  assert.match(out, /:root \{\n {2}\/\* fg \*\/\n {2}--a-fg {3}: #000;\n\}/);
  assert.match(out, /:root\[data-theme="dark"\] \{\n {2}--a-fg : #eee;\n\}/);
});

test('저장소의 vars.used.css 가 지금 코드로 다시 뽑은 것과 같음. 다르면 npm run tokens 를 돌림', () => {
  const app = path.resolve(import.meta.dirname, '..');
  const css = readFileSync(path.join(app, VARS), 'utf8');
  const expected = pickTokens(css, readTokenSources(app));
  assert.equal(readFileSync(path.join(app, USED), 'utf8'), expected);
});
