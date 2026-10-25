// 코드 실행 API 요청과 응답 형식. 화면과 서버가 같이 씀

export const RUN_PATH = '/api/run';
// 다른 사이트가 이 헤더를 붙이면 브라우저가 CORS 사전 확인을 먼저 보내고, 서버는 그 사전 확인을 허락하지 않음
export const RUN_HEADER = 'x-code-study';
export const RUN_HEADER_VALUE = 'run';

export const COURSES = ['java'] as const;
export type Course = (typeof COURSES)[number];

// 실행 서버가 코드를 돌리고 검사할 수 있는 과목인지
export function isRunCourse(value: string): value is Course {
  return COURSES.some((c) => c === value);
}

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

// 편집기 오타 표시용. 실행하지 않고 컴파일만 해 보고 에러 위치와 문구를 돌려줌
export const CHECK_PATH = '/api/check';

export type CheckRequest = Omit<RunRequest, 'stdin'>;

// 퀴즈 답처럼 강의 예제 파일이 아닌 코드 한 덩어리 검사. 몇 줄만 쓴 코드는 서버가 class 와 main 으로 감싸서 컴파일함
export const CHECK_SNIPPET_PATH = '/api/check-snippet';

export type SnippetCheckRequest = { course: Course; source: string };

// line 은 1부터, column 은 그 줄 맨 앞을 0 으로 셈. message 는 컴파일러 원문(영어)
export type CodeDiagnostic = {
  file: string;
  line: number;
  column: number;
  severity: 'error' | 'warning';
  message: string;
};

export type CheckResponse =
  { ok: true; diagnostics: CodeDiagnostic[] } | { ok: false; error: string };

// 편집기에 넘기는 검사 결과. source 는 그 결과를 낸 코드 글이라, 편집기 글과 다르면 옛 결과로 보고 무시함
export type CodeCheck = { source: string; diagnostics: readonly CodeDiagnostic[] };
