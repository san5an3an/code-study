// npm run capture -- <과목> <강의 번호...|--all>: 강의 영상에서 5초마다 화면을 찍고 같은 화면이 이어지는 구간을 한 장으로 합쳐
// public/frames/<과목>/NN 에 씀. 영상 폴더는 읽기만 함. 다시 돌리면 그 강의 사진을 새로 찍어 바꿈
import { spawnSync, type SpawnSyncReturns } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, renameSync, rmSync } from 'node:fs';
import { homedir } from 'node:os';
import path from 'node:path';

import type { Course } from '../src/app/domain/course.ts';
import { JAVA_COURSE } from '../src/app/domain/lectures-java.ts';
import { PYTHON_COURSE } from '../src/app/domain/lectures-python.ts';
import {
  frameFileName,
  mergeSpans,
  slotTimes,
  SMALL_BYTES,
  SMALL_HEIGHT,
  SMALL_WIDTH,
  STEP_SECONDS,
} from './frame-capture.ts';

const APP = path.resolve(import.meta.dirname, '..');
const SOURCES: Record<string, { course: Course; videos: string }> = {
  java: {
    course: JAVA_COURSE,
    videos: process.env['JAVA_VIDEOS'] ?? path.join(homedir(), 'Downloads/Java'),
  },
  python: {
    course: PYTHON_COURSE,
    videos: process.env['PYTHON_VIDEOS'] ?? path.join(homedir(), 'Downloads/Python'),
  },
};
// 시험 삼아 찍을 때는 다른 폴더로 돌림
const OUT_ROOT = process.env['FRAMES_OUT'] ?? path.join(APP, 'public/frames');

// Ctrl+C 를 누르면 node 가 바로 죽지 않고, 함께 멈춘 ffmpeg 결과를 보고 임시 폴더를 지운 뒤 끝냄
process.on('SIGINT', () => {});

function checked(cmd: string, r: SpawnSyncReturns<Buffer>) {
  if ((r.error as NodeJS.ErrnoException | undefined)?.code === 'ENOENT') {
    throw new Error(`${cmd} 가 없음. brew install ffmpeg 로 깔아 주세요`);
  }
  if (r.signal) throw new Error(`${cmd} 가 멈춤(${r.signal})`);
  return r;
}

// "03. 변수와 상수.mp4" 처럼 이름 앞 번호로 영상을 찾음
function findVideo(dir: string, id: string) {
  const name = readdirSync(dir).find(
    (f) => f.endsWith('.mp4') && f.match(/^(\d+)\./)?.[1].padStart(2, '0') === id,
  );
  if (!name) throw new Error(`${id}강: ${dir} 에 영상이 없음`);
  return path.join(dir, name);
}

// 소리가 영상보다 길면 파일 길이 끝쪽 칸에 화면이 없어서 영상 줄기 길이를 먼저 씀
function durationOf(video: string) {
  for (const entry of ['stream=duration', 'format=duration']) {
    const r = checked(
      'ffprobe',
      spawnSync('ffprobe', [
        '-v',
        'error',
        '-select_streams',
        'v:0',
        '-show_entries',
        entry,
        '-of',
        'csv=p=0',
        video,
      ]),
    );
    const seconds = Number(String(r.stdout).trim());
    if (r.status === 0 && Number.isFinite(seconds) && seconds > 0) return seconds;
  }
  throw new Error(`영상 길이를 못 읽음: ${video}`);
}

// 그 시각 화면 하나를 1280×720 jpg 로 쓰고, 견줄 작은 색 사진을 돌려줌. 영상 끝을 넘어 화면이 없으면 null
function grab(video: string, t: number, jpg: string) {
  const r = checked(
    'ffmpeg',
    spawnSync(
      'ffmpeg',
      [
        '-v',
        'error',
        '-y',
        '-ss',
        String(t),
        '-i',
        video,
        '-filter_complex',
        `[0:v]split=2[big][small];[big]scale=1280:720[b];[small]scale=${SMALL_WIDTH}:${SMALL_HEIGHT}:flags=area,format=rgb24[s]`,
        '-map',
        '[b]',
        '-frames:v',
        '1',
        '-update',
        '1',
        '-q:v',
        '3',
        jpg,
        '-map',
        '[s]',
        '-frames:v',
        '1',
        '-f',
        'rawvideo',
        '-',
      ],
      { maxBuffer: SMALL_BYTES * 2 },
    ),
  );
  if (r.stdout.length === SMALL_BYTES && existsSync(jpg)) return new Uint8Array(r.stdout);
  // ffmpeg 는 Ctrl+C 를 받으면 스스로 정리하고 255 로 끝냄
  if (r.status === 255) throw new Error('ffmpeg 가 멈춤(Ctrl+C)');
  // 화면이 없으면 아무것도 안 씀. 이때 ffmpeg 9 는 출력이 둘이면 234 로 끝나기도 해서 끝 값은 안 봄
  if (r.stdout.length === 0) return null;
  throw new Error(`${t}초 화면을 못 찍음: ${video}\n${String(r.stderr)}`);
}

