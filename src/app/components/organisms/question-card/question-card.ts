import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { LucideCheck, LucideEye, LucideRotateCcw, LucideX } from '@lucide/angular';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';

import type { QuizQuestion } from '../../../domain/lecture-content';
import { inlineHtml, noteHtml } from '../../../domain/note-markdown';
import { EMPTY_ANSWER, isAuto, verdictOf, type Answer } from '../../../domain/quiz-answer';

// 채점 뒤 보기 줄 색. 잠긴 버튼의 흐림과 outline 배경보다 이겨야 해서 ! 를 붙임
const TONE_RIGHT =
  'border-(--semantic-border-success-default)! bg-(--semantic-bg-success-subtlest)! data-disabled:opacity-100';
const TONE_WRONG =
  'border-(--semantic-border-danger-default)! bg-(--semantic-bg-danger-subtlest)! data-disabled:opacity-100';

// 문제 카드 하나. 퀴즈 탭과 오답 노트가 같이 씀. 답이 바뀌면 새 답을 부모에게 알림
@Component({
  selector: 'app-question-card',
  imports: [
    HlmBadgeImports,
    HlmButtonImports,
    HlmCardImports,
    HlmCheckboxImports,
    HlmTextareaImports,
    LucideCheck,
    LucideEye,
    LucideRotateCcw,
    LucideX,
  ],
  template: `
    <div
      hlmCard
      role="group"
      [attr.aria-labelledby]="titleId()"
      [attr.data-testid]="idPrefix() + '-' + q().n"
    >
      <div hlmCardHeader class="flex flex-wrap items-center gap-2">
        <span [id]="titleId()" class="font-semibold">{{ q().n }}번 문제</span>
        <span hlmBadge variant="secondary">{{ q().label }}</span>
        @if (q().outsideLecture) {
          <span hlmBadge variant="outline">강의 밖 내용</span>
        }
        @if (inReview()) {
          <span hlmBadge variant="destructive">오답 노트에 있어요</span>
        }
      </div>

      <div hlmCardContent class="flex flex-col gap-4">
        <div class="ods-prose" [innerHTML]="promptHtml()"></div>

        @if (q().kind === 'ox') {
          <div class="flex gap-2">
            @for (v of oxValues; track v) {
              <button
                hlmBtn
                variant="outline"
                size="lg"
                class="w-16 text-base"
                [class]="tone(v)"
                [disabled]="answer().graded"
                [attr.aria-pressed]="answer().picked.includes(v)"
                (click)="set({ picked: [v], graded: true })"
              >
                {{ v }}
              </button>
            }
          </div>
        } @else if (multi()) {
          <div class="flex flex-col gap-2">
            <p class="text-sm text-muted-foreground">
              정답이 여러 개예요. 모두 고른 뒤 "채점하기"를 눌러요.
            </p>
            @for (opt of optionsHtml(); track $index) {
              <label
                class="flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2"
                [class]="tone($index + 1)"
              >
                <hlm-checkbox
                  [checked]="answer().picked.includes($index + 1)"
                  [disabled]="answer().graded"
                  (checkedChange)="toggle($index + 1, $event)"
                />
                <span>{{ $index + 1 }}. <span [innerHTML]="opt"></span></span>
              </label>
            }
            @if (!answer().graded) {
              <button
                hlmBtn
                class="self-start"
                [disabled]="answer().picked.length === 0"
                (click)="set({ graded: true })"
              >
                채점하기
              </button>
            }
          </div>
        } @else if (auto()) {
          <div class="flex flex-col gap-2">
            @for (opt of optionsHtml(); track $index) {
              <button
                hlmBtn
                variant="outline"
                class="h-auto justify-start py-2 text-left whitespace-normal"
                [class]="tone($index + 1)"
                [disabled]="answer().graded"
                [attr.aria-pressed]="answer().picked.includes($index + 1)"
                (click)="set({ picked: [$index + 1], graded: true })"
              >
                <span>{{ $index + 1 }}. <span [innerHTML]="opt"></span></span>
              </button>
            }
          </div>
        } @else {
          <div class="flex flex-col gap-2">
            <label [for]="inputId()" class="text-sm font-medium">내 답</label>
            <textarea
              hlmTextarea
              class="font-mono"
              placeholder="여기에 써 보고 정답을 확인해요"
              [id]="inputId()"
              [rows]="q().kind === 'blank' ? 1 : 3"
              [value]="answer().text"
              (input)="set({ text: $any($event.target).value })"
            ></textarea>
            @if (!answer().revealed) {
              <button hlmBtn variant="outline" class="self-start" (click)="set({ revealed: true })">
                <svg lucideEye [size]="16"></svg>
                정답 보기
              </button>
            }
          </div>
        }

        @if (showAnswer()) {
          @if (auto()) {
            @if (verdict() === 'right') {
              <p class="quiz-right flex items-center gap-1 font-semibold">
                <svg lucideCheck [size]="16"></svg>
                맞았어요
              </p>
            } @else {
              <p class="quiz-wrong flex items-center gap-1 font-semibold">
                <svg lucideX [size]="16"></svg>
                틀렸어요
              </p>
            }
          }
          <div class="flex flex-col gap-2 border-t pt-3" data-testid="quiz-explanation">
            <p class="text-sm font-semibold">{{ q().isExample ? '예시 답안' : '정답' }}</p>
            @if (answerHeadHtml()) {
              <p [innerHTML]="answerHeadHtml()"></p>
            }
            <div class="ods-prose" [innerHTML]="explanationHtml()"></div>
          </div>
          @if (!auto()) {
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-sm">스스로 체크해 봐요:</span>
              <button
                hlmBtn
                size="sm"
                [variant]="answer().self === 'right' ? 'default' : 'outline'"
                [attr.aria-pressed]="answer().self === 'right'"
                (click)="set({ self: 'right' })"
              >
                <svg lucideCheck [size]="14"></svg>
                맞았어요
              </button>
              <button
                hlmBtn
                size="sm"
                [variant]="answer().self === 'wrong' ? 'destructive' : 'outline'"
                [attr.aria-pressed]="answer().self === 'wrong'"
                (click)="set({ self: 'wrong' })"
              >
                <svg lucideX [size]="14"></svg>
                틀렸어요
              </button>
            </div>
          }
        }

        @if (started()) {
          <button
            hlmBtn
            variant="ghost"
            size="sm"
            class="self-start"
            (click)="answerChange.emit(empty)"
          >
            <svg lucideRotateCcw [size]="14"></svg>
            다시 풀기
          </button>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionCard {
  readonly q = input.required<QuizQuestion>();
  readonly answer = input<Answer>(EMPTY_ANSWER);
  // 오답 노트엔 여러 강의 문제가 같이 있어 번호만으론 id 가 겹쳐서 앞에 붙이는 이름
  readonly idPrefix = input('quiz');
  readonly inReview = input(false);
  readonly answerChange = output<Answer>();

  protected readonly empty = EMPTY_ANSWER;
  protected readonly oxValues = ['O', 'X'] as const;

  protected readonly titleId = computed(() => `${this.idPrefix()}-title-${this.q().n}`);
  protected readonly inputId = computed(() => `${this.idPrefix()}-answer-${this.q().n}`);
  protected readonly auto = computed(() => isAuto(this.q()));
  protected readonly multi = computed(
    () => this.q().kind === 'choice' && this.q().correct.length > 1,
  );
  protected readonly verdict = computed(() => verdictOf(this.q(), this.answer()));
  protected readonly started = computed(() => this.answer() !== EMPTY_ANSWER);
  protected readonly showAnswer = computed(() =>
    this.auto() ? this.answer().graded : this.answer().revealed,
  );

  protected readonly promptHtml = computed(() => noteHtml(this.q().prompt));
  protected readonly optionsHtml = computed(() => this.q().options.map(inlineHtml));
  protected readonly answerHeadHtml = computed(() => inlineHtml(this.q().answerHead));
  protected readonly explanationHtml = computed(() => noteHtml(this.q().explanation));

  // 채점 전엔 고른 줄만 진하게, 채점 뒤엔 정답 초록, 고른 오답 빨강, 나머지는 흐리게
  protected tone(value: string | number) {
    const a = this.answer();
    const picked = a.picked.includes(value);
    if (!a.graded) return picked ? 'border-primary' : '';
    if (this.q().correct.includes(value)) return TONE_RIGHT;
    if (picked) return TONE_WRONG;
    return 'opacity-60';
  }

  protected toggle(value: number, on: boolean) {
    const picked = this.answer().picked;
    this.set({ picked: on ? [...picked, value] : picked.filter((p) => p !== value) });
  }

  protected set(change: Partial<Answer>) {
    this.answerChange.emit({ ...this.answer(), ...change });
  }
}
