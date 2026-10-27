import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideArrowRight } from '@lucide/angular';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';

import type { CodeCheck } from '../../../core/run-api';
import { EMPTY_ANSWER, type Answer } from '../../../domain/quiz-answer';
import type { ReviewGroup as Group } from '../../../domain/review-groups';
import { QuestionCard } from '../question-card/question-card';
import type { QuizAnswerChange, QuizGradeRequest } from '../quiz-view/quiz-view';

// 오답 노트의 강의 하나 묶음. 제목 줄과 그 강의 퀴즈로 가는 링크, 틀린 문제 카드들. 답과 기록은 이 컴포넌트를 쓰는 부모가 들고 있음
@Component({
  selector: 'app-review-group',
  imports: [HlmButtonImports, HlmEmptyImports, LucideArrowRight, QuestionCard, RouterLink],
  template: `
    <section
      class="flex flex-col gap-4"
      [attr.aria-labelledby]="headingId()"
      [attr.data-testid]="'review-group-' + lectureId()"
    >
      <div class="flex flex-wrap items-center justify-between gap-2">
        <h2 [id]="headingId()" class="text-base font-semibold">
          {{ lectureId() }}강. {{ group().lecture.title }}
          @if (!group().failed) {
            · {{ group().questions.length }}문제
          }
        </h2>
        <a
          hlmBtn
          variant="ghost"
          size="sm"
          [routerLink]="base() + '/lecture/' + lectureId()"
          [queryParams]="{ tab: 'quiz' }"
        >
          이 강의 퀴즈로 가기
          <svg lucideArrowRight [size]="14"></svg>
        </a>
      </div>
      @if (group().failed) {
        <div hlmEmpty class="border" [attr.data-testid]="'review-error-' + lectureId()">
          <div hlmEmptyHeader>
            <h3 hlmEmptyTitle>퀴즈를 못 불러왔어요</h3>
            <p hlmEmptyDescription>터미널에서 <code>npm run sync</code> 를 먼저 돌려 주세요.</p>
          </div>
        </div>
      } @else {
        @for (q of group().questions; track q.n) {
          <app-question-card
            [q]="q"
            [answer]="answers()[q.n] ?? empty"
            [idPrefix]="'review-' + lectureId()"
            [lectureLabel]="lectureId() + '강'"
            [check]="checks().get(q.n) ?? null"
            [grading]="grading().has(q.n)"
            (answerChange)="answerChange.emit({ q, answer: $event })"
            (gradeRequest)="gradeRequest.emit({ q, source: $event })"
          />
        }
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewGroup {
  readonly group = input.required<Group>();
  // 과목 주소 앞부분. 예: /java
  readonly base = input.required<string>();
  // 이 강의 문제 번호 → 답. 아직 손대지 않은 문제는 없음
  readonly answers = input<Readonly<Record<number, Answer>>>({});
  // 문제 번호 → 코드 답의 오타 검사 결과
  readonly checks = input<ReadonlyMap<number, CodeCheck>>(new Map());
  // 채점 결과를 기다리는 문제 번호
  readonly grading = input<ReadonlySet<number>>(new Set());
  readonly answerChange = output<QuizAnswerChange>();
  readonly gradeRequest = output<QuizGradeRequest>();

  protected readonly empty = EMPTY_ANSWER;
  protected readonly lectureId = computed(() => this.group().lecture.id);
  protected readonly headingId = computed(() => `review-heading-${this.lectureId()}`);
}
