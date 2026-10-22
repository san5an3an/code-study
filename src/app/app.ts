import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LucidePlay } from '@lucide/angular';
import { HlmButtonImports } from '@spartan-ng/helm/button';

// 기본 설치 확인용 첫 화면. 앱 화면 틀은 다음 단계에서 옮김
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HlmButtonImports, LucidePlay],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
