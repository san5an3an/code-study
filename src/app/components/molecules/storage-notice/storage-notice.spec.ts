import { TestBed } from '@angular/core/testing';

import { StorageNotice } from './storage-notice';

function render(persisted: boolean) {
  const fixture = TestBed.createComponent(StorageNotice);
  fixture.componentRef.setInput('persisted', persisted);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('저장 막힘 안내', () => {
  it('저장이 되면 아무것도 안 그림', () => {
    expect(render(true).querySelector('[data-testid="storage-notice"]')).toBeNull();
  });

  it('저장이 막히면 경고와 아이콘을 그림', () => {
    const notice = render(false).querySelector('[data-testid="storage-notice"]');
    expect(notice?.textContent).toContain('진도가 저장되지 않아요');
    expect(notice?.querySelector('svg')).not.toBeNull();
  });
});
