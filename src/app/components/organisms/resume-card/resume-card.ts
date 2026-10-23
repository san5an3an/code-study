import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucidePlay } from '@lucide/angular';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';

import type { Resume } from '../../../domain/course-summary';

// 이어서 하기 카드. 강의로 가는 이동이라 a 태그에 버튼 모양만 입혀 화면 낭독기에도 링크로 읽히게 함
@Component({
  selector: 'app-resume-card',
  imports: [RouterLink, HlmButtonImports, HlmCardImports, LucidePlay],
  template: `
    <div hlmCard class="h-full" data-testid="resume">
      <div hlmCardHeader>
        <p hlmCardDescription>{{ resume().resumed ? '이어서 하기' : '처음 시작' }}</p>
        <h3 hlmCardTitle class="text-base">
          {{ resume().lecture.id }}강. {{ resume().lecture.title }}
        </h3>
      </div>
      <div hlmCardContent class="mt-auto">
        <a hlmBtn [routerLink]="href()">
          <svg lucidePlay [size]="16"></svg>
          {{ resume().resumed ? '이어서 하기' : resume().lecture.id + '강부터 시작하기' }}
        </a>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResumeCard {
  readonly resume = input.required<Resume>();
  readonly href = input.required<string>();
}
