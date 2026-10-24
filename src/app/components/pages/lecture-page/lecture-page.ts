import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  resource,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { courseOf } from '../../../config/courses';
import { findLecture, type CourseId } from '../../../domain/course';
import { SYNCED_COURSES, type Quiz } from '../../../domain/lecture-content';
import { applyCheck, applyVisit, isChecked, missingFor } from '../../../domain/lecture-progress';
import { lectureContext, tabOf, type LectureTab } from '../../../domain/lecture-view';
import { noteHtml } from '../../../domain/note-markdown';
import { EMPTY_ANSWER, verdictOf, type Answer } from '../../../domain/quiz-answer';
import { applyBest, applyVerdict, quizBestOf, wrongKey } from '../../../domain/quiz-record';
import { contentPath, fetchContentText } from '../../../services/content-text';
import { ProgressService } from '../../../services/progress.service';
import { LectureChecks, type CheckChange } from '../../molecules/lecture-checks/lecture-checks';
import { LectureNav } from '../../molecules/lecture-nav/lecture-nav';
import { NoteView, type NoteStatus } from '../../organisms/note-view/note-view';
import {
  QuizView,
  type QuizAnswerChange,
  type QuizStatus,
} from '../../organisms/quiz-view/quiz-view';
import { LectureTemplate } from '../../templates/lecture-template/lecture-template';

