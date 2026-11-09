import { ChangeDetectionStrategy, Component } from '@angular/core';

// home layout으로 title, storage notice, card grid, 부별 진행 card slot을 place하고 slot 내용은 이 template을 쓰는 page가 set
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
