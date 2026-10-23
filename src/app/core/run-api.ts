// 코드 실행 API 요청과 응답 형식. 화면과 서버가 같이 씀

export const RUN_PATH = '/api/run';
// 다른 사이트가 이 헤더를 붙이면 브라우저가 CORS 사전 확인을 먼저 보내고, 서버는 그 사전 확인을 허락하지 않음
export const RUN_HEADER = 'x-code-study';
export const RUN_HEADER_VALUE = 'run';

export const COURSES = ['java'] as const;
export type Course = (typeof COURSES)[number];

export type CodeRun = {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  timedOut: boolean;
};

export type CodeFile = {
  file: string;
  className: string;
  hasMain: boolean;
  needsInput: boolean;
  run: CodeRun | null;
};

export type RunRequest = {
  course: Course;
  lectureId: string;
  file: string;
  source: string;
  stdin: string;
};

export type RunResponse =
  { ok: true; compile: CodeRun; run: CodeRun | null } | { ok: false; error: string };
