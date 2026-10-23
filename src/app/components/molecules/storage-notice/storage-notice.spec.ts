import { TestBed } from '@angular/core/testing';

import { StorageNotice } from './storage-notice';

function render(persisted: boolean) {
  const fixture = TestBed.createComponent(StorageNotice);
  fixture.componentRef.setInput('persisted', persisted);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('저장이 막혔을 때 안내', () => {
  it('브라우저 저장이 되면 아무것도 그리지 않음', () => {
    expect(render(true).querySelector('[data-testid="storage-notice"]')).toBeNull();
  });

  it('브라우저 저장이 막히면 경고 문구와 아이콘을 그림', () => {
    const notice = render(false).querySelector('[data-testid="storage-notice"]');
    expect(notice?.textContent).toContain('진도가 저장되지 않아요');
    expect(notice?.querySelector('svg')).not.toBeNull();
  });
});
