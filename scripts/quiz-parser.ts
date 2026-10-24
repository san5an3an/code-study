// 퀴즈.md 를 quiz.json 형식으로 바꾸는 함수. 강의마다 퀴즈 글 형식이 세 가지라 세 형식을 모두 읽음
import type { QuizKind, QuizQuestion } from '../src/app/domain/lecture-content.ts';

// 원본 문제 종류 이름을 앱 문제 종류로 바꾸는 표. 표에 없는 이름이 나오면 에러로 멈춤
const KIND_BY_LABEL: Record<string, QuizKind> = {
  OX: 'ox',
  객관식: 'choice',
  '실행 결과': 'output',
  '실행 결과 맞히기': 'output',
  '함정 문제': 'output',
  '빈칸 채우기': 'blank',
  '직접 짜보기': 'write',
  '직접 짜 보기': 'write',
  '직접 해보기': 'write',
  '에러 찾기': 'write',
  '오류 찾기': 'write',
};
const OUTSIDE_MARK = '강의 밖 내용 포함';

// 문제 머리 형식 세 가지: **문제 1. (OX)**, ### 1. (OX), ### 문제 1 (OX)
const QUESTION_HEAD = [
  /^\*\*문제\s*(\d+)\.\s*\(([^)]+)\)\*\*\s*$/,
  /^###\s*(?:문제\s*)?(\d+)\.?\s*\(([^)]+)\)\s*$/,
];
// 정답 머리 형식: **문제 1. 정답: O**, **1. X**(09강), ### 1. O, ### 문제 1. O, ### 문제 1 정답: O, ### 문제 11 예시 답안
const ANSWER_HEAD = [/^\*\*(?:문제\s*)?(\d+)\.\s*(.*?)\*\*\s*$/, /^###\s*(?:문제\s*)?(\d+)(.*)$/];
const ANSWER_SECTION = /^##\s*정답/;

export class QuizFormatError extends Error {}

type Block = { n: number; head: string; body: string[] };

function splitBlocks(lines: string[], heads: RegExp[]): Block[] {
  const blocks: Block[] = [];
  let inFence = false;
  for (const line of lines) {
    if (line.trimStart().startsWith('```')) inFence = !inFence;
    const m = inFence ? null : heads.map((re) => line.match(re)).find(Boolean);
    if (m) blocks.push({ n: Number(m[1]), head: m[2] ?? '', body: [] });
    else if (blocks.length > 0) blocks[blocks.length - 1].body.push(line);
  }
  return blocks;
}

// 블록 앞뒤의 빈 줄과 구분선(---)을 걷어 냄
function tidy(lines: string[]) {
  const out = [...lines];
  while (out.length > 0 && /^\s*(---)?\s*$/.test(out[0])) out.shift();
  while (out.length > 0 && /^\s*(---)?\s*$/.test(out[out.length - 1])) out.pop();
  return out.join('\n');
}

function parseLabel(raw: string, where: string) {
  const parts = raw.split(',').map((s) => s.trim());
  const outsideLecture = parts.includes(OUTSIDE_MARK);
  const label = parts.filter((p) => p !== OUTSIDE_MARK).join(', ');
  const kind = KIND_BY_LABEL[label];
  if (!kind) throw new QuizFormatError(`${where}: 모르는 문제 종류 "${raw}"`);
  return { label, kind, outsideLecture };
}

// 코드 블록 밖의 "1. 보기" 줄은 객관식 보기로, 나머지 줄은 문제 글로 나눔
function splitOptions(body: string[]) {
  const prompt: string[] = [];
  const options: string[] = [];
  let inFence = false;
  for (const line of body) {
    if (line.trimStart().startsWith('```')) inFence = !inFence;
    const m = inFence ? null : line.match(/^(\d+)\.\s+(.*)$/);
    if (m && Number(m[1]) === options.length + 1) options.push(m[2].trim());
    else prompt.push(line);
  }
  return { prompt: tidy(prompt), options };
}

function parseAnswerHead(raw: string) {
  const head = raw
    .trim()
    .replace(/^\.\s*/, '')
    .replace(/^정답\s*:?\s*/, '')
    .trim();
  const isExample = /^(예시 답안|정답 예시)/.test(raw.trim().replace(/^\.\s*/, ''));
  return { head: isExample ? '' : head, isExample };
}

function parseCorrect(kind: QuizKind, head: string, optionCount: number, where: string) {
  if (kind === 'ox') {
    const m = head.match(/^([OX])(?![A-Za-z])/);
    if (!m) throw new QuizFormatError(`${where}: OX 정답이 O/X 가 아님 "${head}"`);
    return [m[1]];
  }
  if (kind === 'choice') {
    // "3번 `7.`", "2", "1, 3" 처럼 정답 머리 앞쪽의 숫자들만 정답 번호로 봄
    const lead = head.match(/^[\d\s,번와및]+/)?.[0] ?? '';
    const nums = [...lead.matchAll(/\d+/g)].map((m) => Number(m[0]));
    if (nums.length === 0) throw new QuizFormatError(`${where}: 객관식 정답 번호가 없음 "${head}"`);
    for (const n of nums) {
      if (n < 1 || n > optionCount) {
        throw new QuizFormatError(`${where}: 객관식 정답 ${n}번이 보기(${optionCount}개)에 없음`);
      }
    }
    return nums;
  }
  return [];
}

function checkSequence(blocks: Block[], what: string, lectureId: string) {
  blocks.forEach((b, i) => {
    if (b.n !== i + 1) {
      throw new QuizFormatError(`${lectureId}강: ${what} 번호가 ${i + 1}번 자리에 ${b.n}번`);
    }
  });
}

export function parseQuiz(markdown: string, lectureId: string): QuizQuestion[] {
  const lines = markdown.split(/\r?\n/);
  const cut = lines.findIndex((l) => ANSWER_SECTION.test(l));
  if (cut < 0) throw new QuizFormatError(`${lectureId}강: "## 정답과 해설" 구역이 없음`);

  const questions = splitBlocks(lines.slice(0, cut), QUESTION_HEAD);
  const answers = splitBlocks(lines.slice(cut + 1), ANSWER_HEAD);
  if (questions.length === 0) throw new QuizFormatError(`${lectureId}강: 문제를 하나도 못 찾음`);
  if (questions.length !== answers.length) {
    throw new QuizFormatError(
      `${lectureId}강: 문제 ${questions.length}개, 정답 ${answers.length}개`,
    );
  }
  checkSequence(questions, '문제', lectureId);
  checkSequence(answers, '정답', lectureId);

  return questions.map((q, i) => {
    const where = `${lectureId}강 ${q.n}번`;
    const { label, kind, outsideLecture } = parseLabel(q.head, where);
    const { prompt, options } =
      kind === 'choice' ? splitOptions(q.body) : { prompt: tidy(q.body), options: [] };
    if (kind === 'choice' && options.length < 2) {
      throw new QuizFormatError(`${where}: 객관식 보기가 ${options.length}개`);
    }
    const { head, isExample } = parseAnswerHead(answers[i].head);
    return {
      n: q.n,
      kind,
      label,
      outsideLecture,
      prompt,
      options,
      correct: parseCorrect(kind, head, options.length, where),
      answerHead: head,
      isExample,
      explanation: tidy(answers[i].body),
    };
  });
}
