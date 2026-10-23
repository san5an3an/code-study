import { ChangeDetectionStrategy, Component } from '@angular/core';

// 홈 화면 배치: 제목, 저장 안내, 카드 두 개, 부별 진행 카드. 각 자리에 넣을 내용은 이 템플릿을 쓰는 페이지가 정함
@Component({
  selector: 'app-home-template',
  template: `
    <div class="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <h1 class="text-xl font-semibold">홈</h1>
      <ng-content select="[homeNotice]" />
      <div class="grid gap-4 sm:grid-cols-2">
        <ng-content select="[homeCards]" />
      </div>
      <section class="flex flex-col gap-3" aria-labelledby="parts-heading">
        <h2 id="parts-heading" class="text-base font-semibold">부별 진행</h2>
        <div class="grid gap-3 sm:grid-cols-2">
          <ng-content select="[homeParts]" />
        </div>
      </section>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeTemplate {}
