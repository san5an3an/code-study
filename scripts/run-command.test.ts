import assert from 'node:assert/strict';
import { tmpdir } from 'node:os';
import { test } from 'node:test';

import { run } from './run-command.ts';

test('터미널에 FORCE_COLOR 가 있어도 파이썬 에러에 색 코드가 안 섞임', () => {
  const before = process.env['FORCE_COLOR'];
  process.env['FORCE_COLOR'] = '1';
  try {
    const r = run('python3', ['-X', 'utf8', '-B', '-I', '-c', 'print(nope)'], tmpdir(), 5000);
    assert.equal(r.exitCode, 1);
    assert.match(r.stderr, /NameError/);
    assert.doesNotMatch(r.stderr, /\x1b\[/);
  } finally {
    if (before === undefined) delete process.env['FORCE_COLOR'];
    else process.env['FORCE_COLOR'] = before;
  }
});
