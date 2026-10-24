// 05강 예제 2: + 연산자의 두 얼굴 (덧셈 vs 연결)
public class ConcatExample {
    public static void main(String[] args) {
        // 숫자 + 숫자 = 진짜 덧셈
        System.out.println(123 + 456);      // 579

        // 문자열 + 문자열 = 이어 붙이기(연결)
        System.out.println("ONE" + "TWO");  // ONETWO

        // 문자열 + 숫자 = 숫자도 글자로 바뀌어서 이어 붙는다
        System.out.println("123" + 456);    // 123456

        // 숫자 + 문자열 = 역시 이어 붙는다
        System.out.println(123 + "456");    // 123456

        // 따옴표 안의 + 는 연산자가 아니라 그냥 글자다
        System.out.println("123+456");      // 123+456

        // 실전 활용: 설명 글자와 값을 이어서 한 줄로 출력
        int age = 25;                       // 정수 변수 age 에 25 저장
        System.out.println("나이: " + age + "살"); // 나이: 25살

        // 주의: 왼쪽부터 차례로 계산된다
        System.out.println(1 + 2 + "3");    // 먼저 1+2=3(덧셈), 그다음 "3"과 연결 -> 33
        System.out.println("1" + 2 + 3);    // "1"+2="12", "12"+3="123" -> 123
        System.out.println("합: " + (1 + 2)); // 괄호를 먼저 계산 -> 합: 3
    }
}
