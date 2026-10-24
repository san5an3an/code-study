// 04강 예제 3: 문자형(char)과 문자열형(String)
public class CharAndString {
    public static void main(String[] args) {
        // 문자형: 글자 딱 하나, 작은따옴표(' ')로 감싼다
        char ch = 'A';
        System.out.println(ch);   // A 출력

        // 문자열형: 글자 여러 개, 큰따옴표(" ")로 감싼다
        // String은 원래 기본 자료형이 아니라 참조 자료형(클래스)이지만 사용법은 비슷하다
        String str = "KOREA";
        System.out.println(str);  // KOREA 출력

        // char ch2 = "A";   // 에러! char에는 큰따옴표가 아니라 작은따옴표
        // char ch3 = 'AB';  // 에러! char에는 글자 하나만 넣을 수 있다
    }
}
