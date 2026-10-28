// 가져오기 스크립트가 public/content 에 쓰는 강의 자료 형식. 앱과 스크립트가 같이 씀
import type { CourseId } from './course';

// 가져오기 스크립트로 노트, 퀴즈, 예제 코드를 만드는 과목
export const SYNCED_COURSES: readonly CourseId[] = ['java', 'python'];
// 강의 자료 탭(화면 캡처, 받아쓰기)이 있는 과목. 파이썬은 이것만 먼저 가져옴
export const MATERIAL_COURSES: readonly CourseId[] = ['java', 'python'];

export type QuizKind = 'ox' | 'choice' | 'output' | 'blank' | 'write';

export type QuizQuestion = {
  n: number;
  kind: QuizKind;
  // 원본에 적힌 문제 종류 이름 그대로("실행 결과 맞히기", "에러 찾기" 등)
  label: string;
  outsideLecture: boolean;
  prompt: string;
  options: string[];
  // ox 는 ["O"] 또는 ["X"], choice 는 1부터 센 보기 번호. 나머지 종류는 스스로 채점이라 빈 배열
  correct: (string | number)[];
  // 정답 머리 줄("3번 `7.`" 등). 예시 답안이면 빈 문자열
  answerHead: string;
  isExample: boolean;
  explanation: string;
  // 자바 코드로 답하는 문제만 있음. 예시 답안을 돌린 출력이고, 채점할 수 없는 문제(돌릴 때마다 출력이 다름 등)는 null
  expectedOutput?: string | null;
  // 자바 코드로 답하는 문제만 있음. 쉬운 말 설명, 순서대로 할 일, 빈칸 뚫린 코드 세 단계(마크다운)
  hints?: string[];
  // 문제 글에 출력 모양이 없는 코드 문제만 있음. 기대 출력과 같은 글이고 문제 밑에 "출력 예" 로 보여 줌
  outputExample?: string;
};

export type Quiz = {
  lectureId: string;
  questions: QuizQuestion[];
};

// 받아쓰기 한 줄. t 는 영상 시작부터 센 초
export type TranscriptLine = { t: number; text: string };

// 화면 캡처 한 장. t 는 영상 시작부터 센 초
export type Frame = { t: number; file: string };

// 강의 하나에서 가져온 자료 개수. index.json 에 강의마다 한 줄씩 씀
export type LectureContentSummary = {
  id: string;
  questions: number;
  codeFiles: number;
  transcriptLines: number;
  frames: number;
};
