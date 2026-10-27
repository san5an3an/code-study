import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  changedPixelCount,
  frameFileName,
  lostPixelCount,
  mergeSpans,
  slotTimes,
} from './frame-capture.ts';

// 화소 3개짜리 색 사진. 화소마다 [R, G, B]
const shot = (...px: [number, number, number][]) => Uint8Array.from(px.flat());
const W: [number, number, number] = [255, 255, 255];
const R: [number, number, number] = [220, 30, 30];
const K: [number, number, number] = [0, 0, 0];
// 기준을 작게 둬서 화소 하나만 바뀌어도 화면이 바뀐 것으로 봄
const merge = (frames: Uint8Array[]) => mergeSpans(frames, 32, 0);

test('찍은 시각을 sync 가 읽는 파일 이름으로 바꾸고, 한 시간이 넘어도 분으로 셈', () => {
  assert.equal(frameFileName(0), 't00m00s.jpg');
  assert.equal(frameFileName(65), 't01m05s.jpg');
  assert.equal(frameFileName(3725), 't62m05s.jpg');
});

test('0초부터 5초 간격으로 찍고, 영상 길이와 같은 시각은 뺌', () => {
  assert.deepEqual(slotTimes(15), [0, 5, 10]);
  assert.deepEqual(slotTimes(15.2), [0, 5, 10, 15]);
  assert.deepEqual(slotTimes(0), []);
});

test('바뀐 화소는 R, G, B 중 가장 큰 차이로 세서 밝기가 비슷한 색 펜도 잡고, 크기가 다르면 멈춤', () => {
  // 회색 (200,200,200) 위 (240,180,180) 은 밝기 평균은 거의 같지만 빨강이 40 차이 남
  assert.equal(changedPixelCount(shot([200, 200, 200], W), shot([240, 180, 180], W)), 1);
  assert.equal(changedPixelCount(shot([200, 200, 200]), shot([220, 210, 200])), 0);
  assert.throws(() => changedPixelCount(shot(W), shot(W, W)), /사진 크기가 다름/);
});

test('더 쓰기만 하면 사라지는 화소가 없고, 지우거나 넘기면 아직 안 남긴 화소가 사라짐', () => {
  const kept = shot(W, W, W);
  const one = shot(R, W, W);
  assert.equal(lostPixelCount(kept, one, shot(R, R, W)), 0);
  assert.equal(lostPixelCount(kept, one, shot(W, W, W)), 1);
  assert.equal(lostPixelCount(kept, one, shot(K, K, K)), 1);
});

test('새 슬라이드에 필기가 쌓이다 넘어가면 필기 전 첫 화면과 넘어가기 직전 꽉 찬 화면을 남기고, 꽉 찬 화면 시각은 첫 필기부터임', () => {
  const frames = [shot(K, K, K), shot(W, W, W), shot(R, W, W), shot(R, R, W), shot(K, W, K)];
  assert.deepEqual(merge(frames), [
    { image: 0, start: 0 },
    { image: 1, start: 1 },
    { image: 3, start: 2 },
    { image: 4, start: 4 },
  ]);
});

test('같은 화면이 이어지면 한 장으로 합치고, 앞 장과 같은 장 뒤에 나온 새 화면은 시각이 앞당겨지지 않음', () => {
  const a = shot(W, W, W);
  const b = shot(K, K, K);
  assert.deepEqual(merge([a, a, a, b, b]), [
    { image: 0, start: 0 },
    { image: 4, start: 3 },
  ]);
});

test('썼다가 지우면 지우기 직전 장을 남기고, 지운 뒤 화면도 남김', () => {
  const a = shot(W, W, W);
  assert.deepEqual(merge([a, a, shot(R, R, W), a]), [
    { image: 0, start: 0 },
    { image: 2, start: 2 },
    { image: 3, start: 3 },
  ]);
});

test('바뀐 화소가 기준 이하이면 마우스처럼 보고 합침', () => {
  const pointer = (i: number) => shot(...[W, W, W].map((p, j) => (j === i ? K : p)));
  assert.deepEqual(mergeSpans([shot(W, W, W), pointer(0), pointer(1), pointer(2)], 32, 1), [
    { image: 0, start: 0 },
  ]);
});

test('사진이 없으면 남길 것도 없고, 한 장이면 그 장만 남김', () => {
  assert.deepEqual(merge([]), []);
  assert.deepEqual(merge([shot(W)]), [{ image: 0, start: 0 }]);
});
