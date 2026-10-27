import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideNotebookPen } from '@lucide/angular';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';

// loading: 퀴즈 파일을 불러오는 중, empty: 틀린 문제가 없음, none: 이 과목은 아직 퀴즈가 없음, ready: 묶음 목록을 보여 줌
export type ReviewView = 'loading' | 'empty' | 'none' | 'ready';

// 오답 노트 화면 배치: 제목과 한 줄 설명, 그 아래 상태에 맞는 내용. 묶음 목록은 이 템플릿을 쓰는 페이지가 [reviewGroups] 자리에 넣음
@Component({
  selector: 'app-review-template',
  imports: [HlmButtonImports, HlmEmptyImports, HlmSkeletonImports, LucideNotebookPen, RouterLink],
  template: `
    <div class="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <div class="flex flex-col gap-1">
        <h1 class="text-xl font-semibold">오답 노트</h1>
        <p class="text-sm text-muted-foreground">퀴즈에서 틀린 문제만 모아 다시 풀어요</p>
      </div>
      @switch (view()) {
        @case ('loading') {
          <hlm-skeleton class="h-24 w-full" aria-busy="true" aria-label="오답 노트 불러오는 중" />
        }
        @case ('empty') {
          <div hlmEmpty class="border" data-testid="review-empty">
            <div hlmEmptyHeader>
              <div hlmEmptyMedia variant="icon">
                <svg lucideNotebookPen [size]="16"></svg>
              </div>
              <h3 hlmEmptyTitle>틀린 문제가 아직 없어요</h3>
              <p hlmEmptyDescription>퀴즈를 풀다 틀린 문제가 생기면 여기에 모여요.</p>
            </div>
            @if (quizLink(); as link) {
              <div hlmEmptyContent>
                <a hlmBtn [routerLink]="link" [queryParams]="{ tab: 'quiz' }">퀴즈 풀러 가기</a>
              </div>
            }
          </div>
        }
        @case ('none') {
          <div hlmEmpty class="border" data-testid="review-none">
            <div hlmEmptyHeader>
              <div hlmEmptyMedia variant="icon">
                <svg lucideNotebookPen [size]="16"></svg>
              </div>
              <h3 hlmEmptyTitle>이 과목은 아직 퀴즈가 없어요</h3>
              <p hlmEmptyDescription>퀴즈가 생기면 틀린 문제를 여기서 다시 풀 수 있어요.</p>
            </div>
          </div>
        }
        @case ('ready') {
          <div class="flex flex-col gap-8">
            <ng-content select="[reviewGroups]" />
          </div>
        }
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewTemplate {
  readonly view = input.required<ReviewView>();
  // 빈 화면의 "퀴즈 풀러 가기" 가 갈 강의 주소(예: /java/lecture/07). null 이면 버튼을 그리지 않음
  readonly quizLink = input<string | null>(null);
}
