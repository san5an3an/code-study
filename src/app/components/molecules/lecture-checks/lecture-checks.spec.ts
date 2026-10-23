import { TestBed } from '@angular/core/testing';

import type { Missing } from '../../../domain/lecture-progress';
import { LectureChecks, type CheckChange } from './lecture-checks';

function render(checked: { videoWatched: boolean; noteRead: boolean }, missing: Missing[]) {
  const fixture = TestBed.createComponent(LectureChecks);
  fixture.componentRef.setInput('checked', checked);
  fixture.componentRef.setInput('missing', missing);
  const changes: CheckChange[] = [];
  fixture.componentInstance.checkChange.subscribe((c) => changes.push(c));
  fixture.detectChanges();
  return { el: fixture.nativeElement as HTMLElement, changes };
}

describe('강의 진도 체크', () => {
  it('완료까지 남은 항목을 문구로 보여 줌', () => {
    const { el } = render({ videoWatched: true, noteRead: false }, ['note', 'quiz']);
    expect(el.querySelector('[data-testid="lecture-status"]')!.textContent).toContain(
      '끝내려면: 노트, 퀴즈 절반 이상',
    );
    expect(el.querySelector('#check-videoWatched')!.getAttribute('aria-checked')).toBe('true');
    expect(el.querySelector('#check-noteRead')!.getAttribute('aria-checked')).toBe('false');
  });

  it('남은 항목이 없으면 끝낸 강의라고 보여 줌', () => {
    const { el } = render({ videoWatched: true, noteRead: true }, []);
    expect(el.querySelector('[data-testid="lecture-status"]')!.textContent).toContain('끝낸 강의예요');
  });

  it('체크박스 이름표를 누르면 어떤 체크를 켰는지 부모에게 알림', () => {
    const { el, changes } = render({ videoWatched: false, noteRead: false }, ['video', 'note', 'quiz']);
    (el.querySelectorAll('label')[1] as HTMLElement).click();
    expect(changes).toEqual([{ key: 'noteRead', on: true }]);
  });
});
