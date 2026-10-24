// 05강 예제 1: println 과 print 의 차이, 특수문자(이스케이프) 출력
public class PrintExample {
    public static void main(String[] args) {
        // println = 글자를 찍고 "엔터"까지 친다 (ln = line, 줄)
        System.out.println("JAVA");
        System.out.println("PYTHON");
        System.out.println("서울");
        System.out.println("제주");

        // print = 글자만 찍고 엔터는 안 친다 -> 다음 글자가 바로 옆에 붙는다
        System.out.print("사과");
        System.out.print("수박");
        System.out.print("참외");
        System.out.println(); // 괄호 안이 비어 있으면 "엔터만" 친다 (줄바꿈)

        // 큰따옴표(")는 문자열의 시작/끝 표시라서 그냥 쓰면 에러가 난다
        // 앞에 역슬래시(\)를 붙이면 "그냥 기호"로 출력된다
        System.out.println("\"");          // " 출력
        System.out.println("\'");          // ' 출력 (작은따옴표)
        System.out.println("\\");          // \ 출력 (역슬래시 자체)

        // 문장 안에 섞어서 쓸 수도 있다
        System.out.println("그가 \"안녕\"이라고 말했다");
        System.out.println("C:\\Users\\java"); // 윈도우 경로처럼 \ 를 보여줄 때
    }
}
