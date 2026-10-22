// 과목 하나의 진도 저장 형식과 읽기 함수. 형식이 틀리면 저장값 전체를 버림

// 강의마다 남기는 기록. 퀴즈 채점 기록과 진도 체크가 여기에 값을 더함
export type LectureRecord = Record<string, unknown>;

export type WrongRecord = { lectureId: string; n: number; at: string };

export type ProgressData = {
  version: 1;
  lastLectureId: string | null;
  lectures: Record<string, LectureRecord>;
  // 키는 "<강의>-<문제 번호>" (예: "03-5")
  wrong: Record<string, WrongRecord>;
};

export function emptyProgress(): ProgressData {
  return { version: 1, lastLectureId: null, lectures: {}, wrong: {} };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isWrongRecord(value: unknown): value is WrongRecord {
  return (
    isObject(value) &&
    typeof value['lectureId'] === 'string' &&
    typeof value['n'] === 'number' &&
    typeof value['at'] === 'string'
  );
}

// 일부만 맞는 값을 살려 쓰다 진도가 엉키지 않도록 하나라도 틀리면 null
export function parseProgress(text: string): ProgressData | null {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return null;
  }
  if (!isObject(raw) || raw['version'] !== 1) return null;
  const last = raw['lastLectureId'];
  if (last !== null && typeof last !== 'string') return null;
  const lectures = raw['lectures'];
  if (!isObject(lectures) || !Object.values(lectures).every(isObject)) return null;
  const wrong = raw['wrong'];
  if (!isObject(wrong) || !Object.values(wrong).every(isWrongRecord)) return null;
  return {
    version: 1,
    lastLectureId: last,
    lectures: lectures as Record<string, LectureRecord>,
    wrong: wrong as Record<string, WrongRecord>,
  };
}