// 강의 화면. 주소의 과목, 강의 번호, 탭 이름으로 화면을 그리고 진도 체크를 저장함
@Component({
  selector: 'app-lecture-page',
  imports: [LectureTemplate, LectureChecks, LectureNav, NoteView, QuizView],
  template: `
    @if (lecture(); as lecture) {
      <app-lecture-template
        [partLabel]="partLabel()"
        [title]="lecture.id + '강. ' + lecture.title"
        [tab]="currentTab()"
        (tabChange)="selectTab($event)"
      >
        <app-lecture-checks
          lectureChecks
          [checked]="checked()"
          [missing]="missing()"
          (checkChange)="saveCheck($event)"
        />
        <app-note-view tabNote [status]="noteStatus()" [html]="noteHtml()" />
        <app-quiz-view
          tabQuiz
          [status]="quizStatus()"
          [questions]="questions()"
          [answers]="answers()"
          [best]="quizBest()"
          [inReview]="inReview()"
          (answerChange)="saveAnswer($event)"
          (resetAll)="answers.set({})"
        />
        <p tabCode class="text-muted-foreground">코드 탭은 옮기는 중이에요.</p>
        <p tabMaterial class="text-muted-foreground">강의 자료 탭은 옮기는 중이에요.</p>
        <app-lecture-nav
          lectureNav
          [prev]="context()?.prev"
          [next]="context()?.next"
          [base]="base()"
        />
      </app-lecture-template>
    } @else {
      <h1 class="text-xl font-semibold">없는 강의예요</h1>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LecturePage {
  // 부모 라우트의 :course, 이 라우트의 :id, 주소 뒤 ?tab= 이 input 으로 들어옴
  readonly courseId = input.required<CourseId>({ alias: 'course' });
  readonly id = input<string>();
  readonly tab = input<string>();

  private readonly progress = inject(ProgressService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly course = computed(() => courseOf(this.courseId()));
  protected readonly base = computed(() => '/' + this.courseId());
  protected readonly lecture = computed(() => findLecture(this.course(), this.id()));
  protected readonly context = computed(() => {
    const lecture = this.lecture();
    return lecture ? lectureContext(this.course(), lecture) : undefined;
  });
  protected readonly partLabel = computed(() => {
    const part = this.context()?.part;
    return part ? `${part.id}부. ${part.title}` : '';
  });
  protected readonly currentTab = computed(() => tabOf(this.tab()));

  private readonly data = computed(() => this.progress.progress(this.courseId())());
  protected readonly checked = computed(() => {
    const id = this.id() ?? '';
    return {
      videoWatched: isChecked(this.data(), id, 'videoWatched'),
      noteRead: isChecked(this.data(), id, 'noteRead'),
    };
  });
  protected readonly missing = computed(() => missingFor(this.data(), this.id() ?? ''));

  private readonly synced = computed(() => SYNCED_COURSES.includes(this.courseId()));
  // 강의가 바뀌면 resource 가 앞 요청을 취소하고 새 노트를 불러옴
  private readonly note = resource({
    params: () => {
      const lecture = this.lecture();
      return lecture && this.synced()
        ? contentPath(this.courseId(), lecture.id, 'note.md')
        : undefined;
    },
    loader: ({ params, abortSignal }) => fetchContentText(params, abortSignal),
  });
  protected readonly noteStatus = computed<NoteStatus>(() => {
    if (!this.synced()) return 'none';
    const status = this.note.status();
    if (status === 'error') return 'error';
    return status === 'resolved' || status === 'local' ? 'ready' : 'loading';
  });
  protected readonly noteHtml = computed(() =>
    this.noteStatus() === 'ready' && this.note.hasValue() ? noteHtml(this.note.value()) : '',
  );

  private readonly quiz = resource({
    params: () => {
      const lecture = this.lecture();
      return lecture && this.synced()
        ? contentPath(this.courseId(), lecture.id, 'quiz.json')
        : undefined;
    },
    loader: async ({ params, abortSignal }) =>
      JSON.parse(await fetchContentText(params, abortSignal)) as Quiz,
  });
  protected readonly quizStatus = computed<QuizStatus>(() => {
    if (!this.synced()) return 'none';
    const status = this.quiz.status();
    if (status === 'error') return 'error';
    return status === 'resolved' || status === 'local' ? 'ready' : 'loading';
  });
  protected readonly questions = computed(() =>
    this.quizStatus() === 'ready' && this.quiz.hasValue() ? this.quiz.value().questions : [],
  );
  // 풀던 답은 화면에만 둠. 다른 강의로 가면 비움
  protected readonly answers = linkedSignal<string | undefined, Record<number, Answer>>({
    source: () => this.lecture()?.id,
    computation: () => ({}),
  });
  protected readonly quizBest = computed(() => quizBestOf(this.data(), this.id() ?? ''));
  protected readonly inReview = computed(() =>
    this.questions()
      .filter((q) => wrongKey(this.id() ?? '', q.n) in this.data().wrong)
      .map((q) => q.n),
  );

  constructor() {
    // 강의를 열면 홈의 "이어서 하기"가 이 강의를 가리키게 저장함
    effect(() => {
      const lecture = this.lecture();
      if (lecture) this.progress.update(this.courseId(), (d) => applyVisit(d, lecture.id));
    });
  }

  protected saveCheck({ key, on }: CheckChange) {
    const lecture = this.lecture();
    if (lecture) this.progress.update(this.courseId(), (d) => applyCheck(d, lecture.id, key, on));
  }

  // 판정이 새로 나거나 바뀐 순간만 기록함. 글자 입력과 다시 풀기는 기록을 건드리지 않음
  protected saveAnswer({ q, answer }: QuizAnswerChange) {
    const lecture = this.lecture();
    const before = this.answers()[q.n] ?? EMPTY_ANSWER;
    const next = { ...this.answers(), [q.n]: answer };
    this.answers.set(next);
    const verdict = verdictOf(q, answer);
    if (!lecture || !verdict || verdict === verdictOf(q, before)) return;
    const questions = this.questions();
    const right = questions.filter(
      (x) => verdictOf(x, next[x.n] ?? EMPTY_ANSWER) === 'right',
    ).length;
    const at = new Date().toISOString();
    this.progress.update(this.courseId(), (d) =>
      applyBest(
        applyVerdict(d, lecture.id, q.n, verdict, at),
        lecture.id,
        right,
        questions.length,
        at,
      ),
    );
  }

  // 기본 탭(노트)은 주소에 붙이지 않음. 탭을 바꿀 때마다 뒤로 가기 기록이 쌓이지 않도록 지금 주소를 바꿔 씀
  protected selectTab(tab: LectureTab) {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: tab === 'note' ? {} : { tab },
      replaceUrl: true,
    });
  }
}
