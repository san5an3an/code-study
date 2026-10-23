import { emptyProgress, parseProgress } from '../domain/progress-data';
import { brokenKey, createProgressStore, progressKey, type StorageLike } from './progress-store';

function memoryStorage(initial: Record<string, string> = {}) {
  const map = new Map(Object.entries(initial));
  const storage: StorageLike = {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => void map.set(key, value),
    removeItem: (key) => void map.delete(key),
  };
  return { storage, map };
}

function throwingStorage(): StorageLike {
  const fail = () => {
    throw new Error('SecurityError');
  };
  return { getItem: fail, setItem: fail, removeItem: fail };
}

const SAVED = JSON.stringify({ ...emptyProgress(), lastLectureId: '09' });

describe('진도 저장소', () => {
  it('빈 저장소면 빈 진도로 시작하고, 저장된 것으로 봄', () => {
    const store = createProgressStore(memoryStorage().storage, 'java');
    expect(store.get()).toEqual(emptyProgress());
    expect(store.persisted()).toBe(true);
  });

  it('과목마다 키가 따로', () => {
    expect(progressKey('java')).toBe('code-study:java:progress');
    expect(progressKey('python')).toBe('code-study:python:progress');
    const { storage, map } = memoryStorage();
    createProgressStore(storage, 'python').update((p) => ({ ...p, lastLectureId: '05' }));
    expect(map.has('code-study:python:progress')).toBe(true);
    expect(createProgressStore(storage, 'java').get().lastLectureId).toBeNull();
  });

  it('자바 새 키가 비어 있으면 java-study 진도를 가져오고, 옛 값은 남김', () => {
    const { storage, map } = memoryStorage({ 'java-study:progress': SAVED });
    expect(createProgressStore(storage, 'java').get().lastLectureId).toBe('09');
    expect(map.get('code-study:java:progress')).toBe(SAVED);
    expect(map.get('java-study:progress')).toBe(SAVED);
  });

  it('새 키가 이미 있으면 옛 진도로 덮지 않고, 파이썬은 옛 진도를 안 가져옴', () => {
    const mine = JSON.stringify({ ...emptyProgress(), lastLectureId: '02' });
    const { storage } = memoryStorage({
      'java-study:progress': SAVED,
      'code-study:java:progress': mine,
    });
    expect(createProgressStore(storage, 'java').get().lastLectureId).toBe('02');
    expect(createProgressStore(storage, 'python').get().lastLectureId).toBeNull();
  });

  it('깨진 옛 진도는 가져오지 않음', () => {
    const { storage, map } = memoryStorage({ 'java-study:progress': '{깨짐' });
    expect(createProgressStore(storage, 'java').get()).toEqual(emptyProgress());
    expect(map.has('code-study:java:progress')).toBe(false);
  });

  it('바꾸면 구독한 쪽에 알리고, 구독을 끊으면 더 안 알림', () => {
    const store = createProgressStore(memoryStorage().storage, 'java');
    let calls = 0;
    const off = store.subscribe(() => calls++);
    store.update((p) => ({ ...p, lastLectureId: '01' }));
    off();
    store.update((p) => ({ ...p, lastLectureId: '02' }));
    expect(calls).toBe(1);
  });

  it('JSON 이 아니면 빈 진도로 시작하고, 원래 글은 broken 키로 옮김', () => {
    const { storage, map } = memoryStorage({ [progressKey('java')]: '{깨짐' });
    expect(createProgressStore(storage, 'java').get()).toEqual(emptyProgress());
    expect(map.get(brokenKey('java'))).toBe('{깨짐');
    expect(map.has(progressKey('java'))).toBe(false);
  });

  it('모르는 version, 틀린 모양은 버림', () => {
    expect(parseProgress(JSON.stringify({ ...emptyProgress(), version: 2 }))).toBeNull();
    expect(parseProgress(JSON.stringify({ ...emptyProgress(), lastLectureId: 3 }))).toBeNull();
    expect(parseProgress(JSON.stringify({ ...emptyProgress(), lectures: [] }))).toBeNull();
    expect(
      parseProgress(JSON.stringify({ ...emptyProgress(), wrong: { '03-5': { lectureId: '03' } } })),
    ).toBeNull();
    expect(parseProgress(JSON.stringify(emptyProgress()))).toEqual(emptyProgress());
  });

  it('저장이 막혀도 던지지 않고, 메모리 값은 유지하며 저장 안 됨으로 봄', () => {
    const store = createProgressStore(throwingStorage(), 'java');
    expect(store.get()).toEqual(emptyProgress());
    expect(store.update((p) => ({ ...p, lastLectureId: '07' }))).toBe(false);
    expect(store.get().lastLectureId).toBe('07');
    expect(store.persisted()).toBe(false);
  });

  it('저장소가 아예 없으면 저장 안 됨으로 봄', () => {
    const store = createProgressStore(null, 'java');
    expect(store.persisted()).toBe(false);
    expect(store.update((p) => p)).toBe(false);
  });

  it('다른 탭이 바꾼 값을 reload 로 다시 읽음', () => {
    const { storage } = memoryStorage();
    const store = createProgressStore(storage, 'java');
    createProgressStore(storage, 'java').update((p) => ({ ...p, lastLectureId: '12' }));
    expect(store.get().lastLectureId).toBeNull();
    store.reload();
    expect(store.get().lastLectureId).toBe('12');
  });
});
