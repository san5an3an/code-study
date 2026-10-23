import {
  DestroyRef,
  Injectable,
  inject,
  signal,
  type Signal,
  type WritableSignal,
} from '@angular/core';

import { COURSE_IDS, type CourseId } from '../domain/course';
import type { ProgressData } from '../domain/progress-data';
import { browserStorage, createProgressStore, progressKey, type ProgressStore } from './progress-store';

// 과목별 진도를 signal 로 내줌. 저장소는 과목마다 하나씩만 만듦
@Injectable({ providedIn: 'root' })
export class ProgressService {
  private readonly stores = new Map<CourseId, ProgressStore>();
  private readonly data = new Map<CourseId, WritableSignal<ProgressData>>();

  constructor() {
    const storage = browserStorage();
    for (const course of COURSE_IDS) {
      const store = createProgressStore(storage, course);
      const value = signal(store.get());
      store.subscribe(() => value.set(store.get()));
      this.stores.set(course, store);
      this.data.set(course, value);
    }

    // 다른 브라우저 탭이 진도를 바꾸면 이 탭도 다시 읽음
    const onStorage = (e: StorageEvent) => {
      for (const course of COURSE_IDS) {
        if (e.key === null || e.key === progressKey(course)) this.stores.get(course)!.reload();
      }
    };
    globalThis.addEventListener?.('storage', onStorage);
    inject(DestroyRef).onDestroy(() => globalThis.removeEventListener?.('storage', onStorage));
  }

  progress(course: CourseId): Signal<ProgressData> {
    return this.data.get(course)!.asReadonly();
  }

  update(course: CourseId, change: (prev: ProgressData) => ProgressData): boolean {
    return this.stores.get(course)!.update(change);
  }

  // 저장이 막힌 브라우저면 false. 새로고침하면 진도가 사라짐
  persisted(course: CourseId): boolean {
    return this.stores.get(course)!.persisted();
  }
}
