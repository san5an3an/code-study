import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  resource,
  untracked,
} from '@angular/core';

import { courseOf } from '../../../config/courses';
import type { CourseId } from '../../../domain/course';
import { resumeOf } from '../../../domain/course-summary';
import { SYNCED_COURSES, type Quiz } from '../../../domain/lecture-content';
import { EMPTY_ANSWER, verdictOf, type Answer } from '../../../domain/quiz-answer';
import { applyVerdict, wrongKey } from '../../../domain/quiz-record';
import { reviewGroups, reviewLectureIds, type LoadedQuiz } from '../../../domain/review-groups';
import { contentPath, fetchContentText } from '../../../services/content-text';
import { ProgressService } from '../../../services/progress.service';
import { ReviewGroup } from '../../organisms/review-group/review-group';
import type { QuizAnswerChange } from '../../organisms/quiz-view/quiz-view';
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
          <app-review-group
            [group]="group"
            [base]="base()"
            [answers]="answersByLecture()[group.lecture.id] ?? noAnswers"
            (answerChange)="saveAnswer(group.lecture.id, $event)"
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
  protected readonly noAnswers: Readonly<Record<number, Answer>> = {};

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

  // 풀던 답은 화면에만 둠. 키는 "03-5". 다른 과목으로 가면 비움
  private readonly answers = linkedSignal<CourseId, Record<string, Answer>>({
    source: this.courseId,
    computation: () => ({}),
  });
  protected readonly answersByLecture = computed(() => {
    const byLecture: Record<string, Record<number, Answer>> = {};
    for (const group of this.groups()) {
      const answers: Record<number, Answer> = {};
      for (const q of group.questions) {
        const a = this.answers()[wrongKey(group.lecture.id, q.n)];
        if (a) answers[q.n] = a;
      }
      byLecture[group.lecture.id] = answers;
    }
    return byLecture;
  });

  // 판정이 새로 나거나 바뀐 순간만 기록함. 글자 입력과 다시 풀기는 기록을 건드리지 않음
  protected saveAnswer(lectureId: string, { q, answer }: QuizAnswerChange) {
    const key = wrongKey(lectureId, q.n);
    const before = this.answers()[key] ?? EMPTY_ANSWER;
    this.answers.update((a) => ({ ...a, [key]: answer }));
    const verdict = verdictOf(q, answer);
    if (!verdict || verdict === verdictOf(q, before)) return;
    const at = new Date().toISOString();
    this.progress.update(this.courseId(), (d) => applyVerdict(d, lectureId, q.n, verdict, at));
  }
}
