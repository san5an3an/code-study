// sync 가 javac, java 를 돌릴 때 쓰는 함수. 출력이 너무 길면 잘라서 돌려줌
import { spawnSync } from 'node:child_process';

import type { CodeRun } from '../src/app/core/run-api.ts';

export const COMPILE_TIMEOUT_MS = 10_000;
export const RUN_TIMEOUT_MS = 5_000;
const OUTPUT_LIMIT = 64 * 1024;

function clip(text: string) {
  return text.length > OUTPUT_LIMIT
    ? text.slice(0, OUTPUT_LIMIT) + '\n…(출력이 64KB를 넘어 잘림)'
    : text;
}

export function run(cmd: string, args: string[], cwd: string, timeout: number): CodeRun {
  const r = spawnSync(cmd, args, {
    cwd,
    // 터미널이 FORCE_COLOR 를 물려주면 파이썬 에러에 색 코드가 섞여 저장됨. 실행 서버와 같이 NO_COLOR 를 줌(ADR-061)
    env: { ...process.env, NO_COLOR: '1' },
    timeout,
    encoding: 'utf8',
    input: '',
    maxBuffer: OUTPUT_LIMIT * 4,
  });
  return {
    stdout: clip(r.stdout ?? ''),
    stderr: clip(r.stderr ?? ''),
    exitCode: r.status,
    timedOut: (r.error as NodeJS.ErrnoException | undefined)?.code === 'ETIMEDOUT',
  };
}
