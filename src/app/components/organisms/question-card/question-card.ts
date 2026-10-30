import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import {
  LucideCheck,
  LucideEye,
  LucideLightbulb,
  LucideLoaderCircle,
  LucidePlay,
  LucideRotateCcw,
  LucideX,
} from '@lucide/angular';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';

import { gradeVerdict, type CodeGrade } from '../../../domain/code-grade';
import type { QuizQuestion } from '../../../domain/lecture-content';
import { inlineHtml, noteHtml } from '../../../domain/note-markdown';
import { isRunCourse, MEMORY_STOPPED, type CodeCheck } from '../../../core/run-api';
import {
  codeLanguageOf,
  EMPTY_ANSWER,
  isAuto,
  verdictOf,
  type Answer,
} from '../../../domain/quiz-answer';
import { CodeEditor } from '../../atoms/code-editor/code-editor';

// 보기 줄 색 표시. 실제 색은 styles.css 의 [data-quiz-tone] 규칙이 정함
export type QuizTone = 'picked' | 'right' | 'wrong' | 'dim';

// 채점 결과 칸에 그릴 글. diff 는 출력이 다를 때 처음 다른 줄, detail 은 에러 문구
type GradeView = {
  tone: 'right' | 'wrong' | 'info';
  title: string;
  // 기대한 출력, 내 출력 두 줄. placeholder 는 없는 줄이나 빈 줄이라 코드 대신 말로 보여 줌
  diff?: { label: string; text: string; placeholder: boolean }[];
  detail?: string;
};

// 없는 줄과 빈 줄은 눈에 안 보여서 말로 바꿔 보여 줌
function diffRow(label: string, line: string | null) {
  if (line === null) return { label, text: '(줄 없음)', placeholder: true };
  if (line === '') return { label, text: '(빈 줄)', placeholder: true };
  return { label, text: line, placeholder: false };
}

// 자바 에러는 첫 줄에 예외 이름과 이유가 나오고 그 아래는 호출 위치라 앞 세 줄을 보여 줌
// 파이썬 에러는 Traceback 뒤에 호출 위치가 먼저 나오고 맨 끝 줄이 에러 이름과 이유라 끝 세 줄을 보여 줌.
// Traceback 앞에 경고나 사용자가 찍은 stderr 가 있어도 끝 세 줄로 봄
function errorLines(text: string) {
  const all = text.trim().split('\n');
  const picked = all.some((l) => l.startsWith('Traceback (most recent call last)'))
    ? all.slice(-3)
    : all.slice(0, 3);
  const lines = picked.join('\n');
  return lines === '' ? undefined : lines;
}

function gradeViewOf(grade: CodeGrade): GradeView {
  switch (grade.outcome) {
    case 'right':
      return { tone: 'right', title: '맞았어요. 출력이 정답과 같아요' };
    case 'wrong':
      return {
        tone: 'wrong',
        title: `틀렸어요. ${grade.diff.line}번째 줄이 달라요`,
        diff: [diffRow('기대한 출력', grade.diff.expected), diffRow('내 출력', grade.diff.actual)],
      };
    case 'runError': {
      const overMemory = grade.stderr.includes(MEMORY_STOPPED);
      const why = grade.timedOut
        ? '5초가 넘게 걸려서 멈췄어요. 끝나지 않는 반복이 있는지 봐요'
        : overMemory
          ? '메모리를 너무 많이 써서 멈췄어요. 끝없이 커지는 목록이 있는지 봐요'
          : grade.outputCut
            ? '출력이 너무 많아서 멈췄어요. 끝나지 않는 반복이 있는지 봐요'
            : grade.exitCode === null
              ? '실행이 도중에 강제로 끝났어요'
              : '실행 중에 에러가 나서 멈췄어요';
      const detail = overMemory ? undefined : errorLines(grade.stderr);
      return { tone: 'wrong', title: `틀렸어요. ${why}`, detail };
    }
    case 'compileError': {
      // 파이썬은 경고와 에러를 줄 순서로 섞어 돌려줘서, 실행을 막은 에러를 먼저 고름
      const first = grade.diagnostics.find((d) => d.severity === 'error') ?? grade.diagnostics[0];
      return {
        tone: 'info',
        title: '먼저 빨간 밑줄을 고쳐 봐요',
        detail: first ? `${first.line}번째 줄: ${first.message}` : undefined,
      };
    }
    case 'failed':
      return { tone: 'info', title: grade.error };
  }
}