function captureLecture(courseId: string, id: string, videosDir: string) {
  const started = Date.now();
  const video = findVideo(videosDir, id);
  const outDir = path.join(OUT_ROOT, courseId, id);
  const courseDir = path.dirname(outDir);
  mkdirSync(courseDir, { recursive: true });
  // 앞에서 Ctrl+C 등으로 못 지운 임시 폴더가 있으면 지움. public 안이라 빌드에 실림
  for (const f of readdirSync(courseDir)) {
    if (f.startsWith(`.capture-${id}-`))
      rmSync(path.join(courseDir, f), { recursive: true, force: true });
  }
  // 다 찍은 뒤에 바꿔 넣으려고 같은 디스크의 임시 폴더에 먼저 씀
  const work = mkdtempSync(path.join(courseDir, `.capture-${id}-`));
  try {
    const duration = durationOf(video);
    const shots: { t: number; file: string; small: Uint8Array }[] = [];
    for (const t of slotTimes(duration)) {
      const file = frameFileName(t);
      const small = grab(video, t, path.join(work, file));
      if (small) {
        shots.push({ t, file, small });
        continue;
      }
      // 끝 칸에서만 화면이 없을 수 있음. 중간에서 없으면 영상이 깨진 것
      if (t + STEP_SECONDS < duration) throw new Error(`${id}강: ${t}초에 화면이 없음`);
      break;
    }
    if (shots.length === 0) throw new Error(`${id}강: 찍힌 화면이 없음`);
    const spans = mergeSpans(shots.map((s) => s.small));

    // 사진은 구간 끝 화면, 이름은 그 화면이 처음 나온 구간 시작 시각
    const next = path.join(work, 'kept');
    mkdirSync(next);
    for (const { image, start } of spans) {
      renameSync(
        path.join(work, shots[image].file),
        path.join(next, frameFileName(shots[start].t)),
      );
    }
    rmSync(outDir, { recursive: true, force: true });
    renameSync(next, outDir);
    const seconds = ((Date.now() - started) / 1000).toFixed(1);
    console.log(`${id}강  찍음 ${shots.length}장  남김 ${spans.length}장  (${seconds}초)`);
    return spans.length;
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
}

function main() {
  const [courseId = '', ...args] = process.argv.slice(2);
  const source = SOURCES[courseId];
  if (!source) {
    throw new Error(
      `과목을 적어 주세요: ${Object.keys(SOURCES).join(', ')} (예: npm run capture -- python 08)`,
    );
  }
  if (!existsSync(source.videos)) {
    throw new Error(
      `영상 폴더가 없음: ${source.videos} (${courseId.toUpperCase()}_VIDEOS 로 바꿀 수 있음)`,
    );
  }
  const known = source.course.lectures.map((l) => l.id);
  const all = args.includes('--all');
  const ids = [...new Set(args.filter((a) => a !== '--all'))];
  // 한 낱말만 빠뜨려도 과목 사진을 통째로 다시 찍지 않도록 전부 찍을 때는 --all 을 적게 함
  if (!all && ids.length === 0) {
    throw new Error(
      `강의 번호를 적거나 전부 찍으려면 --all 을 붙여 주세요 (예: npm run capture -- ${courseId} 08)`,
    );
  }
  const unknown = ids.filter((id) => !known.includes(id));
  if (unknown.length) throw new Error(`없는 강의 번호: ${unknown.join(', ')}`);

  let total = 0;
  for (const id of all ? known : ids) total += captureLecture(courseId, id, source.videos);
  console.log(`합계  남김 ${total}장  → ${path.join(OUT_ROOT, courseId)}`);
  console.log('강의 자료 목록(frames.json)은 npm run sync 를 돌려야 새 사진에 맞춰짐');
}

main();
