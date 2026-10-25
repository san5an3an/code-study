// 편집기 여러 개의 오타 검사를 모아 관리함. 글을 고칠 때마다 부르면 입력이 멈춘 뒤 한 번만 서버에 물음
import { signal } from '@angular/core';

import type { CheckResponse, CodeCheck } from '../core/run-api';

export type CheckFn = (source: string, signal: AbortSignal) => Promise<CheckResponse>;

export class CodeChecks<K> {
  private readonly pending = new Map<
    K,
    { timer: ReturnType<typeof setTimeout>; abort: AbortController }
  >();
  private readonly store = signal<ReadonlyMap<K, CodeCheck>>(new Map());
  // 편집기 key 별 마지막 검사 결과
  readonly results = this.store.asReadonly();

  constructor(private readonly delayMs = 600) {}

  // 같은 key 로 다시 부르면 앞에 기다리던 검사와 보낸 요청을 취소함. 빈 글은 서버에 묻지 않고 바로 에러 없음으로 둠
  request(key: K, source: string, check: CheckFn) {
    this.cancel(key);
    if (source.trim() === '') {
      this.set(key, { source, diagnostics: [] });
      return;
    }
    const abort = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const r = await check(source, abort.signal);
        // 취소된 뒤에 도착한 옛 결과는 버림. 실행 서버가 없거나 거절하면 밑줄 없이 둠
        if (!abort.signal.aborted && r.ok) this.set(key, { source, diagnostics: r.diagnostics });
      } catch {
        // 취소된 요청은 버림
      } finally {
        if (this.pending.get(key)?.abort === abort) this.pending.delete(key);
      }
    }, this.delayMs);
    this.pending.set(key, { timer, abort });
  }

  // 강의를 옮기거나 처음부터 다시 할 때 모든 검사를 멈추고 결과를 비움
  clear() {
    for (const key of [...this.pending.keys()]) this.cancel(key);
    this.store.set(new Map());
  }

  private cancel(key: K) {
    const p = this.pending.get(key);
    if (!p) return;
    clearTimeout(p.timer);
    p.abort.abort();
    this.pending.delete(key);
  }

  private set(key: K, check: CodeCheck) {
    this.store.update((m) => new Map(m).set(key, check));
  }
}
