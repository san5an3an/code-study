import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterRenderEffect,
  computed,
  input,
  linkedSignal,
  viewChild,
} from '@angular/core';
import {
  LucideChevronLeft,
  LucideChevronRight,
  LucideInfo,
  LucideListStart,
} from '@lucide/angular';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmScrollAreaImports } from '@spartan-ng/helm/scroll-area';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { HlmSliderImports } from '@spartan-ng/helm/slider';
import { NgScrollbar } from 'ngx-scrollbar';

import type { CourseId } from '../../../domain/course';
import type { Frame, TranscriptLine } from '../../../domain/lecture-content';
import {
  filterLines,
  formatTime,
  frameIndexAt,
  frameRange,
  splitByQuery,
} from '../../../domain/lecture-material';

export type MaterialStatus = 'loading' | 'error' | 'none' | 'ready';

// 강의 자료 탭 화면. 위는 화면 캡처, 아래는 받아쓰기. 받아쓰기 시각을 누르면 그 장면으로 감.
// 보던 장면과 검색어는 이 컴포넌트가 들고, 다른 강의로 가면 첫 장면과 빈 검색어로 돌아감
@Component({
  selector: 'app-material-view',
  imports: [
    HlmAlertImports,
    HlmButtonImports,
    HlmEmptyImports,
    HlmInputImports,
    HlmScrollAreaImports,
    HlmSkeletonImports,
    HlmSliderImports,
    LucideChevronLeft,
    LucideChevronRight,
    LucideInfo,
    LucideListStart,
    NgScrollbar,
  ],
  template: `
    @switch (view()) {
      @case ('loading') {
        <div class="flex flex-col gap-3" aria-busy="true" aria-label="강의 자료 불러오는 중">
          <hlm-skeleton class="aspect-video w-full" />
          <hlm-skeleton class="h-4 w-1/2" />
        </div>
      }
      @case ('error') {
        <div hlmEmpty class="border" data-testid="material-error">
          <div hlmEmptyHeader>
            <h3 hlmEmptyTitle>강의 자료를 못 불러왔어요</h3>
            <p hlmEmptyDescription>터미널에서 <code>npm run sync</code> 를 먼저 돌려 주세요.</p>
          </div>
        </div>
      }
      @case ('none') {
        <div hlmEmpty class="border" data-testid="material-none">
          <div hlmEmptyHeader>
            <h3 hlmEmptyTitle>아직 강의 자료가 없어요</h3>
            <p hlmEmptyDescription>이 과목은 화면 캡처와 받아쓰기를 아직 가져오지 않았어요.</p>
          </div>
        </div>
      }
      @case ('ready') {
        <div class="flex flex-col gap-6">
          <div hlmAlert>
            <svg lucideInfo [size]="16"></svg>
            <p hlmAlertDescription>자동 받아쓰기라 틀린 글자가 있을 수 있어요.</p>
          </div>

          <section
            aria-label="화면 캡처"
            tabindex="0"
            class="frame-viewer focus-visible:ring-ring/50 flex flex-col gap-3 rounded-xl outline-none focus-visible:ring-3"
            (keydown)="onFrameKey($event)"
          >
            <img
              [src]="frameSrc(frame().file)"
              [alt]="lectureId() + '강 화면 캡처 ' + time(frame().t)"
              class="bg-muted ring-foreground/10 aspect-video w-full rounded-xl object-contain ring-1"
              data-testid="frame-image"
            />
            <div class="flex items-center gap-3">
              <button
                hlmBtn
                variant="outline"
                size="icon"
                aria-label="이전 장면"
                [disabled]="index() === 0"
                (click)="index.set(index() - 1)"
              >
                <svg lucideChevronLeft [size]="16"></svg>
              </button>
              @if (last() > 0) {
                <hlm-slider
                  aria-label="장면 고르기"
                  class="flex-1"
                  [min]="0"
                  [max]="last()"
                  [step]="1"
                  [value]="sliderValue()"
                  (valueChange)="index.set($event[0])"
                />
              }
              <button
                hlmBtn
                variant="outline"
                size="icon"
                aria-label="다음 장면"
                [disabled]="index() === last()"
                (click)="index.set(index() + 1)"
              >
                <svg lucideChevronRight [size]="16"></svg>
              </button>
            </div>
            <p
              class="text-muted-foreground text-center text-sm tabular-nums"
              data-testid="frame-position"
            >
              {{ index() + 1 }} / {{ frames().length }} · {{ time(frame().t) }}
            </p>
          </section>

          <section aria-labelledby="transcript-heading" class="flex flex-col gap-3">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <h2 id="transcript-heading" class="text-sm font-semibold">받아쓰기</h2>
              <button hlmBtn variant="outline" size="sm" (click)="showScene()">
                <svg lucideListStart [size]="16"></svg>이 장면 말 보기
              </button>
            </div>
            <div class="flex flex-wrap items-center gap-3">
              <input
                hlmInput
                type="search"
                aria-label="받아쓰기 검색"
                placeholder="찾을 말 (예: 변수)"
                class="max-w-xs"
                [value]="query()"
                (input)="query.set($any($event.target).value)"
              />
              <p class="text-muted-foreground text-sm tabular-nums" data-testid="transcript-count">
                {{ countText() }}
              </p>
            </div>
            <ng-scrollbar hlm class="ring-foreground/10 h-96 rounded-xl ring-1">
              @if (shown().length === 0) {
                <p class="text-muted-foreground p-4 text-sm">
                  "{{ query().trim() }}"가 들어간 줄이 없어요.
                </p>
              } @else {
                <ol #transcript class="flex flex-col p-2" data-testid="transcript">
                  @for (line of shown(); track $index) {
                    <li
                      class="transcript-line flex items-start gap-3 rounded-md px-2 py-1"
                      [attr.data-current]="line.t >= range()[0] && line.t < range()[1]"
                    >
                      <button
                        type="button"
                        class="text-primary shrink-0 font-mono text-xs leading-6 tabular-nums underline-offset-4 hover:underline"
                        [attr.aria-label]="time(line.t) + ' 장면 보기'"
                        (click)="pickTime(line.t)"
                      >
                        {{ time(line.t) }}
                      </button>
                      <span class="text-sm leading-6 break-keep">
                        @for (part of parts(line.text); track $index) {
                          @if (part.hit) {
                            <mark>{{ part.text }}</mark>
                          } @else {
                            {{ part.text }}
                          }
                        }
                      </span>
                    </li>
                  }
                </ol>
              }
            </ng-scrollbar>
          </section>
        </div>
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialView {
  readonly status = input.required<MaterialStatus>();
  readonly course = input.required<CourseId>();
  readonly lectureId = input.required<string>();
  readonly frames = input<readonly Frame[]>([]);
  readonly lines = input<readonly TranscriptLine[]>([]);

  // 과목과 강의를 합친 이름. 이 값이 바뀌면 첫 장면, 빈 검색어로 돌아감
  private readonly lectureKey = computed(() => `${this.course()}/${this.lectureId()}`);
  protected readonly index = linkedSignal({ source: this.lectureKey, computation: () => 0 });
  protected readonly query = linkedSignal({ source: this.lectureKey, computation: () => '' });

  // 사진이 한 장도 없으면 그릴 장면이 없으므로 불러오기 실패와 같이 봄
  protected readonly view = computed<MaterialStatus>(() =>
    this.status() === 'ready' && this.frames().length === 0 ? 'error' : this.status(),
  );
  protected readonly last = computed(() => this.frames().length - 1);
  // 손잡이 하나짜리 슬라이더는 값을 배열로 받음. 그릴 때마다 새 배열이 생기지 않게 computed 로 둠
  protected readonly sliderValue = computed(() => [this.index()]);
  protected readonly frame = computed(() => this.frames()[this.index()] ?? this.frames()[0]);
  protected readonly range = computed(() => frameRange(this.frames(), this.index()));
  protected readonly shown = computed(() => filterLines(this.lines(), this.query()));
  protected readonly countText = computed(() => {
    const all = this.lines().length.toLocaleString();
    return this.query().trim()
      ? `${all}줄 중 ${this.shown().length.toLocaleString()}줄`
      : `${all}줄`;
  });

  private readonly scrollbar = viewChild(NgScrollbar);
  private readonly transcript = viewChild<ElementRef<HTMLElement>>('transcript');
  // "이 장면 말 보기"를 누를 때마다 1씩 늘림. 늘어난 뒤 화면이 그려지면 그 줄로 스크롤함
  private readonly jump = linkedSignal({ source: this.lectureKey, computation: () => 0 });

  protected readonly time = formatTime;
  protected readonly parts = (text: string) => splitByQuery(text, this.query());
  protected frameSrc(file: string) {
    return `/frames/${this.course()}/${this.lectureId()}/${file}`;
  }

  constructor() {
    // 다음 장면 사진만 미리 받아 둠. 브라우저에서만 돎
    afterRenderEffect(() => {
      const next = this.frames()[this.index() + 1];
      if (this.view() === 'ready' && next) new Image().src = this.frameSrc(next.file);
    });
    // 페이지는 두고 받아쓰기 칸 안에서만 지금 장면 첫 줄을 맨 위로 올림
    afterRenderEffect(() => {
      if (this.jump() === 0) return;
      const target =
        this.transcript()?.nativeElement.querySelector<HTMLElement>('[data-current="true"]');
      if (target) void this.scrollbar()?.scrollToElement(target, { top: 0, duration: 0 });
    });
  }

  // 슬라이더는 화살표를 스스로 처리하므로 슬라이더 위에서 누른 키는 건너뜀. 두 칸씩 넘어가지 않게 함
  protected onFrameKey(e: KeyboardEvent) {
    if ((e.target as HTMLElement).closest('[data-slot="slider"]')) return;
    if (e.key === 'ArrowLeft' && this.index() > 0) {
      e.preventDefault();
      this.index.set(this.index() - 1);
    } else if (e.key === 'ArrowRight' && this.index() < this.last()) {
      e.preventDefault();
      this.index.set(this.index() + 1);
    }
  }

  protected pickTime(t: number) {
    this.index.set(frameIndexAt(this.frames(), t));
  }

  // 검색으로 지금 장면 줄이 가려져 있을 수 있으므로 검색어를 지우고 스크롤함
  protected showScene() {
    this.query.set('');
    this.jump.set(this.jump() + 1);
  }
}
