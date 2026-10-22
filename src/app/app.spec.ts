import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { routes } from './app.routes';

describe('앱 기본 화면 틀', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideRouter(routes, withComponentInputBinding())],
    });
  });

  it('/java 주소는 자바 사이드바와 강의 22개를 그림', async () => {
    const harness = await RouterTestingHarness.create('/java');
    const el = harness.routeNativeElement!.ownerDocument.body;
    expect(el.textContent).toContain('Java 기초 강의 복습');
    expect(el.querySelectorAll('[data-testid^="lecture-link-"]').length).toBe(22);
  });

  it('/python 주소는 파이썬 사이드바에 5부 18강을 그림', async () => {
    const harness = await RouterTestingHarness.create('/python');
    const el = harness.routeNativeElement!.ownerDocument.body;
    expect(el.textContent).toContain('Python 기초 강의 복습');
    expect(el.querySelectorAll('[data-testid^="part-"]').length).toBe(5);
    expect(el.querySelectorAll('[data-testid^="lecture-link-"]').length).toBe(18);
  });

  it('없는 과목 주소는 없는 화면 안내를 그림', async () => {
    const harness = await RouterTestingHarness.create('/ruby');
    expect(harness.routeNativeElement!.textContent).toContain('없는 화면이에요');
  });
});
