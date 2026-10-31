// 퀴즈 코드 문제의 예시 답안을 돌려 채점에 쓸 기대 출력을 구함
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { javaSnippetFile } from '../server/java-snippet.ts';
import { PYTHON_ARGS } from '../server/python-runner.ts';
import type { CourseId } from '../src/app/domain/course.ts';
import { COMPILE_TIMEOUT_MS, run, RUN_TIMEOUT_MS } from './run-command.ts';

// 예시 답안의 그 언어 코드 블록을 순서대로 이어 붙임. 07강 12번처럼 한 문제에 답이 둘이면 둘 다 돌려야 해서 이어 붙임
export function answerSource(explanation: string, language: CourseId): string | null {
  const fence = new RegExp('```' + language + '\\n([\\s\\S]*?)```', 'g');
  const blocks = [...explanation.matchAll(fence)].map((m) => m[1]);
  return blocks.length > 0 ? blocks.join('\n') : null;
}

export function javaAnswerSource(explanation: string): string | null {
  return answerSource(explanation, 'java');
}

// 두 번 돌려 출력이 같을 때만 기대 출력으로 씀. 컴파일 실패, 실행 에러, 시간 초과, 돌릴 때마다 다른 출력이면 null
// 답안이 파일을 만들기도 해서(22강 11번 score.txt) 임시 폴더 안에서 돌림
export function expectedJavaOutput(source: string, runTimeoutMs = RUN_TIMEOUT_MS): string | null {
  const snippet = javaSnippetFile(source);
  const work = mkdtempSync(path.join(tmpdir(), 'code-study-expected-'));
  try {
    writeFileSync(path.join(work, snippet.file), snippet.code);
    const out = path.join(work, 'out');
    const javac = run(
      'javac',
      ['-encoding', 'UTF-8', '-d', out, snippet.file],
      work,
      COMPILE_TIMEOUT_MS,
    );
    if (javac.exitCode !== 0) return null;

    const className = snippet.mainClass;
    const once = () =>
      run(
        'java',
        ['-Dfile.encoding=UTF-8', '-Dstdout.encoding=UTF-8', '-cp', out, className],
        work,
        runTimeoutMs,
      );
    const first = once();
    if (first.exitCode !== 0 || first.timedOut) return null;
    const second = once();
    return second.exitCode === 0 && second.stdout === first.stdout ? first.stdout : null;
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
}

// 파이썬 답안을 돌리는 횟수. 문자열 집합 순서는 실행마다 바뀌어서(해시 무작위) 두 번은 우연히 같을 수 있음(ADR-061)
export const PYTHON_EXPECTED_RUNS = 5;

// 파이썬 답안은 실행 서버와 같은 옵션으로, 돌릴 때마다 새 임시 폴더에서 runs 번 돌려 출력이 모두 같을 때만 기대 출력으로 씀
// 폴더를 바꾸는 건 작업 폴더 경로를 찍는 답안을 거르려고. 에러, 시간 초과, 돌릴 때마다 다른 출력이면 null
export function expectedPythonOutput(
  source: string,
  runTimeoutMs = RUN_TIMEOUT_MS,
  runs = PYTHON_EXPECTED_RUNS,
): string | null {
  let expected: string | null = null;
  for (let i = 0; i < runs; i++) {
    const work = mkdtempSync(path.join(tmpdir(), 'code-study-expected-py-'));
    try {
      writeFileSync(path.join(work, 'main.py'), source);
      const r = run('python3', [...PYTHON_ARGS, 'main.py'], work, runTimeoutMs);
      if (r.exitCode !== 0 || r.timedOut) return null;
      if (expected !== null && r.stdout !== expected) return null;
      expected = r.stdout;
    } finally {
      rmSync(work, { recursive: true, force: true });
    }
  }
  return expected;
}
