import { TestBed } from '@angular/core/testing';

import { NoteView, type NoteStatus } from './note-view';

function render(status: NoteStatus, html = '') {
  const fixture = TestBed.createComponent(NoteView);
  fixture.componentRef.setInput('status', status);
  fixture.componentRef.setInput('html', html);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('노트 탭 화면', () => {
  it('불러오는 중이면 회색 자리 표시 3줄만 그림', () => {
    const el = render('loading');
    expect(el.querySelectorAll('[data-slot="skeleton"]')).toHaveLength(3);
    expect(el.querySelector('[aria-busy="true"]')).not.toBeNull();
    expect(el.querySelector('[data-testid="note"]')).toBeNull();
  });

  it('불러오기에 실패하면 npm run sync 안내를 그림', () => {
    const el = render('error');
    expect(el.querySelector('[data-testid="note-error"]')!.textContent).toContain('npm run sync');
  });

  it('노트가 없는 과목이면 아직 없다는 안내를 그림', () => {
    expect(render('none').querySelector('[data-testid="note-none"]')!.textContent).toContain(
      '아직 노트가 없어요',
    );
  });

  it('본문 HTML 을 그리고, script 태그는 걸러 냄', () => {
    const el = render('ready', '<h2>배우는 것</h2><p>본문<br>둘째 줄</p><script>alert(1)</script>');
    const note = el.querySelector('[data-testid="note"]')!;
    expect(note.classList).toContain('ods-prose');
    expect(note.querySelector('h2')!.textContent).toBe('배우는 것');
    expect(note.querySelectorAll('br')).toHaveLength(1);
    expect(note.querySelector('script')).toBeNull();
  });
});
