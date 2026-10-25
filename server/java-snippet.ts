// 퀴즈 답처럼 강의 예제 파일이 아닌 코드 한 덩어리를 javac 가 받는 파일 하나로 만듦
export type JavaSnippetFile = {
  // javac 에 넘길 파일 이름. public class 가 있으면 그 이름이어야 컴파일됨
  file: string;
  code: string;
  // 감싸느라 앞에 붙인 줄 수. 에러 줄 번호에서 이만큼 빼야 사용자가 쓴 줄 번호가 됨
  lineOffset: number;
};

const TYPE_DECLARATION = /\b(class|interface|enum|record)\s+\w+/;
const PUBLIC_TYPE =
  /\bpublic\s+(?:(?:final|abstract|sealed|static)\s+)*(?:class|interface|enum|record)\s+(\w+)/;
// 맨 앞 칸에서 접근 제어자나 static 으로 시작하는 줄이 있으면 메소드나 필드를 쓴 답으로 봄
const MEMBER_DECLARATION = /^(public|private|protected|static)\b/m;

export function javaSnippetFile(source: string): JavaSnippetFile {
  if (TYPE_DECLARATION.test(source)) {
    const name = PUBLIC_TYPE.exec(source)?.[1] ?? 'Main';
    return { file: `${name}.java`, code: source, lineOffset: 0 };
  }
  if (MEMBER_DECLARATION.test(source)) {
    return { file: 'Main.java', code: `public class Main {\n${source}\n}\n`, lineOffset: 1 };
  }
  return {
    file: 'Main.java',
    code: `public class Main {\npublic static void main(String[] args) throws Exception {\n${source}\n}\n}\n`,
    lineOffset: 2,
  };
}
