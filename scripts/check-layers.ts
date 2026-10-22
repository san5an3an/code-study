// 화면 부품 층 사이 import 방향 검사. 아래 층이 위 층이나 데이터 쪽을 가져다 쓰면 실패
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const COMPONENT_LAYERS = ['atoms', 'molecules', 'organisms', 'templates', 'pages'] as const;

export type Layer =
  | (typeof COMPONENT_LAYERS)[number]
  | 'domain'
  | 'services'
  | 'config'
  | 'core'
  | 'root';

// 층마다 가져다 쓸 수 있는 층. 부품 층은 자기와 아래 층만, 데이터 연결은 pages만
const ALLOWED: Record<Layer, readonly Layer[]> = {
  atoms: ['atoms', 'domain', 'core'],
  molecules: ['atoms', 'molecules', 'domain', 'core'],
  organisms: ['atoms', 'molecules', 'organisms', 'domain', 'core'],
  templates: ['atoms', 'molecules', 'organisms', 'templates', 'domain', 'core'],
  pages: [...COMPONENT_LAYERS, 'domain', 'core', 'services', 'config'],
  domain: ['domain', 'core'],
  core: ['core'],
  config: ['config', 'domain', 'core'],
  services: ['services', 'domain', 'core', 'config'],
  root: ['pages', 'domain', 'core', 'services', 'config', 'root'],
};

// src/app 기준 경로로 층을 정함. 모르는 폴더는 null
export function layerOf(relPath: string): Layer | null {
  const parts = relPath.split(/[\\/]/);
  if (parts.length === 1) return 'root';
  if (parts[0] === 'components') {
    const layer = COMPONENT_LAYERS.find((l) => l === parts[1]);
    return layer ?? null;
  }
  const top = parts[0];
  if (top === 'domain' || top === 'services' || top === 'config' || top === 'core') return top;
  return null;
}

const IMPORT_RE = /(?:import|export)\s[^'"]*?from\s*['"]([^'"]+)['"]|import\(\s*['"]([^'"]+)['"]\s*\)/g;

export function importsOf(source: string): string[] {
  return [...source.matchAll(IMPORT_RE)].map((m) => m[1] ?? m[2]);
}

export type Violation = { file: string; target: string; reason: string };

// files: src/app 기준 경로 → 소스
export function findViolations(files: Map<string, string>): Violation[] {
  const violations: Violation[] = [];
  for (const [file, source] of files) {
    const from = layerOf(file);
    if (from === null) {
      violations.push({ file, target: '', reason: '정해진 층 폴더 밖에 있음' });
      continue;
    }
    for (const spec of importsOf(source)) {
      if (!spec.startsWith('.')) continue;
      const target = path.posix.normalize(path.posix.join(path.posix.dirname(file), spec));
      if (target.startsWith('..')) continue;
      const to = layerOf(target);
      if (to === null || !ALLOWED[from].includes(to)) {
        violations.push({ file, target: spec, reason: `${from} 층은 ${to ?? '알 수 없는'} 층을 쓸 수 없음` });
      }
    }
  }
  return violations;
}

export function readAppFiles(appDir: string): Map<string, string> {
  const files = new Map<string, string>();
  for (const entry of readdirSync(appDir, { recursive: true, withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.ts')) continue;
    const full = path.join(entry.parentPath, entry.name);
    files.set(path.relative(appDir, full).split(path.sep).join('/'), readFileSync(full, 'utf8'));
  }
  return files;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const appDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'app');
  const violations = findViolations(readAppFiles(appDir));
  for (const v of violations) console.error(`${v.file}: ${v.target} (${v.reason})`);
  if (violations.length > 0) process.exit(1);
  console.log('층 방향 문제 없음');
}
