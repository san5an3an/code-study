// 03강 예제 1: 데이터의 세 가지 종류 (수치형, 문자형, 논리형)
// 강의 화면의 Test01_data 를 정리한 파일이에요.
public class DataTypeExample {

    // 프로그램은 항상 main 메소드에서 시작해요.
    public static void main(String[] args) {

        // 1. 수치형 (숫자)
        System.out.println(3);      // 소수점이 없으니 정수 (양의 정수)
        System.out.println(-5);     // 앞에 - 를 붙이면 음의 정수
        System.out.println(2.4);    // 소수점이 있으니 실수
        System.out.println(-5.6);   // 음의 실수
        System.out.println(7.);     // 점만 찍어도 실수로 취급 -> 7.0 으로 출력돼요

        // 2. 문자형 (따옴표로 감싼 값)
        System.out.println("KOREA");   // 큰따옴표 " " 로 감싼 문자열
        System.out.println("대한민국"); // 한글도 똑같이 큰따옴표로 감싸요
        System.out.println('B');       // 작은따옴표 ' ' 는 글자 딱 하나
        System.out.println('가');      // 한글 한 글자도 작은따옴표 가능
        System.out.println(123);       // 숫자 123 (계산에 쓸 수 있는 값)
        System.out.println("123");     // 문자 "123" (화면엔 똑같이 보여도 글자예요)

        // 3. 논리형 (boolean, 참/거짓 두 가지 값만 있음)
        System.out.println(true);      // 참. 따옴표가 없으니 논리형
        System.out.println(false);     // 거짓
        System.out.println("true");    // 따옴표가 있으니 이건 문자열이에요
        System.out.println("false");   // 이것도 문자열
    }
}
