import { TestBed } from '@angular/core/testing';

import type { Frame, TranscriptLine } from '../../../domain/lecture-content';
import { MaterialView } from './material-view';

const FRAMES: Frame[] = [
  { t: 0, file: 't00m00s.jpg' },
  { t: 15, file: 't00m15s.jpg' },
  { t: 30, file: 't00m30s.jpg' },
];
const LINES: TranscriptLine[] = [
  { t: 0, text: '오늘은 변수를 봄' },
  { t: 15, text: '타입 이야기' },
  { t: 30, text: '정리' },
  { t: 66, text: '변수 이름 짓기' },
];

function render(inputs: Record<string, unknown> = {}) {
  const fixture = TestBed.createComponent(MaterialView);
  const all = {
    status: 'ready',
    course: 'java',
    lectureId: '03',
    frames: FRAMES,
    lines: LINES,
    ...inputs,
  };
  for (const [k, v] of Object.entries(all)) fixture.componentRef.setInput(k, v);
  fixture.detectChanges();
  const el = fixture.nativeElement as HTMLElement;
  const q = <T extends Element = HTMLElement>(s: string) => el.querySelector<T>(s);
  const byLabel = (label: string) => q(`[aria-label="${label}"]`)!;
  const position = () => q('[data-testid="frame-position"]')!.textContent!.trim();
  const items = () => [...el.querySelectorAll('[data-testid="transcript"] li')];
  const search = (text: string) => {
    const input = byLabel('받아쓰기 검색') as HTMLInputElement;
    input.value = text;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  };
  const click = (label: string) => {
    byLabel(label).click();
    fixture.detectChanges();
  };
  return { fixture, el, q, byLabel, position, items, search, click };
}

describe('강의 자료 탭 화면', () => {
  it('불러오는 중, 실패, 자료 없는 과목을 각각 다르게 그림', () => {
    expect(render({ status: 'loading' }).q('[aria-busy="true"]')).not.toBeNull();
    expect(render({ status: 'error' }).q('[data-testid="material-error"]')).not.toBeNull();
    expect(render({ status: 'none' }).q('[data-testid="material-none"]')).not.toBeNull();
  });

  it('사진이 한 장도 없으면 불러오기 실패와 같이 보여 줌', () => {
    const { q } = render({ frames: [] });
    expect(q('[data-testid="material-error"]')!.textContent).toContain('강의 자료를 못 불러왔어요');
  });

  it('안내, 첫 장면 사진과 위치, 받아쓰기 줄 수를 그림', () => {
    const { el, q, position, items } = render();
    expect(el.textContent).toContain('자동 받아쓰기라 틀린 글자가 있을 수 있어요.');
    expect(q<HTMLImageElement>('[data-testid="frame-image"]')!.getAttribute('src')).toBe(
      '/frames/java/03/t00m00s.jpg',
    );
    expect(position()).toBe('1 / 3 · 00:00');
    expect(q('[data-testid="transcript-count"]')!.textContent!.trim()).toBe('4줄');
    expect(items()).toHaveLength(4);
    expect(el.querySelectorAll('[role="slider"]')).toHaveLength(1);
  });

  it('이전, 다음 버튼으로 장면을 넘기고 끝에서는 버튼이 꺼짐', () => {
    const { byLabel, position, click } = render();
    expect((byLabel('이전 장면') as HTMLButtonElement).disabled).toBe(true);
    click('다음 장면');
    click('다음 장면');
    expect(position()).toBe('3 / 3 · 00:30');
    expect((byLabel('다음 장면') as HTMLButtonElement).disabled).toBe(true);
    click('이전 장면');
    expect(position()).toBe('2 / 3 · 00:15');
  });

  it('사진 칸에서 좌우 화살표로 장면을 넘김', () => {
    const { fixture, byLabel, position } = render();
    const press = (key: string) => {
      byLabel('화면 캡처').dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
      fixture.detectChanges();
    };
    press('ArrowRight');
    press('ArrowRight');
    press('ArrowLeft');
    expect(position()).toBe('2 / 3 · 00:15');
  });

  it('받아쓰기 시각을 누르면 그 장면으로 가고, 다음 장면 시각 전까지의 줄만 표시됨', () => {
    const { q, position, items, click } = render();
    click('00:15 장면 보기');
    expect(position()).toBe('2 / 3 · 00:15');
    expect(items().map((li) => li.getAttribute('data-current'))).toEqual([
      'false',
      'true',
      'false',
      'false',
    ]);
    click('01:06 장면 보기');
    expect(q<HTMLImageElement>('[data-testid="frame-image"]')!.getAttribute('src')).toBe(
      '/frames/java/03/t00m30s.jpg',
    );
  });

  it('검색하면 줄을 거르고 찾은 글자를 칠하며, 없으면 안내를 보여 줌', () => {
    const { el, q, items, search } = render();
    search('변수');
    expect(q('[data-testid="transcript-count"]')!.textContent!.trim()).toBe('4줄 중 2줄');
    expect(items()).toHaveLength(2);
    expect([...el.querySelectorAll('mark')].map((m) => m.textContent)).toEqual(['변수', '변수']);
    search('쿠버네티스');
    expect(el.textContent).toContain('"쿠버네티스"가 들어간 줄이 없어요.');
  });

  it('이 장면 말 보기를 누르면 검색어를 지움', () => {
    const { el, byLabel, items, search } = render();
    search('타입');
    expect(items()).toHaveLength(1);
    const button = [...el.querySelectorAll('button')].find((b) =>
      b.textContent!.includes('이 장면 말 보기'),
    )!;
    button.click();
    TestBed.tick();
    expect(items()).toHaveLength(4);
    expect((byLabel('받아쓰기 검색') as HTMLInputElement).value).toBe('');
  });

  it('다른 강의로 가면 첫 장면, 빈 검색어로 돌아감', () => {
    const { fixture, position, click, search, byLabel } = render();
    click('다음 장면');
    search('변수');
    fixture.componentRef.setInput('lectureId', '04');
    fixture.detectChanges();
    expect(position()).toBe('1 / 3 · 00:00');
    expect((byLabel('받아쓰기 검색') as HTMLInputElement).value).toBe('');
  });
});
