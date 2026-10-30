// 퀴즈 코드 문제에 채점용 기대 출력과 힌트를 붙임. 힌트는 content-extra/<과목>/code-quiz.json 에 손으로 씀
import { readFileSync } from 'node:fs';

import type { QuizQuestion } from '../src/app/domain/lecture-content.ts';
import { codeLanguageOf } from '../src/app/domain/quiz-answer.ts';
import type { CourseId } from '../src/app/domain/course.ts';
import { answerSource } from './expected-output.ts';

// 힌트는 쉬운 말 설명, 순서대로 할 일, 빈칸 뚫린 코드 세 단계
export const HINT_STEPS = 3;

// noGrading 은 출력 비교로 채점할 수 없는 이유. 적혀 있으면 예시 답안을 돌리지 않고 스스로 체크로 둠
// showOutputExample 은 문제 글에 출력 모양이 없어서 기대 출력을 문제 밑에 "출력 예" 로 보여 줄 문제에 붙임
export type CodeQuizExtra = { hints: string[]; noGrading?: string; showOutputExample?: boolean };

// 키는 "강의 번호-문제 번호"(예: "07-12")
export type CodeQuizExtras = Record<string, CodeQuizExtra>;

export class CodeQuizExtraError extends Error {}

export function parseCodeQuizExtras(json: string, where: string): CodeQuizExtras {
  const data: unknown = JSON.parse(json);
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    throw new CodeQuizExtraError(`${where}: 맨 바깥이 객체가 아님`);
  }
  for (const [key, value] of Object.entries(data)) {
    const v = value as Partial<CodeQuizExtra> | null;
    const ok =
      Array.isArray(v?.hints) &&
      v.hints.length === HINT_STEPS &&
      v.hints.every((h) => typeof h === 'string' && h.trim() !== '');
    if (!ok)
      throw new CodeQuizExtraError(`${where} ${key}: 힌트가 빈칸 없는 글 ${HINT_STEPS}개가 아님`);
    if (v.noGrading !== undefined && typeof v.noGrading !== 'string') {
      throw new CodeQuizExtraError(`${where} ${key}: noGrading 이 글이 아님`);
    }
    if (v.showOutputExample !== undefined && typeof v.showOutputExample !== 'boolean') {
      throw new CodeQuizExtraError(`${where} ${key}: showOutputExample 이 true, false 가 아님`);
    }
    if (v.showOutputExample && v.noGrading !== undefined) {
      throw new CodeQuizExtraError(`${where} ${key}: 채점 안 하는 문제는 보여 줄 기대 출력이 없음`);
    }
  }
  return data as CodeQuizExtras;
}

export function readCodeQuizExtras(file: string): CodeQuizExtras {
  return parseCodeQuizExtras(readFileSync(file, 'utf8'), file);
}

// language(과목) 코드로 답하는 문제에만 기대 출력과 힌트를 붙이고, 쓴 키를 used 에 모음
// 코드 문제인데 힌트가 없거나, 말로 답하는 문제에 힌트가 있으면 에러로 멈춤
export function withCodeQuiz(
  q: QuizQuestion,
  lectureId: string,
  extras: CodeQuizExtras,
  used: Set<string>,
  expectedOutput: (source: string) => string | null,
  language: CourseId = 'java',
): QuizQuestion {
  const key = `${lectureId}-${q.n}`;
  const extra = extras[key];
  if (codeLanguageOf(q) !== language) {
    if (extra) throw new CodeQuizExtraError(`${key}: 코드로 답하는 문제가 아닌데 힌트가 있음`);
    return q;
  }
  if (!extra) throw new CodeQuizExtraError(`${key}: 코드 문제인데 힌트가 없음`);
  used.add(key);
  const source = answerSource(q.explanation, language);
  const expected = extra.noGrading !== undefined || source === null ? null : expectedOutput(source);
  if (!extra.showOutputExample) return { ...q, expectedOutput: expected, hints: extra.hints };
  if (expected === null) {
    throw new CodeQuizExtraError(`${key}: 출력 예를 보여 줄 문제인데 예시 답안의 출력을 못 구함`);
  }
  return { ...q, expectedOutput: expected, hints: extra.hints, outputExample: expected };
}

// 자료를 지우기 전에 힌트와 문제 짝만 미리 맞춰 봄. 예시 답안은 돌리지 않음(기대 출력은 빈 글로 둠)
// 짝이 틀리면 withCodeQuiz, checkAllUsed 와 같은 에러로 멈춤(ADR-061)
export function precheckCodeQuiz(
  quizzes: readonly { lectureId: string; questions: readonly QuizQuestion[] }[],
  extras: CodeQuizExtras,
  language: CourseId,
) {
  const used = new Set<string>();
  for (const quiz of quizzes) {
    for (const q of quiz.questions)
      withCodeQuiz(q, quiz.lectureId, extras, used, () => '', language);
  }
  checkAllUsed(extras, used);
}

// 힌트 파일에만 있고 어느 문제에도 안 붙은 키(번호 오타 등)가 있으면 에러로 멈춤
export function checkAllUsed(extras: CodeQuizExtras, used: Set<string>) {
  const unused = Object.keys(extras).filter((k) => !used.has(k));
  if (unused.length > 0) {
    throw new CodeQuizExtraError(`힌트 파일에만 있는 문제: ${unused.join(', ')}`);
  }
}
