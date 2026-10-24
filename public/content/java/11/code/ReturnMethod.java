// 강의 [03:01]~[17:54] 예제: 리턴값이 있는 메소드
// 리턴값이 있으면 void 자리에 "돌려줄 값의 자료형"을 써요
public class ReturnMethod {

    // 정수 두 개를 받아서, 더한 값(int)을 돌려주는 메소드
    // 돌려주는 값 sum 이 int 라서 리턴형도 int 예요
    public static int test1(int a, int b) {
        int sum = a + b; // 3 + 5 = 8
        return sum;      // 8 을 가지고 부른 곳으로 돌아가요
    } // test1() end

    // 정수 하나를 받아서 "짝수" 또는 "홀수" 문자열(String)을 돌려주는 메소드
    public static String test2(int a) {
        if (a % 2 == 0) {     // 2로 나눈 나머지가 0이면 짝수
            return "짝수";    // 큰따옴표로 감싼 글자 = String
        } else {
            return "홀수";
        } // if end
    } // test2() end

    // 연도를 받아서 윤년이면 true, 아니면 false(boolean)를 돌려주는 메소드
    // (강의처럼 "4로 나누어떨어지면 윤년" 이라는 간단한 규칙만 써요)
    public static boolean leap(int year) {
        if (year % 4 == 0) {
            return true;
        } else {
            return false;
        } // if end
    } // leap() end

    // 팩토리얼을 계산해서 long 으로 돌려주는 메소드
    public static long fact(int a) {
        long gop = 1;                    // 곱셈 누적은 1에서 시작해요
        for (int f = a; f >= 1; f--) {   // f: a, a-1, ..., 1
            gop = gop * f;
        } // for end
        return gop;                      // 계산한 값을 돌려줘요 (4 -> 24)
    } // fact() end

    public static void main(String[] args) {
        // 1) 돌려받은 값을 변수에 담기. 변수 자료형 = 리턴형(int)
        int result = test1(3, 5);
        System.out.println(result);        // 8

        // 2) 리턴값이 있는 메소드 호출은 그 자체가 "값"이라 바로 출력할 수도 있어요
        System.out.println(test1(2, 4));   // 6

        // 3) String 을 돌려받으니 String 변수로 받아요
        String str = test2(7);
        System.out.println(str);           // 홀수
        System.out.println(test2(6));      // 짝수

        // 4) boolean 을 돌려받으니 if 의 조건 자리에 바로 쓸 수 있어요
        if (leap(2020)) {
            System.out.println("윤년");
        } else {
            System.out.println("평년");
        } // if end

        if (leap(2023)) {
            System.out.println("윤년");
        } else {
            System.out.println("평년");
        } // if end

        // 5) long 을 돌려받아요
        long f = fact(4);
        System.out.println(f);             // 24
    } // main() end
}
