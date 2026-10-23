// 03강 예제 2: 상수와 변수
// 강의 화면의 Test02_variable 을 정리한 파일이에요.
public class VariableExample {

    public static void main(String[] args) {

        // 1. 상수: 값 그 자체. 3은 언제나 3이에요.
        System.out.println(3);        // 정수 상수
        System.out.println(-5);       // 음수 정수 상수
        System.out.println(2.4);      // 실수 상수
        System.out.println("JAVA");   // 문자열 상수 (큰따옴표로 감쌈)

        // 2. 변수: 값을 담아 두는 이름 붙은 상자
        int a = 7;                    // 정수(int)만 담는 상자 a 를 만들고 7을 넣어요 (변수 선언)
        System.out.println(a);        // a 안에 든 값 7 이 출력돼요
        System.out.println(a + 3);    // a 의 값(7) + 3 = 10 이 출력돼요

        a = 9;                        // a 에 9를 새로 넣어요. 이전 값 7은 사라져요 (int 는 다시 안 써요)
        System.out.println(a);        // 이제 a 는 9

        System.out.println("a");      // 따옴표로 감싸면 변수가 아니라 글자 a (문자열 상수)
    }
}
