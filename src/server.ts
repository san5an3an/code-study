import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { createRunHandler } from '../server/run-handler.ts';
import { RUN_PATH } from './app/core/run-api.ts';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

// 강의 자료 위치. 환경 변수, 빌드 결과, public 폴더 순으로 찾음
const builtContent = join(browserDistFolder, 'content');
const contentDir = process.env['CODE_STUDY_CONTENT']
  ? resolve(process.env['CODE_STUDY_CONTENT'])
  : existsSync(builtContent)
    ? builtContent
    : resolve('public/content');

// 모든 HTTP 메서드를 받아야 GET 이나 OPTIONS 요청도 보호 규칙 검사에서 403 으로 거절함
app.all(RUN_PATH, createRunHandler(contentDir));

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 5488.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = Number(process.env['PORT'] || 5488);
  // 코드 실행 서버라 이 컴퓨터 안에서만 열고 같은 네트워크의 다른 기기에는 열지 않음
  app.listen(port, 'localhost', (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