// 문제 카드 하나. 퀴즈 탭과 오답 노트가 같이 씀. 답이 바뀌면 새 답을 부모에게 알림
@Component({
  selector: 'app-question-card',
  imports: [
    CodeEditor,
    HlmBadgeImports,
    HlmButtonImports,
    HlmCardImports,
    HlmCheckboxImports,
    HlmTextareaImports,
    LucideCheck,
    LucideEye,
    LucideLightbulb,
    LucideLoaderCircle,
    LucidePlay,
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
        <span [id]="titleId()" class="font-semibold">
          @if (lectureLabel()) {
            <span class="sr-only">{{ lectureLabel() }} </span>
          }
          {{ q().n }}번 문제
        </span>
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
        @if (q().outputExample; as example) {
          <div class="flex flex-col gap-1" data-testid="quiz-output-example">
            <p class="text-sm font-semibold">출력 예</p>
            <pre class="run-output whitespace-pre-wrap">{{ example }}</pre>
          </div>
        }

        @if (q().kind === 'ox') {
          <div class="flex gap-2">
            @for (v of oxValues; track v) {
              <button
                hlmBtn
                variant="outline"
                size="lg"
                class="w-16 text-base"
                [attr.data-quiz-tone]="tone(v)"
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
                [attr.data-quiz-tone]="tone($index + 1)"
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
                [attr.data-quiz-tone]="tone($index + 1)"
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
            @if (codeLanguage(); as language) {
              <p class="text-sm font-medium">
                내 답
                <span class="font-normal text-muted-foreground"
                  >(코드로 써 보고, 오타는 밑줄로 알려 줘요)</span
                >
              </p>
              <app-code-editor
                [value]="answer().text"
                [label]="editorLabel()"
                [course]="language"
                [check]="check()"
                (valueChange)="set({ text: $event })"
              />
            } @else {
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
            }
            @if (noGrading()) {
              <p class="text-sm text-muted-foreground" data-testid="quiz-no-grading">
                이 문제는 출력이 사람마다 달라서 자동 채점을 안 해요. 정답 보기를 눌러 스스로
                체크해요.
              </p>
            }
            <div class="flex flex-wrap gap-2">
              @if (gradable()) {
                <button
                  hlmBtn
                  [disabled]="grading() || answer().text.trim() === ''"
                  [attr.aria-busy]="grading()"
                  (click)="gradeRequest.emit(answer().text)"
                >
                  @if (grading()) {
                    <svg lucideLoaderCircle [size]="16" class="animate-spin"></svg>
                    채점하는 중…
                  } @else {
                    <svg lucidePlay [size]="16"></svg>
                    {{ answer().grade ? '다시 채점하기' : '채점하기' }}
                  }
                </button>
              }
              @if (answer().hintsShown < hints().length) {
                <button
                  hlmBtn
                  variant="outline"
                  (click)="set({ hintsShown: answer().hintsShown + 1 })"
                >
                  <svg lucideLightbulb [size]="16"></svg>
                  힌트 보기 ({{ answer().hintsShown + 1 }}/{{ hints().length }})
                </button>
              }
              @if (!answer().revealed) {
                <button hlmBtn variant="outline" (click)="set({ revealed: true })">
                  <svg lucideEye [size]="16"></svg>
                  정답 보기
                </button>
              }
            </div>
          </div>

          @for (hint of shownHintsHtml(); track $index) {
            <div
              class="flex flex-col gap-1 rounded-lg border px-3 py-2"
              [attr.data-testid]="'quiz-hint-' + ($index + 1)"
            >
              <p class="text-sm font-semibold">힌트 {{ $index + 1 }}</p>
              <div class="ods-prose" [innerHTML]="hint"></div>
            </div>
          }

          @if (gradeView(); as g) {
            <div
              class="flex flex-col gap-2 border-t pt-3"
              data-testid="quiz-grade"
              aria-live="polite"
            >
              <p
                class="flex items-center gap-1 font-semibold"
                [class.quiz-right]="g.tone === 'right'"
                [class.quiz-wrong]="g.tone === 'wrong'"
              >
                @if (g.tone === 'right') {
                  <svg lucideCheck [size]="16"></svg>
                } @else if (g.tone === 'wrong') {
                  <svg lucideX [size]="16"></svg>
                }
                {{ g.title }}
              </p>
              @if (g.diff; as d) {
                <dl class="grid grid-cols-[auto_1fr] items-baseline gap-x-3 gap-y-1 text-sm">
                  @for (row of d; track row.label) {
                    <dt class="text-muted-foreground">{{ row.label }}</dt>
                    <dd class="ods-prose">
                      @if (row.placeholder) {
                        <span class="text-muted-foreground">{{ row.text }}</span>
                      } @else {
                        <code class="whitespace-pre-wrap">{{ row.text }}</code>
                      }
                    </dd>
                  }
                </dl>
              }
              @if (g.detail) {
                <pre
                  class="run-output whitespace-pre-wrap"
                  [class.run-output-error]="g.tone === 'wrong'"
                  >{{ g.detail }}</pre>
              }
              @if (gradeStale()) {
                <p class="text-sm text-muted-foreground">
                  채점한 뒤에 코드를 고쳤어요. 다시 채점해 봐요.
                </p>
              }
            </div>
          }
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
        }

        @if (selfCheck()) {
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-sm">{{
              gradedVerdict() ? '채점이 이상하면 직접 바꿔요:' : '스스로 체크해 봐요:'
            }}</span>
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
  // 오답 노트처럼 여러 강의 문제가 섞인 곳에서 화면 낭독기와 편집기 이름 앞에 붙이는 강의 이름(예: "03강"). 눈에 보이는 글은 그대로
  readonly lectureLabel = input('');
  // 코드로 답하는 문제의 오타 검사 결과. 검사는 부모가 맡음
  readonly check = input<CodeCheck | null>(null);
  // 채점하기를 눌러 서버 답을 기다리는 중. 채점은 부모가 맡고 결과는 answer.grade 로 돌아옴
  readonly grading = input(false);
  readonly answerChange = output<Answer>();
  // 채점하기를 누르면 그때 편집기 글을 내보냄
  readonly gradeRequest = output<string>();

  protected readonly empty = EMPTY_ANSWER;
  protected readonly oxValues = ['O', 'X'] as const;

  protected readonly titleId = computed(() => `${this.idPrefix()}-title-${this.q().n}`);
  protected readonly inputId = computed(() => `${this.idPrefix()}-answer-${this.q().n}`);
  protected readonly editorLabel = computed(() =>
    [this.lectureLabel(), `${this.q().n}번 문제 내 답 코드`].filter(Boolean).join(' '),
  );
  protected readonly auto = computed(() => isAuto(this.q()));
  protected readonly codeLanguage = computed(() => codeLanguageOf(this.q()));
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

  // 자동 채점은 실행 서버가 있는 과목의 코드 문제 중 예시 답안 출력이 있는 것만. 출력이 null 이면 채점할 수 없는 문제라 안내만 함
  private readonly runnable = computed(() => {
    const language = this.codeLanguage();
    return language !== null && isRunCourse(language);
  });
  protected readonly gradable = computed(
    () => this.runnable() && typeof this.q().expectedOutput === 'string',
  );
  protected readonly noGrading = computed(
    () => this.runnable() && this.q().expectedOutput === null,
  );
  protected readonly hints = computed(() => this.q().hints ?? []);
  protected readonly shownHintsHtml = computed(() =>
    this.hints().slice(0, this.answer().hintsShown).map(noteHtml),
  );
  protected readonly gradedVerdict = computed(() => {
    const grade = this.answer().grade;
    return grade ? gradeVerdict(grade) : null;
  });
  protected readonly gradeStale = computed(() => {
    const grade = this.answer().grade;
    return grade !== null && grade.source !== this.answer().text;
  });
  protected readonly gradeView = computed(() => {
    const grade = this.answer().grade;
    return grade ? gradeViewOf(grade) : null;
  });
  // 정답을 봤거나, 채점이 맞음/틀림을 낸 문제는 맞았어요/틀렸어요 버튼으로 기록을 직접 정하거나 바꿈
  protected readonly selfCheck = computed(
    () => !this.auto() && (this.answer().revealed || this.gradedVerdict() !== null),
  );

  // 채점 전엔 고른 줄만 진하게, 채점 뒤엔 정답 초록, 고른 오답 빨강, 나머지는 흐리게.
  // 잠긴 버튼의 흐림(opacity-50)이 흐림 class 를 이겨서, 색은 data 속성 + 층 밖 CSS 로 붙임
  protected tone(value: string | number): QuizTone | null {
    const a = this.answer();
    const picked = a.picked.includes(value);
    if (!a.graded) return picked ? 'picked' : null;
    if (this.q().correct.includes(value)) return 'right';
    if (picked) return 'wrong';
    return 'dim';
  }

  protected toggle(value: number, on: boolean) {
    const picked = this.answer().picked;
    this.set({ picked: on ? [...picked, value] : picked.filter((p) => p !== value) });
  }

  protected set(change: Partial<Answer>) {
    this.answerChange.emit({ ...this.answer(), ...change });
  }
}
