import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  type Signal,
} from '@angular/core';
import { ROUTER_OUTLET_DATA } from '@angular/router';

import { courseOf } from '../../../config/courses';
import type { CourseId } from '../../../domain/course';
import { partSummaries, resumeOf } from '../../../domain/course-summary';
import { completedLectures } from '../../../domain/lecture-progress';
import { ProgressService } from '../../../services/progress.service';
import { PartProgress } from '../../molecules/part-progress/part-progress';
import { StorageNotice } from '../../molecules/storage-notice/storage-notice';
import { OverallProgressCard } from '../../organisms/overall-progress-card/overall-progress-card';
import { ResumeCard } from '../../organisms/resume-card/resume-card';
import { ReviewCountCard } from '../../organisms/review-count-card/review-count-card';
import { HomeTemplate } from '../../templates/home-template/home-template';
import type { CourseOutletData } from '../course-shell-page/course-shell-page';

// course home page로 progress를 읽어 전체 진행률·이어서 하기·오답 노트·부별 진행 card에 pass
@Component({
  selector: 'app-home-page',
  imports: [
    HomeTemplate,
    StorageNotice,
    OverallProgressCard,
    ResumeCard,
    ReviewCountCard,
    PartProgress,
  ],
  template: `
    <app-home-template>
      <!-- 저장 안내가 없을 때 빈 자리가 카드 사이 간격을 한 번 더 차지하지 않도록 숨김 -->
      <app-storage-notice homeNotice class="empty:hidden" [persisted]="persisted()" />
      <app-overall-progress-card homeCards [done]="completed().size" [total]="course().lectures.length" />
      <app-resume-card
        homeCards
        [resume]="resume()"
        [href]="base() + '/lecture/' + resume().lecture.id"
      />
      @if (reviewCount() > 0) {
        <app-review-count-card
          homeCards
          class="sm:col-span-2"
          [count]="reviewCount()"
          [href]="base() + '/review'"
        />
      }
      @for (summary of parts(); track summary.part.id) {
        <app-part-progress
          homeParts
          [summary]="summary"
          [href]="base() + '/lecture/' + summary.first.id"
        />
      }
    </app-home-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  // 빈 경로의 자식 라우트라 부모 라우트의 :course 값을 물려받아 input 으로 들어옴
  readonly courseId = input.required<CourseId>({ alias: 'course' });

  private readonly progress = inject(ProgressService);
  private readonly outletData = inject(ROUTER_OUTLET_DATA) as Signal<CourseOutletData | undefined>;

  protected readonly course = computed(() => courseOf(this.courseId()));
  protected readonly base = computed(() => '/' + this.courseId());
  private readonly data = computed(() => this.progress.progress(this.courseId())());
  protected readonly completed = computed(() =>
    completedLectures(
      this.data(),
      this.course().lectures.map((l) => l.id),
    ),
  );
  protected readonly resume = computed(() => resumeOf(this.course(), this.data().lastLectureId));
  protected readonly parts = computed(() => partSummaries(this.course(), this.completed()));
  // course-shell-page가 pass한 review count를 read하고 data가 없으면 0으로 set
  protected readonly reviewCount = computed(() => this.outletData()?.reviewCount ?? 0);
  protected readonly persisted = computed(() => {
    this.data();
    return this.progress.persisted(this.courseId());
  });
}
