// 강의 [12:20]~[23:05] 예제: 전달값(argument)과 매개변수(parameter)
public class ArgumentMethod {

    // int a : 전달된 정수 하나를 받는 매개변수
    public static void test4(int a) {
        System.out.println(a); // 전달받은 값을 그대로 출력
    } // test4() end

    // 매개변수가 여러 개면 쉼표로 구분하고, 자료형을 하나하나 다 적어요
    // (int a, b, c) 처럼 쓰면 에러예요
    public static void test5(int a, int b, int c) {
        System.out.println(a + b + c); // 세 값을 더해서 출력
    } // test5() end

    // 자료형이 서로 달라도 괜찮아요. 전달하는 순서대로 받아요
    public static void test6(float a, double b) {
        System.out.println(a + b); // float + double -> double 로 계산돼요
    } // test6() end

    // 문자 하나(char)와 정수(int)를 받아서, 그 문자를 a번 반복 출력
    public static void test7(char ch, int a) {
        for (int b = 1; b <= a; b++) { // b가 1부터 a까지 1씩 커지며 반복
            System.out.print(ch);      // print 라서 줄바꿈 없이 옆으로 이어 찍어요
        } // for end
        System.out.println();          // 다 찍은 뒤 줄바꿈 한 번
    } // test7() end

    public static void main(String[] args) {
        test4(10); // a 에 10 이 들어가요
        test4(30); // a 에 30
        test4(50); // a 에 50

        test5(6, 7, 8); // a=6, b=7, c=8 -> 21
        test5(2, 4, 6); // a=2, b=4, c=6 -> 12

        test6(1.2f, 3.4); // 1.2f 는 float, 3.4 는 double

        test7('#', 100); // # 을 100번 출력
    } // main() end
}
