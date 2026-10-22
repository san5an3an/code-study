import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink],
  template: `
    <div class="p-8">
      <h1 class="text-xl font-semibold">없는 화면이에요</h1>
      <a routerLink="/" class="mt-2 inline-block text-sm underline underline-offset-4">처음으로</a>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundPage {}
