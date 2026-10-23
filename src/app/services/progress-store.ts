// 과목 하나의 진도 저장소. localStorage 를 만지는 곳은 여기 하나이고, 막히거나 깨져도 앱은 돎
import type { CourseId } from '../domain/course';
import { emptyProgress, parseProgress, type ProgressData } from '../domain/progress-data';

export function progressKey(course: CourseId) {
  return `code-study:${course}:progress`;
}

export function brokenKey(course: CourseId) {
  return `${progressKey(course)}:broken`;
}

// java-study 때 저장한 진도. 같은 주소(5487)라 브라우저에 남아 있음
export const LEGACY_KEYS: Partial<Record<CourseId, string>> = { java: 'java-study:progress' };

export type StorageLike = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
};

export type ProgressStore = {
  get(): ProgressData;
  // 저장까지 됐으면 true, 막혀서 메모리에만 남았으면 false
  update(change: (prev: ProgressData) => ProgressData): boolean;
  subscribe(listener: () => void): () => void;
  // 다른 탭이 바꾼 값을 다시 읽음
  reload(): void;
  persisted(): boolean;
};

export function createProgressStore(storage: StorageLike | null, course: CourseId): ProgressStore {
  const key = progressKey(course);
  let persisted = storage !== null;
  const listeners = new Set<() => void>();

  // 새 키가 비어 있을 때만 옛 진도를 한 번 옮겨 옴. 옛 값은 지우지 않음
  function migrate(store: StorageLike) {
    const legacy = LEGACY_KEYS[course];
    if (!legacy || store.getItem(key) !== null) return;
    const text = store.getItem(legacy);
    if (text !== null && parseProgress(text)) store.setItem(key, text);
  }

  function read(): ProgressData {
    if (!storage) return emptyProgress();
    let text: string | null;
    try {
      migrate(storage);
      text = storage.getItem(key);
    } catch {
      persisted = false;
      return emptyProgress();
    }
    if (text === null) return emptyProgress();
    const parsed = parseProgress(text);
    if (parsed) return parsed;
    // 깨진 원래 글은 옆 키로 옮겨 두고 빈 진도로 시작함
    try {
      storage.setItem(brokenKey(course), text);
      storage.removeItem(key);
    } catch {
      persisted = false;
    }
    return emptyProgress();
  }

  let current = read();

  function notify() {
    for (const listener of listeners) listener();
  }

  return {
    get: () => current,
    update(change) {
      current = change(current);
      let saved = false;
      if (storage) {
        try {
          storage.setItem(key, JSON.stringify(current));
          saved = true;
        } catch {
          // 이번 화면에서는 메모리 값으로 계속 동작함
        }
      }
      persisted = saved;
      notify();
      return saved;
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    reload() {
      current = read();
      notify();
    },
    persisted: () => persisted,
  };
}

// 저장이 막힌 브라우저는 localStorage 에 손대기만 해도 던지므로 미리 한 번 써 보고 고름
export function browserStorage(): StorageLike | null {
  try {
    const storage = (globalThis as { localStorage?: StorageLike }).localStorage;
    if (!storage) return null;
    const probe = 'code-study:probe';
    storage.setItem(probe, '1');
    storage.removeItem(probe);
    return storage;
  } catch {
    return null;
  }
}
