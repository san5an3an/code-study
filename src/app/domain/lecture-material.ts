// 강의 자료 탭의 계산. 시각 글, 그 시각의 장면, 검색어 칠하기, 받아쓰기 거르기
import type { Frame, TranscriptLine } from './lecture-content';

// 초를 "02:15" 로 바꿈. 한 시간이 넘으면 "1:02:15"
export function formatTime(sec: number) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

// 그 시각 바로 전에 찍은 장면 번호. 캡처는 15초 간격 사진이라 정확히 그 순간은 아님
export function frameIndexAt(frames: readonly Frame[], t: number) {
  let found = 0;
  for (let i = 0; i < frames.length; i++) {
    if (frames[i].t <= t) found = i;
    else break;
  }
  return found;
}

// 장면이 보여 주는 시간대. 다음 장면 시각 전까지이고, 마지막 장면은 끝이 없음
export function frameRange(frames: readonly Frame[], index: number): [number, number] {
  return [frames[index]?.t ?? 0, frames[index + 1]?.t ?? Infinity];
}

// 글을 검색어 기준으로 나눔. hit 가 true 인 조각을 칠함. 대소문자는 가리지 않음
export type TextPart = { text: string; hit: boolean };

export function splitByQuery(text: string, query: string): TextPart[] {
  const q = query.trim().toLowerCase();
  if (!q) return [{ text, hit: false }];
  const lower = text.toLowerCase();
  const parts: TextPart[] = [];
  let from = 0;
  for (let at = lower.indexOf(q); at !== -1; at = lower.indexOf(q, from)) {
    if (at > from) parts.push({ text: text.slice(from, at), hit: false });
    parts.push({ text: text.slice(at, at + q.length), hit: true });
    from = at + q.length;
  }
  if (from < text.length) parts.push({ text: text.slice(from), hit: false });
  return parts;
}

// 검색어가 들어간 줄만 남김. 검색어가 비면 전부
export function filterLines(lines: readonly TranscriptLine[], query: string) {
  const q = query.trim().toLowerCase();
  return q ? lines.filter((l) => l.text.toLowerCase().includes(q)) : lines;
}
