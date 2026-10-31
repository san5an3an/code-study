// 코드 실행 API 요청과 응답 형식. 화면과 서버가 같이 씀

export const RUN_PATH = '/api/run';
// 다른 사이트가 이 헤더를 붙이면 브라우저가 CORS 사전 확인을 먼저 보내고, 서버는 그 사전 확인을 허락하지 않음
export const RUN_HEADER = 'x-code-study';
export const RUN_HEADER_VALUE = 'run';

export const COURSES = ['java', 'python'] as const;
export type Course = (typeof COURSES)[number];

// 실행 서버가 코드를 돌리고 검사할 수 있는 과목인지
export function isRunCourse(value: string): value is Course {
  return COURSES.some((c) => c === value);
}

// 메모리를 너무 많이 써서 서버가 실행을 멈추면 stderr 끝에 붙이는 글. 화면이 이 글로 멈춘 이유를 알아봄
export const MEMORY_STOPPED = '…(메모리를 256MB 넘게 써서 멈췄어요)';
// 출력이 64KB 를 넘어 서버가 실행을 멈추면 stdout 끝에 붙이는 글. 끝 코드가 없는(신호로 죽은) 다른 경우와 가르는 데 씀
export const OUTPUT_STOPPED = '…(출력이 64KB를 넘어 멈췄어요)';

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

// 퀴즈 코드 문제 채점용. 코드 한 덩어리를 검사 주소처럼 감싸서 컴파일하고 입력 없이 실행함
export const RUN_SNIPPET_PATH = '/api/run-snippet';

export type SnippetRunRequest = SnippetCheckRequest;

// 컴파일 에러가 나면 diagnostics 에 사용자가 쓴 줄 번호로 담고 run 은 null
export type SnippetRunResponse =
  { ok: true; diagnostics: CodeDiagnostic[]; run: CodeRun | null } | { ok: false; error: string };

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
