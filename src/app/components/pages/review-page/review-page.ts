import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  linkedSignal,
  resource,
  untracked,
} from '@angular/core';

import { courseOf } from '../../../config/courses';
import { isRunCourse, type CodeCheck } from '../../../core/run-api';
import { gradedAnswer, gradeOf } from '../../../domain/code-grade';
import type { CourseId } from '../../../domain/course';
import { resumeOf } from '../../../domain/course-summary';
import { SYNCED_COURSES, type Quiz, type QuizQuestion } from '../../../domain/lecture-content';
import { codeLanguageOf, EMPTY_ANSWER, verdictOf, type Answer } from '../../../domain/quiz-answer';
import { applyVerdict, wrongKey } from '../../../domain/quiz-record';
import { reviewGroups, reviewLectureIds, type LoadedQuiz } from '../../../domain/review-groups';
import { checkSnippet } from '../../../services/check-code';
import { CodeChecks } from '../../../services/code-checks';
import { contentPath, fetchContentText } from '../../../services/content-text';
import { ProgressService } from '../../../services/progress.service';
import { runSnippet } from '../../../services/run-code';
import { ReviewGroup } from '../../organisms/review-group/review-group';
import type { QuizAnswerChange, QuizGradeRequest } from '../../organisms/quiz-view/quiz-view';
import { ReviewTemplate, type ReviewView } from '../../templates/review-template/review-template';

