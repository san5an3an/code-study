import { TestBed } from '@angular/core/testing';

import { LoadErrorState } from './load-error-state';

function render(heading: string) {
  const fixture = TestBed.createComponent(LoadErrorState);
  fixture.componentRef.setInput('heading', heading);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('load error state', () => {
  it('heading과 npm run sync 안내를 Spartan empty block 안에 render', () => {
    const el = render('노트를 못 불러왔어요');
    const empty = el.querySelector('[data-slot="empty"]')!;
    expect(empty.querySelector('[data-slot="empty-title"]')!.textContent).toBe(
      '노트를 못 불러왔어요',
    );
    expect(empty.querySelector('code')!.textContent).toBe('npm run sync');
  });

  it('host element는 contents class로 box를 안 만들어서 원래 자리의 layout을 keep', () => {
    expect(render('퀴즈를 못 불러왔어요').classList).toContain('contents');
  });
});
