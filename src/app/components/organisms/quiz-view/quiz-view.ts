import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { LucideRotateCcw } from '@lucide/angular';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';

import type { QuizQuestion } from '../../../domain/lecture-content';
import { EMPTY_ANSWER, verdictOf, type Answer } from '../../../domain/quiz-answer';
import type { QuizBest } from '../../../domain/quiz-record';
import { QuestionCard } from '../question-card/question-card';

export type QuizStatus = 'loading' | 'error' | 'none' | 'ready';

export type QuizAnswerChange = { q: QuizQuestion; answer: Answer };

// 퀴즈 탭 화면. 요약 줄, 최고 기록, 문제 카드 목록, 처음부터 다시. 답과 기록은 이 컴포넌트를 쓰는 부모가 들고 있음
@Component({
  selector: 'app-quiz-view',
  imports: [HlmButtonImports, HlmEmptyImports, HlmSkeletonImports, LucideRotateCcw, QuestionCard],
  template: `
    @switch (view()) {
      @case ('loading') {
        <div class="flex flex-col gap-2" aria-busy="true" aria-label="퀴즈 불러오는 중">
          <hlm-skeleton class="h-24 w-full" />
          <hlm-skeleton class="h-24 w-full" />
        </div>
      }
      @case ('error') {
        <div hlmEmpty class="border" data-testid="quiz-error">
          <div hlmEmptyHeader>
            <h3 hlmEmptyTitle>퀴즈를 못 불러왔어요</h3>
            <p hlmEmptyDescription>터미널에서 <code>npm run sync</code> 를 먼저 돌려 주세요.</p>
          </div>
        </div>
      }
      @case ('none') {
        <div hlmEmpty class="border" data-testid="quiz-none">
          <div hlmEmptyHeader>
            <h3 hlmEmptyTitle>아직 퀴즈가 없어요</h3>
            <p hlmEmptyDescription>이 과목은 강의 퀴즈를 아직 만들지 않았어요.</p>
          </div>
        </div>
      }
      @case ('ready') {
        <div class="flex flex-col gap-4">
          <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm">
            <p data-testid="quiz-summary">
              {{ questions().length }}문제 중 {{ right() + wrong() }}문제 풀었어요 · 맞음
              {{ right() }} · 틀림 {{ wrong() }}
            </p>
            @if (best(); as best) {
              <p class="text-muted-foreground tabular-nums" data-testid="quiz-best">
                최고 기록 {{ best.right }} / {{ best.total }}
              </p>
            }
          </div>
          @for (q of questions(); track q.n) {
            <app-question-card
              [q]="q"
              [answer]="answers()[q.n] ?? empty"
              [inReview]="inReview().includes(q.n)"
              (answerChange)="answerChange.emit({ q, answer: $event })"
            />
          }
          @if (started()) {
            <button hlmBtn variant="outline" class="self-start" (click)="resetAll.emit()">
              <svg lucideRotateCcw [size]="16"></svg>
              처음부터 다시
            </button>
          }
        </div>
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizView {
  readonly status = input.required<QuizStatus>();
  readonly questions = input<readonly QuizQuestion[]>([]);
  // 문제 번호 → 답. 아직 손대지 않은 문제는 없음
  readonly answers = input<Readonly<Record<number, Answer>>>({});
  readonly best = input<QuizBest | null>(null);
  // 오답 노트에 들어 있는 문제 번호
  readonly inReview = input<readonly number[]>([]);
  readonly answerChange = output<QuizAnswerChange>();
  readonly resetAll = output<void>();

  protected readonly empty = EMPTY_ANSWER;

  // 문제가 하나도 없는 퀴즈 파일은 못 불러온 것과 같이 봄
  protected readonly view = computed<QuizStatus>(() =>
    this.status() === 'ready' && this.questions().length === 0 ? 'error' : this.status(),
  );
  private readonly verdicts = computed(() =>
    this.questions().map((q) => verdictOf(q, this.answers()[q.n] ?? EMPTY_ANSWER)),
  );
  protected readonly right = computed(() => this.verdicts().filter((v) => v === 'right').length);
  protected readonly wrong = computed(() => this.verdicts().filter((v) => v === 'wrong').length);
  protected readonly started = computed(() => Object.keys(this.answers()).length > 0);
}