// 오답 노트 화면. 열 때의 틀린 기록을 강의별로 묶어 다시 풀게 함. 맞히면 기록에서 빼고 틀리면 다시 넣음
// 최고 기록과 강의 끝내기는 퀴즈 탭에서 한 판을 풀어야 정해지므로 여기선 건드리지 않음
@Component({
  selector: 'app-review-page',
  imports: [ReviewTemplate, ReviewGroup],
  template: `
    <app-review-template [view]="view()" [quizLink]="quizLink()">
      <div reviewGroups class="contents">
        @for (group of groups(); track group.lecture.id) {
          @let state = byLecture()[group.lecture.id];
          <app-review-group
            [group]="group"
            [base]="base()"
            [answers]="state.answers"
            [checks]="state.checks"
            [grading]="state.grading"
            (answerChange)="saveAnswer(group.lecture.id, $event)"
            (gradeRequest)="gradeAnswer(group.lecture.id, $event)"
          />
        }
      </div>
    </app-review-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewPage {
  // 부모 라우트의 :course 가 input 으로 들어옴
  readonly courseId = input.required<CourseId>({ alias: 'course' });

  private readonly progress = inject(ProgressService);
  private readonly course = computed(() => courseOf(this.courseId()));
  protected readonly base = computed(() => '/' + this.courseId());
  private readonly data = computed(() => this.progress.progress(this.courseId())());
  private readonly synced = computed(() => SYNCED_COURSES.includes(this.courseId()));

  // 화면을 열 때의 틀린 기록을 붙잡아 둠. 여기서 맞혀도 카드가 그대로 남고, 과목이 바뀔 때만 다시 붙잡음
  private readonly opened = linkedSignal({
    source: this.courseId,
    computation: () => untracked(() => this.data().wrong),
  });
  private readonly lectureIds = computed(() => reviewLectureIds(this.course(), this.opened()));

  // 틀린 기록이 있는 강의의 퀴즈 파일만 불러옴. 하나를 못 불러와도 나머지는 보여 줌
  private readonly quizzes = resource({
    params: () => {
      const ids = this.lectureIds();
      return this.synced() && ids.length > 0 ? { course: this.courseId(), ids } : undefined;
    },
    loader: async ({ params, abortSignal }) => {
      const entries = await Promise.all(
        params.ids.map(async (id): Promise<[string, LoadedQuiz]> => {
          try {
            const text = await fetchContentText(
              contentPath(params.course, id, 'quiz.json'),
              abortSignal,
            );
            return [id, (JSON.parse(text) as Quiz).questions];
          } catch (e) {
            if (abortSignal.aborted) throw e;
            return [id, null];
          }
        }),
      );
      return Object.fromEntries(entries);
    },
  });

  protected readonly groups = computed(() =>
    this.quizzes.hasValue() ? reviewGroups(this.course(), this.opened(), this.quizzes.value()) : [],
  );
  protected readonly view = computed<ReviewView>(() => {
    if (!this.synced()) return 'none';
    if (this.lectureIds().length === 0) return 'empty';
    if (this.quizzes.isLoading()) return 'loading';
    return this.groups().length > 0 ? 'ready' : 'empty';
  });
  // 빈 화면 버튼은 마지막에 본 강의(없으면 첫 강의)의 퀴즈로 감. 붙잡지 않고 진도를 바로 따라감
  protected readonly quizLink = computed(() =>
    this.view() === 'none'
      ? null
      : `${this.base()}/lecture/${resumeOf(this.course(), this.data().lastLectureId).lecture.id}`,
  );

  // 풀던 답은 화면에만 둠. 답, 오타 검사, 채점 중 표시 모두 키는 "03-5". 다른 과목으로 가면 비움
  private readonly answers = linkedSignal<CourseId, Record<string, Answer>>({
    source: this.courseId,
    computation: () => ({}),
  });
  private readonly quizChecks = new CodeChecks<string>();
  private readonly grading = linkedSignal<CourseId, ReadonlySet<string>>({
    source: this.courseId,
    computation: () => new Set(),
  });
  // 묶음에는 강의별로 문제 번호 키로 나눠 넘김
  protected readonly byLecture = computed(() => {
    const answers = this.answers();
    const checks = this.quizChecks.results();
    const grading = this.grading();
    const byLecture: Record<string, LectureState> = {};
    for (const group of this.groups()) {
      const state = {
        answers: {} as Record<number, Answer>,
        checks: new Map<number, CodeCheck>(),
        grading: new Set<number>(),
      };
      for (const q of group.questions) {
        const key = wrongKey(group.lecture.id, q.n);
        if (answers[key]) state.answers[q.n] = answers[key];
        const check = checks.get(key);
        if (check) state.checks.set(q.n, check);
        if (grading.has(key)) state.grading.add(q.n);
      }
      byLecture[group.lecture.id] = state;
    }
    return byLecture;
  });

  constructor() {
    // 다른 과목으로 가거나 화면을 떠나면 앞 답의 검사를 멈추고 결과를 비움
    effect(() => {
      this.courseId();
      untracked(() => this.quizChecks.clear());
    });
    inject(DestroyRef).onDestroy(() => this.quizChecks.clear());
  }

  // 판정이 새로 나거나 바뀐 순간만 기록함. 글자 입력과 다시 풀기는 기록을 건드리지 않음
  protected saveAnswer(lectureId: string, { q, answer }: QuizAnswerChange) {
    const key = wrongKey(lectureId, q.n);
    const before = this.answers()[key] ?? EMPTY_ANSWER;
    this.answers.update((a) => ({ ...a, [key]: answer }));
    this.requestCheck(key, q, answer.text, before.text);
    const verdict = verdictOf(q, answer);
    if (!verdict || verdict === verdictOf(q, before)) return;
    const at = new Date().toISOString();
    this.progress.update(this.courseId(), (d) => applyVerdict(d, lectureId, q.n, verdict, at));
  }

  // 코드로 답하는 문제에서 글이 바뀌었을 때만 검사함. 실행 서버가 없는 과목은 밑줄 없이 둠
  private requestCheck(key: string, q: QuizQuestion, text: string, beforeText: string) {
    const language = codeLanguageOf(q);
    if (!language || !isRunCourse(language) || text === beforeText) return;
    this.quizChecks.request(key, text, (source, signal) =>
      checkSnippet({ course: language, source }, signal),
    );
  }

  // 서버가 돌린 출력을 예시 답안 출력과 비교해 답에 붙임. 맞음/틀림만 기록하고 최고 기록은 건드리지 않음
  // 기다리는 사이 다른 과목으로 갔거나 다시 풀기로 답을 비웠으면 늦게 온 결과는 버림
  protected async gradeAnswer(lectureId: string, { q, source }: QuizGradeRequest) {
    const course = this.courseId();
    const expected = q.expectedOutput;
    const language = codeLanguageOf(q);
    if (typeof expected !== 'string' || !language || !isRunCourse(language)) return;
    const key = wrongKey(lectureId, q.n);
    this.grading.update((s) => new Set(s).add(key));
    const res = await runSnippet({ course: language, source });
    if (this.courseId() !== course) return;
    this.grading.update((s) => new Set([...s].filter((k) => k !== key)));
    const before = this.answers()[key];
    if (!before || before === EMPTY_ANSWER) return;
    this.saveAnswer(lectureId, { q, answer: gradedAnswer(before, gradeOf(expected, source, res)) });
  }
}

// 강의 하나 묶음에 넘기는 값. 키는 문제 번호
type LectureState = {
  answers: Readonly<Record<number, Answer>>;
  checks: ReadonlyMap<number, CodeCheck>;
  grading: ReadonlySet<number>;
};
