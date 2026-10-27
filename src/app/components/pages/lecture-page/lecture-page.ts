import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  resource,
  untracked,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { courseOf } from '../../../config/courses';
import { findLecture, type CourseId } from '../../../domain/course';
import { isRunCourse, type CodeFile } from '../../../core/run-api';
import {
  SYNCED_COURSES,
  type Frame,
  type Quiz,
  type QuizQuestion,
  type TranscriptLine,
} from '../../../domain/lecture-content';
import { applyCheck, applyVisit, isChecked, missingFor } from '../../../domain/lecture-progress';
import { lectureContext, tabOf, type LectureTab } from '../../../domain/lecture-view';
import { noteHtml } from '../../../domain/note-markdown';
import { gradedAnswer, gradeOf } from '../../../domain/code-grade';
import { codeLanguageOf, EMPTY_ANSWER, verdictOf, type Answer } from '../../../domain/quiz-answer';
import { applyBest, applyVerdict, quizBestOf, wrongKey } from '../../../domain/quiz-record';
import { checkCode, checkSnippet } from '../../../services/check-code';
import { CodeChecks } from '../../../services/code-checks';
import { contentPath, fetchContentText } from '../../../services/content-text';
import { ProgressService } from '../../../services/progress.service';
import { runCode, runSnippet } from '../../../services/run-code';
import { LectureChecks, type CheckChange } from '../../molecules/lecture-checks/lecture-checks';
import { LectureNav } from '../../molecules/lecture-nav/lecture-nav';
import {
  CodeView,
  type CodeListStatus,
  type CodeRunRequest,
  type CodeSourceStatus,
  type LiveRun,
} from '../../organisms/code-view/code-view';
import { MaterialView, type MaterialStatus } from '../../organisms/material-view/material-view';
import { NoteView, type NoteStatus } from '../../organisms/note-view/note-view';
import {
  QuizView,
  type QuizAnswerChange,
  type QuizGradeRequest,
  type QuizStatus,
} from '../../organisms/quiz-view/quiz-view';
import { LectureTemplate } from '../../templates/lecture-template/lecture-template';

