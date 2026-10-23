import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { findViolations, importsOf, layerOf, readAppFiles } from './check-layers.ts';

function check(files: Record<string, string>) {
  return findViolations(new Map(Object.entries(files)));
}

test('파일이 있는 폴더로 어느 층인지 정함', () => {
  assert.equal(layerOf('components/atoms/marquee-text/marquee-text.ts'), 'atoms');
  assert.equal(layerOf('components/pages/course-shell-page/course-shell-page.ts'), 'pages');
  assert.equal(layerOf('services/theme.ts'), 'services');
  assert.equal(layerOf('app.routes.ts'), 'root');
  assert.equal(layerOf('components/widgets/x.ts'), null);
  assert.equal(layerOf('etc/x.ts'), null);
});

test('import 와 동적 import 를 모두 읽음', () => {
  const src = `import { A } from './a';\nimport type { B } from "../b";\nexport { C } from './c';\nconst p = () => import('./d').then((m) => m.D);`;
  assert.deepEqual(importsOf(src), ['./a', '../b', './c', './d']);
});

test('자기보다 작은 컴포넌트 단위를 import 하면 통과(예: molecules 가 atoms 를)', () => {
  assert.deepEqual(
    check({
      'components/molecules/m/m.ts': `import { A } from '../../atoms/a/a';`,
      'components/organisms/o/o.ts': `import { M } from '../../molecules/m/m';\nimport { L } from '../../../domain/lectures';`,
      'components/pages/p/p.ts': `import { S } from '../../../services/theme';\nimport { C } from '../../../config/courses';`,
      'app.routes.ts': `import { P } from './components/pages/p/p';`,
    }),
    [],
  );
});

test('자기보다 큰 컴포넌트 단위를 import 하면 실패(예: atoms 가 molecules 를)', () => {
  const v = check({ 'components/atoms/a/a.ts': `import { M } from '../../molecules/m/m';` });
  assert.equal(v.length, 1);
  assert.match(v[0].reason, /atoms 층은 molecules/);
});

test('pages 가 아닌 층이 services 나 config 를 import 하면 실패', () => {
  const v = check({
    'components/organisms/o/o.ts': `import { S } from '../../../services/progress';`,
    'components/templates/t/t.ts': `import { C } from '../../../config/courses';`,
  });
  assert.equal(v.length, 2);
});

test('domain 은 화면 컴포넌트나 services 를 import 할 수 없음', () => {
  const v = check({
    'domain/lectures.ts': `import { S } from '../services/content';\nimport { A } from '../components/atoms/a/a';`,
  });
  assert.equal(v.length, 2);
});

test('라우트 파일은 pages 컴포넌트만 가리킬 수 있음', () => {
  const v = check({ 'app.routes.ts': `import { T } from './components/templates/t/t';` });
  assert.equal(v.length, 1);
});

test('정해진 층 폴더 밖 파일은 실패', () => {
  const v = check({ 'components/widgets/w.ts': '' });
  assert.equal(v.length, 1);
});

test('패키지 import 는 검사하지 않음', () => {
  assert.deepEqual(check({ 'components/atoms/a/a.ts': `import { Component } from '@angular/core';` }), []);
});

test('지금 src/app 의 모든 파일이 층 사이 import 방향 규칙을 지킴', () => {
  const appDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'app');
  assert.deepEqual(findViolations(readAppFiles(appDir)), []);
});
