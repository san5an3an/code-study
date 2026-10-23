import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // 주소의 :course 와 라우트 data 를 화면 input 으로 넣어 줌
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(),
  ],
};