// 강의 화면. 주소의 과목, 강의 번호, 탭 이름으로 화면을 그리고 진도 체크를 저장함
@Component({
  selector: 'app-lecture-page',
  imports: [LectureTemplate, LectureChecks, LectureNav, NoteView, QuizView, CodeView, MaterialView],
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
          [checks]="quizChecks.results()"
          [grading]="grading()"
          (answerChange)="saveAnswer($event)"
          (gradeRequest)="gradeAnswer($event)"
          (resetAll)="resetQuiz()"
        />
        <app-code-view
          tabCode
          [course]="courseId()"
          [status]="codeStatus()"
          [files]="codeFiles()"
          [file]="codeFile()?.file"
          [sourceStatus]="sourceStatus()"
          [source]="source()"
          [running]="running()"
          [live]="live()"
          [runError]="runError()"
          [check]="codeCheck()"
          (fileChange)="selectFile($event)"
          (run)="runFile($event)"
          (codeChange)="requestCodeCheck($event)"
          (reset)="clearRun()"
        />
        <app-material-view
          tabMaterial
          [status]="materialStatus()"
          [course]="courseId()"
          [lectureId]="lecture.id"
          [frames]="frames()"
          [lines]="transcript()"
        />
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
  // 부모 라우트의 :course, 이 라우트의 :id, 주소 뒤 ?tab= 와 ?file= 이 input 으로 들어옴
  readonly courseId = input.required<CourseId>({ alias: 'course' });
  readonly id = input<string>();
  readonly tab = input<string>();
  readonly file = input<string>();

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

  // 퀴즈 코드 답의 오타 검사. 문제 번호마다 입력이 멈추면 서버에 물음
  protected readonly quizChecks = new CodeChecks<number>();
  // 채점 결과를 기다리는 문제 번호. 다른 강의로 가면 비움
  protected readonly grading = linkedSignal<string | undefined, ReadonlySet<number>>({
    source: () => this.lecture()?.id,
    computation: () => new Set(),
  });

  // 코드 탭. 실행 서버가 있는 과목만 예제 목록을 불러옴. 파이썬은 아직 예제가 없음
  private readonly runnable = computed(() => this.synced() && isRunCourse(this.courseId()));
  private readonly codeList = resource({
    params: () => {
      const lecture = this.lecture();
      return lecture && this.runnable()
        ? contentPath(this.courseId(), lecture.id, 'code.json')
        : undefined;
    },
    loader: async ({ params, abortSignal }) =>
      JSON.parse(await fetchContentText(params, abortSignal)) as CodeFile[],
  });
  protected readonly codeStatus = computed<CodeListStatus>(() => {
    if (!this.runnable()) return 'none';
    const status = this.codeList.status();
    if (status === 'error') return 'error';
    return status === 'resolved' || status === 'local' ? 'ready' : 'loading';
  });
  protected readonly codeFiles = computed(() =>
    this.codeStatus() === 'ready' && this.codeList.hasValue() ? this.codeList.value() : [],
  );
  // 주소의 파일 이름이 목록에 없으면 첫 파일
  protected readonly codeFile = computed(() => {
    const files = this.codeFiles();
    return files.find((f) => f.file === this.file()) ?? files[0];
  });
  private readonly codeSource = resource({
    params: () => {
      const lecture = this.lecture();
      const code = this.codeFile();
      return lecture && code
        ? contentPath(this.courseId(), lecture.id, `code/${code.file}`)
        : undefined;
    },
    loader: ({ params, abortSignal }) => fetchContentText(params, abortSignal),
  });
  protected readonly sourceStatus = computed<CodeSourceStatus>(() => {
    const status = this.codeSource.status();
    if (status === 'error') return 'error';
    return status === 'resolved' || status === 'local' ? 'ready' : 'loading';
  });
  protected readonly source = computed(() =>
    this.sourceStatus() === 'ready' && this.codeSource.hasValue() ? this.codeSource.value() : '',
  );

  // 강의와 파일을 합친 이름. 이 값이 바뀌면 실행 결과와 오타 검사를 비움
  private readonly codeKey = computed(() => `${this.lecture()?.id}/${this.codeFile()?.file}`);
  protected readonly running = linkedSignal({ source: this.codeKey, computation: () => false });
  protected readonly live = linkedSignal<string, LiveRun | null>({
    source: this.codeKey,
    computation: () => null,
  });
  protected readonly runError = linkedSignal<string, string | null>({
    source: this.codeKey,
    computation: () => null,
  });

  // 코드 탭 편집기의 오타 검사. 같은 강의 다른 파일과 같이 컴파일하므로 결과 중 지금 파일 에러만 넘김
  protected readonly codeChecks = new CodeChecks<string>();
  protected readonly codeCheck = computed(() => {
    const check = this.codeChecks.results().get(this.codeKey());
    const file = this.codeFile()?.file;
    return check
      ? { ...check, diagnostics: check.diagnostics.filter((d) => d.file === file) }
      : null;
  });

  // 강의 자료 탭. 화면 캡처 목록과 받아쓰기를 같이 불러오고, 둘 중 하나라도 실패하면 실패로 봄
  private readonly framesData = resource({
    params: () => {
      const lecture = this.lecture();
      return lecture && this.synced()
        ? contentPath(this.courseId(), lecture.id, 'frames.json')
        : undefined;
    },
    loader: async ({ params, abortSignal }) =>
      JSON.parse(await fetchContentText(params, abortSignal)) as Frame[],
  });
  private readonly transcriptData = resource({
    params: () => {
      const lecture = this.lecture();
      return lecture && this.synced()
        ? contentPath(this.courseId(), lecture.id, 'transcript.json')
        : undefined;
    },
    loader: async ({ params, abortSignal }) =>
      JSON.parse(await fetchContentText(params, abortSignal)) as TranscriptLine[],
  });
  protected readonly materialStatus = computed<MaterialStatus>(() => {
    if (!this.synced()) return 'none';
    const statuses = [this.framesData.status(), this.transcriptData.status()];
    if (statuses.includes('error')) return 'error';
    return statuses.every((s) => s === 'resolved' || s === 'local') ? 'ready' : 'loading';
  });
  protected readonly frames = computed(() =>
    this.materialStatus() === 'ready' && this.framesData.hasValue() ? this.framesData.value() : [],
  );
  protected readonly transcript = computed(() =>
    this.materialStatus() === 'ready' && this.transcriptData.hasValue()
      ? this.transcriptData.value()
      : [],
  );

  constructor() {
    // 다른 강의로 가면 앞 강의 답의 검사를 멈추고 결과를 비움
    effect(() => {
      this.lecture();
      untracked(() => this.quizChecks.clear());
    });
    // 다른 파일이나 강의로 가면 앞 파일의 검사를 멈추고 결과를 비움
    effect(() => {
      this.codeKey();
      untracked(() => this.codeChecks.clear());
    });
    inject(DestroyRef).onDestroy(() => {
      this.quizChecks.clear();
      this.codeChecks.clear();
    });
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
    this.requestCheck(q, answer.text, before.text);
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

  // 코드로 답하는 문제에서 글이 바뀌었을 때만 검사함. 실행 서버가 아직 없는 과목(파이썬)은 밑줄 없이 둠
  private requestCheck(q: QuizQuestion, text: string, beforeText: string) {
    const language = codeLanguageOf(q);
    if (!language || !isRunCourse(language) || text === beforeText) return;
    this.quizChecks.request(q.n, text, (source, signal) =>
      checkSnippet({ course: language, source }, signal),
    );
  }

  // 서버가 돌린 출력을 예시 답안 출력과 비교해 답에 붙임. 맞음/틀림이 나면 스스로 체크처럼 기록함(사용자가 바꿀 수 있음)
  // 기다리는 사이 다른 강의로 갔거나 다시 풀기로 답을 비웠으면 늦게 온 결과는 버림
  protected async gradeAnswer({ q, source }: QuizGradeRequest) {
    const lecture = this.lecture();
    const expected = q.expectedOutput;
    const language = codeLanguageOf(q);
    if (!lecture || typeof expected !== 'string' || !language || !isRunCourse(language)) return;
    this.grading.update((s) => new Set(s).add(q.n));
    const res = await runSnippet({ course: language, source });
    if (this.lecture()?.id !== lecture.id) return;
    this.grading.update((s) => new Set([...s].filter((n) => n !== q.n)));
    const before = this.answers()[q.n];
    if (!before || before === EMPTY_ANSWER) return;
    this.saveAnswer({ q, answer: gradedAnswer(before, gradeOf(expected, source, res)) });
  }

  protected resetQuiz() {
    this.answers.set({});
    this.quizChecks.clear();
  }

  // 실행 중에 다른 파일로 가면 늦게 온 결과는 버림
  protected async runFile({ source, stdin }: CodeRunRequest) {
    const lecture = this.lecture();
    const code = this.codeFile();
    const course = this.courseId();
    if (!lecture || !code || !isRunCourse(course)) return;
    const key = this.codeKey();
    this.running.set(true);
    this.runError.set(null);
    const result = await runCode({ course, lectureId: lecture.id, file: code.file, source, stdin });
    if (this.codeKey() !== key) return;
    if (result.ok) this.live.set({ source, result });
    else this.runError.set(result.error);
    this.running.set(false);
  }

  protected clearRun() {
    this.live.set(null);
    this.runError.set(null);
  }

  protected requestCodeCheck(source: string) {
    const lecture = this.lecture();
    const code = this.codeFile();
    const course = this.courseId();
    if (!lecture || !code || !isRunCourse(course)) return;
    this.codeChecks.request(this.codeKey(), source, (text, signal) =>
      checkCode({ course, lectureId: lecture.id, file: code.file, source: text }, signal),
    );
  }

  protected selectFile(file: string) {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: 'code', file },
      replaceUrl: true,
    });
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
