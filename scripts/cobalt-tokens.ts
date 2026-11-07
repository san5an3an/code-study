// Cobalt 토큰 원본(vars.css)에서 앱이 쓰는 토큰만 골라 첫 화면 CSS 를 줄임. 원본은 minari 에서 가져온 파일이라 손대지 않음
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

export const VARS = 'src/design-system/cobalt/vars.css';
export const USED = 'src/design-system/cobalt/vars.used.css';
// 앱 밖에서 토큰 이름을 부르는 CSS. Spartan 프리셋이 --background, --sidebar 같은 shadcn 이름을 씀
const EXTERNAL_CSS = ['node_modules/@spartan-ng/brain/hlm-tailwind-preset.css'];
const SOURCE_DIRS = ['src', 'libs'];

const HEADER = `/* npm run tokens 로 vars.css 에서 앱이 쓰는 토큰만 뽑아 만든 파일. 손으로 고치지 말 것
 * 원본은 vars.css(minari 에서 가져온 Cobalt 토큰). 새 토큰을 쓰거나 원본을 다시 가져오면 npm run tokens 를 돌림 */`;

const DECLARATION = /^\s*(--[A-Za-z0-9_-]+)\s*:([^;]*);/;
const NAME = /--[A-Za-z0-9_-]+/g;

// 토큰 이름마다 모든 블록의 값. 값 안의 var() 를 따라가는 데 씀
export function tokenValues(css: string) {
  const values = new Map<string, string[]>();
  for (const line of css.split('\n')) {
    const m = DECLARATION.exec(line);
    if (m) values.set(m[1], [...(values.get(m[1]) ?? []), m[2]]);
  }
  return values;
}

// 소스에 이름이 나오는 토큰과, 그 토큰 값이 var() 로 부르는 토큰
export function usedTokens(css: string, sources: readonly string[]) {
  const values = tokenValues(css);
  const named = new Set(sources.flatMap((s) => s.match(NAME) ?? []));
  const used = new Set([...values.keys()].filter((n) => named.has(n)));
  const queue = [...used];
  while (queue.length) {
    for (const value of values.get(queue.pop()!) ?? []) {
      for (const ref of value.match(NAME) ?? []) {
        if (values.has(ref) && !used.has(ref)) {
          used.add(ref);
          queue.push(ref);
        }
      }
    }
  }
  return used;
}

// 쓰는 토큰 선언만 남기고 블록 모양은 그대로 둠. 블록 안 소제목 주석은 아래 선언이 하나라도 남을 때만 둠
export function pickTokens(css: string, sources: readonly string[]) {
  const used = usedTokens(css, sources);
  const out: string[] = [];
  let depth = 0;
  let pendingComment: string[] = [];
  for (const line of css.split('\n')) {
    const m = DECLARATION.exec(line);
    if (m) {
      if (used.has(m[1])) {
        out.push(...pendingComment, line);
        pendingComment = [];
      }
      continue;
    }
    const trimmed = line.trim();
    if (depth > 0 && trimmed.startsWith('/*') && trimmed.endsWith('*/')) {
      pendingComment = [line];
      continue;
    }
    if (trimmed === '' && depth > 0) continue;
    pendingComment = [];
    depth += (line.match(/\{/g) ?? []).length - (line.match(/\}/g) ?? []).length;
    out.push(line);
  }
  // 원본 첫 줄 제목 주석 대신 만든 파일이라는 머리를 붙임
  const body = out.join('\n').replace(/^\/\*[^\n]*\*\/\n/, '');
  return `${HEADER}\n${body}`;
}

function filesUnder(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? filesUnder(p) : [p];
  });
}

// 앱 소스(테스트 파일과 토큰 파일 빼고)와 바깥 CSS 를 읽음
export function readTokenSources(appDir: string) {
  const skip = new Set([VARS, USED].map((f) => path.join(appDir, f)));
  const app = SOURCE_DIRS.flatMap((d) => filesUnder(path.join(appDir, d))).filter(
    (f) => /\.(ts|html|css)$/.test(f) && !/\.(spec|test)\.ts$/.test(f) && !skip.has(f),
  );
  return [...app, ...EXTERNAL_CSS.map((f) => path.join(appDir, f))].map((f) =>
    readFileSync(f, 'utf8'),
  );
}
