// npm run tokens: Cobalt 토큰 원본에서 앱이 쓰는 것만 뽑아 vars.used.css 로 씀. 원본 vars.css 는 읽기만 함
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { pickTokens, readTokenSources, USED, usedTokens, VARS } from './cobalt-tokens.ts';

const APP = path.resolve(import.meta.dirname, '..');
const css = readFileSync(path.join(APP, VARS), 'utf8');
const sources = readTokenSources(APP);
writeFileSync(path.join(APP, USED), pickTokens(css, sources));
console.log(`토큰 ${usedTokens(css, sources).size}개 → ${USED}`);
