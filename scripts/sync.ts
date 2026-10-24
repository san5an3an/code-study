// npm run sync: ~/Downloads/Java-notes 의 노트, 퀴즈, 예제 코드, 받아쓰기를 public/content/java 로 가져옴
// 원본 폴더는 읽기만 함. 화면 캡처 사진은 public/frames/java 에 미리 복사해 두고 목록만 만듦
import { spawnSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import path from 'node:path';

import type { CodeFile, CodeRun } from '../src/app/core/run-api.ts';
import type {
  Frame,
  LectureContentSummary,
  Quiz,
  TranscriptLine,
} from '../src/app/domain/lecture-content.ts';
import { JAVA_COURSE } from '../src/app/domain/lectures-java.ts';
import { parseQuiz } from './quiz-parser.ts';

const SOURCE = process.env['JAVA_NOTES'] ?? path.join(homedir(), 'Downloads/Java-notes');
const APP = path.resolve(import.meta.dirname, '..');
const OUT = path.join(APP, 'public/content/java');
const FRAMES = path.join(APP, 'public/frames/java');

const COMPILE_TIMEOUT_MS = 10_000;
const RUN_TIMEOUT_MS = 5_000;
const OUTPUT_LIMIT = 64 * 1024;

function writeJson(file: string, data: unknown) {
  writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
}

// "03. 변수와 상수.txt", "20.예외처리" 처럼 이름 앞 번호로 강의 파일을 찾음
function findByNumber(dir: string, id: string) {
  return readdirSync(dir).find((name) => name.match(/^(\d+)\./)?.[1].padStart(2, '0') === id);
}

function toSeconds(mm: string, ss: string, hh?: string) {
  return Number(hh ?? 0) * 3600 + Number(mm) * 60 + Number(ss);
}

function clip(text: string) {
  return text.length > OUTPUT_LIMIT
    ? text.slice(0, OUTPUT_LIMIT) + '\n…(출력이 64KB를 넘어 잘림)'
    : text;
}

function syncTranscript(id: string): TranscriptLine[] {
  const name = findByNumber(path.join(SOURCE, 'transcripts'), id);
  if (!name) throw new Error(`${id}강: 받아쓰기 파일이 없음`);
  const lines: TranscriptLine[] = [];
  for (const line of readFileSync(path.join(SOURCE, 'transcripts', name), 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\[(?:(\d+):)?(\d+):(\d{2})\]\s*(.*)$/);
    if (m) lines.push({ t: toSeconds(m[2], m[3], m[1]), text: m[4] });
  }
  if (lines.length === 0) throw new Error(`${id}강: 받아쓰기에서 시간 표시 줄을 못 찾음`);
  return lines;
}

function syncFrames(id: string): Frame[] {
  const dir = path.join(FRAMES, id);
  if (!existsSync(dir)) throw new Error(`${id}강: public/frames/java/${id} 가 없음`);
  return readdirSync(dir)
    .map((file) => ({ file, m: file.match(/^t(\d+)m(\d{2})s\.jpg$/) }))
    .filter((x) => x.m)
    .map(({ file, m }) => ({ t: toSeconds(m![1], m![2]), file }))
    .sort((a, b) => a.t - b.t);
}

function run(cmd: string, args: string[], cwd: string, timeout: number): CodeRun {
  const r = spawnSync(cmd, args, {
    cwd,
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

// 같은 강의 폴더의 자바 파일끼리 서로 쓰기도 해서(21강 Mountain) 한꺼번에 컴파일함
function syncCode(id: string, codeDir: string, outDir: string): CodeFile[] {
  const files = readdirSync(codeDir)
    .filter((f) => f.endsWith('.java'))
    .sort();
  mkdirSync(outDir, { recursive: true });
  for (const f of files) cpSync(path.join(codeDir, f), path.join(outDir, f));

  const build = mkdtempSync(path.join(tmpdir(), `code-study-sync-${id}-`));
  try {
    const javac = run(
      'javac',
      ['-encoding', 'UTF-8', '-d', build, ...files.map((f) => path.join(codeDir, f))],
      codeDir,
      COMPILE_TIMEOUT_MS,
    );
    if (javac.exitCode !== 0) throw new Error(`${id}강: 컴파일 실패\n${javac.stderr}`);

    return files.map((file) => {
      const source = readFileSync(path.join(codeDir, file), 'utf8');
      const className = file.replace(/\.java$/, '');
      const hasMain = /public\s+static\s+void\s+main\s*\(/.test(source);
      // 주석 속 "Scanner" 는 빼고 봄. 06강 SwitchChar, 16강 AgeProject 는 주석에만 있음
      const code = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
      const needsInput = /\bScanner\b|System\.in\b/.test(code);
      const result =
        hasMain && !needsInput
          ? run(
              'java',
              [
                '-Dfile.encoding=UTF-8',
                '-Dstdout.encoding=UTF-8',
                '-Dstderr.encoding=UTF-8',
                '-cp',
                build,
                className,
              ],
              build,
              RUN_TIMEOUT_MS,
            )
          : null;
      return { file, className, hasMain, needsInput, run: result };
    });
  } finally {
    rmSync(build, { recursive: true, force: true });
  }
}

function main() {
  if (!existsSync(path.join(SOURCE, 'lectures'))) {
    throw new Error(`원본 폴더가 없음: ${SOURCE}/lectures`);
  }
  // 다른 과목 자료는 두고 자바 폴더만 새로 만듦
  rmSync(OUT, { recursive: true, force: true });
  mkdirSync(OUT, { recursive: true });

  const summary: LectureContentSummary[] = [];
  for (const lecture of JAVA_COURSE.lectures) {
    const src = path.join(SOURCE, 'lectures', lecture.folder);
    const out = path.join(OUT, lecture.id);
    if (!existsSync(src)) throw new Error(`${lecture.id}강: 원본 폴더가 없음 ${src}`);
    mkdirSync(out, { recursive: true });

    cpSync(path.join(src, '노트.md'), path.join(out, 'note.md'));

    const quiz: Quiz = {
      lectureId: lecture.id,
      questions: parseQuiz(readFileSync(path.join(src, '퀴즈.md'), 'utf8'), lecture.id),
    };
    writeJson(path.join(out, 'quiz.json'), quiz);

    const code = syncCode(lecture.id, path.join(src, 'code'), path.join(out, 'code'));
    writeJson(path.join(out, 'code.json'), code);

    const transcript = syncTranscript(lecture.id);
    writeJson(path.join(out, 'transcript.json'), transcript);

    const frames = syncFrames(lecture.id);
    writeJson(path.join(out, 'frames.json'), frames);

    summary.push({
      id: lecture.id,
      questions: quiz.questions.length,
      codeFiles: code.length,
      transcriptLines: transcript.length,
      frames: frames.length,
    });
    const failed = code.filter((c) => c.run && c.run.exitCode !== 0).map((c) => c.className);
    console.log(
      `${lecture.id}강  퀴즈 ${quiz.questions.length}  코드 ${code.length}` +
        (failed.length ? ` (실패 ${failed.join(', ')})` : '') +
        `  받아쓰기 ${transcript.length}줄  캡처 ${frames.length}장`,
    );
  }
  writeJson(path.join(OUT, 'index.json'), summary);
  const total = (k: keyof Omit<LectureContentSummary, 'id'>) =>
    summary.reduce((s, x) => s + x[k], 0);
  console.log(
    `합계  퀴즈 ${total('questions')}  코드 ${total('codeFiles')}  ` +
      `받아쓰기 ${total('transcriptLines')}줄  캡처 ${total('frames')}장`,
  );
}

main();
