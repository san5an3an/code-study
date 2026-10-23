import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { courseOf } from '../../../config/courses';
import type { CourseId } from '../../../domain/course';
import { partSummaries, resumeOf } from '../../../domain/course-summary';
import { completedLectures } from '../../../domain/lecture-progress';
import { ProgressService } from '../../../services/progress.service';
import { PartProgress } from '../../molecules/part-progress/part-progress';
import { StorageNotice } from '../../molecules/storage-notice/storage-notice';
import { OverallProgressCard } from '../../organisms/overall-progress-card/overall-progress-card';
import { ResumeCard } from '../../organisms/resume-card/resume-card';
import { HomeTemplate } from '../../templates/home-template/home-template';

// 과목 홈. 진도를 가져와 전체·이어서 하기·부별 진행에 넣음
@Component({
  selector: 'app-home-page',
  imports: [HomeTemplate, StorageNotice, OverallProgressCard, ResumeCard, PartProgress],
  template: `
    <app-home-template>
      <!-- 안내가 없을 때 빈 칸이 간격을 한 번 더 먹지 않게 숨김 -->
      <app-storage-notice homeNotice class="empty:hidden" [persisted]="persisted()" />
      <app-overall-progress-card homeCards [done]="completed().size" [total]="course().lectures.length" />
      <app-resume-card
        homeCards
        [resume]="resume()"
        [href]="base() + '/lecture/' + resume().lecture.id"
      />
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
  // 빈 주소 자식이라 부모 라우트의 :course 를 물려받아 input 으로 들어옴
  readonly courseId = input.required<CourseId>({ alias: 'course' });

  private readonly progress = inject(ProgressService);

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
  protected readonly persisted = computed(() => {
    this.data();
    return this.progress.persisted(this.courseId());
  });
}
