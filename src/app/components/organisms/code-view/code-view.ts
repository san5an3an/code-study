import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import { LucideLoaderCircle, LucidePlay, LucideRotateCcw } from '@lucide/angular';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';

import type { CodeCheck, CodeFile, CodeRun, RunResponse } from '../../../core/run-api';
import type { CourseId } from '../../../domain/course';
import { CodeEditor } from '../../atoms/code-editor/code-editor';

export type CodeListStatus = 'loading' | 'error' | 'none' | 'ready';
export type CodeSourceStatus = 'loading' | 'error' | 'ready';

// 방금 실행한 결과와 그때 보낸 코드 글
export type LiveRun = { source: string; result: Extract<RunResponse, { ok: true }> };

export type CodeRunRequest = { source: string; stdin: string };

// 코드 탭 화면. 예제 파일 탭, 편집기, 입력값 칸, 실행 결과. 고친 코드와 입력값은 이 컴포넌트가 들고,
// 파일 불러오기, 실행, 오타 검사는 이 컴포넌트를 쓰는 부모가 맡음. 파일을 바꾸면 고친 코드는 버림
@Component({
  selector: 'app-code-view',
  imports: [
    CodeEditor,
    HlmAlertImports,
    HlmButtonImports,
    HlmEmptyImports,
    HlmSkeletonImports,
    HlmTabsImports,
    HlmTextareaImports,
    LucideLoaderCircle,
    LucidePlay,
    LucideRotateCcw,
  ],
  template: `
    @switch (view()) {
      @case ('loading') {
        <div class="flex flex-col gap-2" aria-busy="true" aria-label="예제 목록 불러오는 중">
          <hlm-skeleton class="h-4 w-2/3" />
          <hlm-skeleton class="h-4 w-1/2" />
        </div>
      }
      @case ('error') {
        <div hlmEmpty class="border" data-testid="code-error">
          <div hlmEmptyHeader>
            <h3 hlmEmptyTitle>예제 코드를 못 불러왔어요</h3>
            <p hlmEmptyDescription>터미널에서 <code>npm run sync</code> 를 먼저 돌려 주세요.</p>
          </div>
        </div>
      }
      @case ('none') {
        <div hlmEmpty class="border" data-testid="code-none">
          <div hlmEmptyHeader>
            <h3 hlmEmptyTitle>코드 탭은 준비 중이에요</h3>
            <p hlmEmptyDescription>
              이 과목은 코드 실행을 아직 붙이지 않았어요. 예제 코드는 노트에서 볼 수 있어요.
            </p>
          </div>
        </div>
      }
      @case ('ready') {
        <div class="flex flex-col gap-4">
          <hlm-tabs [tab]="current()?.file ?? ''" (tabActivated)="fileChange.emit($event)">
            <hlm-tabs-list
              variant="line"
              aria-label="예제 파일"
              class="max-w-full justify-start overflow-x-auto"
            >
              @for (f of files(); track f.file) {
                <button [hlmTabsTrigger]="f.file" class="flex-none">{{ f.file }}</button>
              }
            </hlm-tabs-list>
          </hlm-tabs>

          @if (current(); as code) {
            @switch (sourceStatus()) {
              @case ('loading') {
                <div class="flex flex-col gap-2" aria-busy="true" aria-label="코드 불러오는 중">
                  <hlm-skeleton class="h-4 w-2/3" />
                  <hlm-skeleton class="h-4 w-1/2" />
                </div>
              }
              @case ('error') {
                <div hlmEmpty class="border" data-testid="code-error">
                  <div hlmEmptyHeader>
                    <h3 hlmEmptyTitle>예제 코드를 못 불러왔어요</h3>
                    <p hlmEmptyDescription>
                      터미널에서 <code>npm run sync</code> 를 먼저 돌려 주세요.
                    </p>
                  </div>
                </div>
              }
              @case ('ready') {
                <!-- 파일마다 편집기를 새로 만들어 앞 파일의 고친 글, 되돌리기 기록이 섞이지 않게 함 -->
                @for (key of [code.file]; track key) {
                  <app-code-editor
                    [value]="currentText()"
                    [label]="code.file + ' 코드'"
                    [course]="course()"
                    [check]="check()"
                    (valueChange)="edit($event)"
                  />
                }

                @if (code.hasMain) {
                  <div class="flex flex-col gap-2">
                    <label [for]="stdinId()" class="text-sm font-medium">
                      입력값
                      <span class="font-normal text-muted-foreground"
                        >(Scanner 로 받을 값, 한 줄에 하나)</span
                      >
                    </label>
                    <textarea
                      hlmTextarea
                      class="font-mono"
                      rows="2"
                      placeholder="입력이 필요 없으면 비워 두세요"
                      [id]="stdinId()"
                      [value]="stdin()"
                      (input)="stdin.set($any($event.target).value)"
                    ></textarea>
                  </div>
                }

                <section class="flex flex-col gap-2" aria-labelledby="run-result-heading">
                  <div class="flex flex-wrap items-center justify-between gap-2">
                    <h2 id="run-result-heading" class="text-sm font-semibold">
                      {{ live() ? '방금 실행한 결과' : '미리 돌려 둔 결과' }}
                    </h2>
                    <div class="flex gap-2">
                      @if (edited() || live()) {
                        <button hlmBtn variant="outline" size="sm" (click)="resetAll()">
                          <svg lucideRotateCcw [size]="16"></svg>
                          원래대로
                        </button>
                      }
                      @if (code.hasMain) {
                        <button
                          hlmBtn
                          size="sm"
                          [disabled]="running()"
                          (click)="run.emit({ source: currentText(), stdin: stdin() })"
                        >
                          @if (running()) {
                            <svg lucideLoaderCircle [size]="16" class="animate-spin"></svg>
                            실행 중…
                          } @else {
                            <svg lucidePlay [size]="16"></svg>
                            실행
                          }
                        </button>
                      }
                    </div>
                  </div>

                  @if (runError(); as error) {
                    <div hlmAlert variant="destructive">
                      <p hlmAlertDescription data-testid="run-error">{{ error }}</p>
                    </div>
                  }
                  @if (staleAfterRun()) {
                    <div hlmAlert>
                      <p hlmAlertDescription>
                        실행한 뒤에 코드를 또 고쳤어요. 아래 결과는 고치기 전 코드예요.
                      </p>
                    </div>
                  }
                  @if (!live() && edited()) {
                    <div hlmAlert>
                      <p hlmAlertDescription>
                        코드를 고쳤어요. 실행을 누르면 고친 코드로 돌려요. 아래는 원래 코드의
                        결과예요.
                      </p>
                    </div>
                  }

                  @switch (result().kind) {
                    @case ('no-main') {
                      <p class="text-muted-foreground">
                        혼자 실행하는 파일이 아니에요. 같은 강의의 다른 예제가 이 파일을 가져다
                        써요.
                      </p>
                    }
                    @case ('compile-error') {
                      <p class="run-status-error">
                        컴파일 에러라 실행하지 않았어요. 아래 에러 줄 번호를 확인해 보세요.
                      </p>
                      <pre class="run-output run-output-error" data-testid="compile-error">{{
                        compileText()
                      }}</pre>
                    }
                    @case ('none') {
                      <p class="text-muted-foreground">
                        미리 돌려 둔 결과가 없어요. 실행을 눌러 보세요.
                      </p>
                    }
                    @case ('run') {
                      @if (shownRun(); as run) {
                        <div class="flex flex-col gap-2">
                          @if (run.stdout) {
                            <pre class="run-output" data-testid="run-stdout">{{ run.stdout }}</pre>
                          }
                          @if (run.stderr) {
                            <pre class="run-output run-output-error" data-testid="run-stderr">{{
                              run.stderr
                            }}</pre>
                          }
                          @if (!run.stdout && !run.stderr) {
                            <p class="text-muted-foreground">출력이 없어요.</p>
                          }
                          @if (run.timedOut) {
                            <p class="run-status-error">시간 제한(5초)을 넘겨 멈췄어요.</p>
                          } @else if (run.exitCode !== 0) {
                            <p class="run-status-error">
                              에러로 끝났어요(종료 코드 {{ run.exitCode }}).
                            </p>
                          }
                        </div>
                      }
                    }
                  }
                </section>
              }
            }
          }
        </div>
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeView {
  readonly course = input.required<CourseId>();
  readonly status = input.required<CodeListStatus>();
  readonly files = input<readonly CodeFile[]>([]);
  // 지금 연 파일 이름. 목록에 없으면 첫 파일을 엶
  readonly file = input<string | undefined>();
  // 지금 연 파일의 원래 코드 글
  readonly sourceStatus = input<CodeSourceStatus>('loading');
  readonly source = input('');
  readonly running = input(false);
  readonly live = input<LiveRun | null>(null);
  readonly runError = input<string | null>(null);
  // 지금 연 파일의 오타 검사 결과
  readonly check = input<CodeCheck | null>(null);

  readonly fileChange = output<string>();
  readonly run = output<CodeRunRequest>();
  // 고친 코드 글이 바뀔 때마다 알림. 부모가 오타 검사에 씀
  readonly codeChange = output<string>();
  // 원래대로를 누름. 부모는 방금 실행한 결과와 에러를 비움
  readonly reset = output<void>();

  // 코드 파일이 하나도 없는 목록은 못 불러온 것과 같이 봄
  protected readonly view = computed<CodeListStatus>(() =>
    this.status() === 'ready' && this.files().length === 0 ? 'error' : this.status(),
  );
  protected readonly current = computed(
    () => this.files().find((f) => f.file === this.file()) ?? this.files()[0],
  );
  // 고친 코드 글. 파일이나 원래 글이 바뀌면 버림
  private readonly draft = linkedSignal<string, string | null>({
    source: () => `${this.current()?.file}\n${this.source()}`,
    computation: () => null,
  });
  protected readonly stdin = linkedSignal<string | undefined, string>({
    source: () => this.current()?.file,
    computation: () => '',
  });
  protected readonly currentText = computed(() => this.draft() ?? this.source());
  protected readonly edited = computed(() => this.currentText() !== this.source());
  protected readonly staleAfterRun = computed(() => {
    const live = this.live();
    return live !== null && live.source !== this.currentText();
  });
  // 결과 칸에 보일 것. 방금 실행한 결과가 있으면 그걸, 없으면 자료 가져오기 때 미리 돌려 둔 결과
  protected readonly result = computed<{ kind: 'no-main' | 'compile-error' | 'none' | 'run' }>(
    () => {
      const code = this.current();
      const live = this.live();
      if (!code?.hasMain) return { kind: 'no-main' };
      if (live) return { kind: live.result.run ? 'run' : 'compile-error' };
      return { kind: code.run ? 'run' : 'none' };
    },
  );
  protected readonly shownRun = computed<CodeRun | null>(
    () => this.live()?.result.run ?? this.current()?.run ?? null,
  );
  protected readonly compileText = computed(() => {
    const compile = this.live()?.result.compile;
    return compile ? compile.stderr || compile.stdout : '';
  });
  protected readonly stdinId = computed(() => `stdin-${this.current()?.className}`);

  protected edit(text: string) {
    this.draft.set(text);
    this.codeChange.emit(text);
  }

  protected resetAll() {
    this.draft.set(null);
    this.codeChange.emit(this.source());
    this.reset.emit();
  }
}
