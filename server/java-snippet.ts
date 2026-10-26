// 퀴즈 답처럼 강의 예제 파일이 아닌 코드 한 덩어리를 javac 가 받는 파일 하나로 만듦
export type JavaSnippetFile = {
  // javac 에 넘길 파일 이름. public class 가 있으면 그 이름이어야 컴파일됨
  file: string;
  code: string;
  // 감싸느라 앞에 붙인 줄 수. 에러 줄 번호에서 이만큼 빼야 사용자가 쓴 줄 번호가 됨
  lineOffset: number;
  // java 로 실행할 클래스. main 이 있는 맨 바깥 타입이고, 파일 이름과 다를 수 있음(public 을 안 붙인 main 클래스 등)
  mainClass: string;
};

const TYPE_DECLARATION = /\b(class|interface|enum|record)\s+\w+/;
const PUBLIC_TYPE =
  /\bpublic\s+(?:(?:final|abstract|sealed|static)\s+)*(?:class|interface|enum|record)\s+(\w+)/;
// 줄 맨 앞(들여쓰기는 빼고)이 접근 제어자나 static 이면 메소드나 필드를 쓴 답으로 봄. 문장은 이 낱말로 시작할 수 없음
const MEMBER_DECLARATION = /^\s*(public|private|protected|static)\b/m;
const MAIN_METHOD = /\bstatic\b[^;{}()]*\bvoid\s+main\s*\(/;

// 주석, 글자 묶음("""..."""), 글자("..."), 문자('...'). 앞에서부터 먼저 나온 것을 잡으므로 주석 속 따옴표는 주석으로 묶임
// 닫는 따옴표가 없으면 그 줄 끝까지, 닫는 */ 가 없으면 끝까지를 묶음
const COMMENT_OR_LITERAL =
  /\/\/[^\n]*|\/\*[\s\S]*?(?:\*\/|$)|"""[\s\S]*?(?:(?<!\\)"""|$)|"(?:\\.|[^\\\n"])*(?:"|(?=\n)|$)|'(?:\\.|[^\\\n'])*(?:'|(?=\n)|$)/g;

// 주석, 글자, 문자 속 내용을 공백으로 바꿈. 줄바꿈은 남겨 줄 단위 검사가 그대로 맞음
// 주석이나 따옴표 속의 "class Dog", "{" 를 코드로 읽지 않으려고 씀
export function javaCodeOnly(source: string): string {
  return source.replace(COMMENT_OR_LITERAL, (m) => m.replace(/[^\n]/g, ' '));
}

type TopLevelType = { name: string; isPublic: boolean; hasMain: boolean };

// 중괄호 깊이를 따라가며 맨 바깥 타입마다 이름, public 여부, 바로 안쪽(깊이 1)에 main 이 있는지를 모음
function topLevelTypes(code: string): TopLevelType[] {
  const types: TopLevelType[] = [];
  let depth = 0;
  let headerStart = 0;
  let current: (TopLevelType & { body: string }) | null = null;
  for (let i = 0; i < code.length; i++) {
    const c = code[i];
    if (c === '{') {
      if (depth === 0) {
        const header = code.slice(headerStart, i);
        const m = /\b(?:class|interface|enum|record)\s+(\w+)/.exec(header);
        current = m
          ? { name: m[1], isPublic: /\bpublic\b/.test(header), hasMain: false, body: '' }
          : null;
      }
      depth++;
    } else if (c === '}') {
      depth--;
      if (depth === 0) {
        if (current) types.push({ ...current, hasMain: MAIN_METHOD.test(current.body) });
        current = null;
        headerStart = i + 1;
      }
    } else if (depth === 0 && c === ';') {
      headerStart = i + 1;
    } else if (depth === 1 && current) {
      current.body += c;
    }
  }
  return types;
}

export function javaSnippetFile(source: string): JavaSnippetFile {
  const code = javaCodeOnly(source);
  if (TYPE_DECLARATION.test(code)) {
    const name = PUBLIC_TYPE.exec(code)?.[1] ?? 'Main';
    const withMain = topLevelTypes(code).filter((t) => t.hasMain);
    const main = withMain.find((t) => t.isPublic) ?? withMain[0];
    return { file: `${name}.java`, code: source, lineOffset: 0, mainClass: main?.name ?? name };
  }
  if (MEMBER_DECLARATION.test(code)) {
    return {
      file: 'Main.java',
      code: `public class Main {\n${source}\n}\n`,
      lineOffset: 1,
      mainClass: 'Main',
    };
  }
  return {
    file: 'Main.java',
    code: `public class Main {\npublic static void main(String[] args) throws Exception {\n${source}\n}\n}\n`,
    lineOffset: 2,
    mainClass: 'Main',
  };
}
