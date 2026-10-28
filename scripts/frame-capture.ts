// 강의 영상 화면 캡처 합치기. 일정 간격으로 찍은 작은 사진을 견줘 같은 화면이 이어지는 구간을 한 장으로 합침
// 필기와 코드는 화면이 바뀌기 직전에 가장 꽉 차므로 구간 끝 화면을 남기고, 시각은 그 화면이 처음 나온 구간 시작으로 붙임

export const STEP_SECONDS = 5;
// 견줄 때 쓰는 작은 사진 크기. 빨간 펜은 흑백으로 바꾸면 거의 안 보여서 색을 그대로 둠(RGB 3바이트)
export const SMALL_WIDTH = 320;
export const SMALL_HEIGHT = 180;
export const SMALL_BYTES = SMALL_WIDTH * SMALL_HEIGHT * 3;
// R, G, B 차이 중 가장 큰 값이 이보다 크면 바뀐 화소로 봄. 정지 화면끼리는 0~6화소만 넘음(파이썬 08·17강, 자바 03강)
export const PIXEL_THRESHOLD = 32;
// 바뀐 화소가 이보다 많아야 화면이 바뀐 것으로 봄(320×180 의 0.17%). 마우스와 글자 커서가 움직이면 20~40화소
export const LOST_PIXELS = 100;

// 찍은 시각을 sync 가 읽는 파일 이름으로 바꿈. 한 시간이 넘어도 분으로 셈(62분 5초면 t62m05s.jpg)
export function frameFileName(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `t${String(m).padStart(2, '0')}m${String(s).padStart(2, '0')}s.jpg`;
}

// 0초부터 step 간격으로 찍을 시각. 영상 길이와 같은 시각은 사진이 안 나와서 뺌
export function slotTimes(durationSeconds: number, step = STEP_SECONDS) {
  const times: number[] = [];
  for (let t = 0; t < durationSeconds; t += step) times.push(t);
  return times;
}

function sameSize(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) throw new Error(`사진 크기가 다름: ${a.length}, ${b.length}`);
}

function changed(a: Uint8Array, b: Uint8Array, i: number, threshold: number) {
  return (
    Math.max(Math.abs(a[i] - b[i]), Math.abs(a[i + 1] - b[i + 1]), Math.abs(a[i + 2] - b[i + 2])) >
    threshold
  );
}

// 두 장 사이에 바뀐 화소 수
export function changedPixelCount(a: Uint8Array, b: Uint8Array, threshold = PIXEL_THRESHOLD) {
  sameSize(a, b);
  let n = 0;
  for (let i = 0; i < a.length; i += 3) if (changed(a, b, i, threshold)) n++;
  return n;
}

// 직전 장에서 마지막으로 남긴 장과 달라진 화소(아직 안 남긴 내용) 중 지금 장에서 또 바뀐 화소 수. 지우거나 넘기면 커지고, 더 쓰기만 하면 0 에 가까움
export function lostPixelCount(
  kept: Uint8Array,
  prev: Uint8Array,
  cur: Uint8Array,
  threshold = PIXEL_THRESHOLD,
) {
  sameSize(kept, prev);
  sameSize(prev, cur);
  let n = 0;
  for (let i = 0; i < prev.length; i += 3) {
    if (changed(prev, kept, i, threshold) && changed(prev, cur, i, threshold)) n++;
  }
  return n;
}

// image 는 구간을 대표하는 끝 장 번호, start 는 그 구간이 시작한 장 번호
export type FrameSpan = { image: number; start: number };

// 아직 안 남긴 내용이 지워지거나 바뀌기 직전 장을 구간 끝으로 남김. 마지막 장은 남긴 장과 다를 때만 남김
// 구간 시작은 앞에서 남긴 장과 처음으로 달라진 장. 앞 장과 같은 장이 이어진 뒤에 새 화면이 나와도 새 화면 시각이 앞당겨지지 않음
export function mergeSpans(
  frames: readonly Uint8Array[],
  threshold = PIXEL_THRESHOLD,
  lost = LOST_PIXELS,
): FrameSpan[] {
  if (frames.length === 0) return [];
  const ends = [0];
  const last = () => ends[ends.length - 1];
  for (let j = 2; j < frames.length; j++) {
    const prev = j - 1;
    if (prev === last()) continue;
    if (lostPixelCount(frames[last()], frames[prev], frames[j], threshold) > lost) ends.push(prev);
  }
  const end = frames.length - 1;
  if (end !== last() && changedPixelCount(frames[end], frames[last()], threshold) > lost) {
    ends.push(end);
  }
  return ends.map((image, n) => {
    if (n === 0) return { image, start: 0 };
    const before = frames[ends[n - 1]];
    let start = ends[n - 1] + 1;
    while (start < image && changedPixelCount(frames[start], before, threshold) <= lost) start++;
    return { image, start };
  });
}
