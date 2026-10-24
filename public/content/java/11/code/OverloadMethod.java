// 강의 [17:54]~[22:51] 예제: 메소드 오버로드(중복 정의)
// 이름이 같은 add 메소드가 4개! 매개변수의 개수나 자료형이 달라서 자바가 구분해요
public class OverloadMethod {

    // ① 정수 1개
    public static void add(int a) {
        System.out.println(a);
    } // add(int) end

    // ② 정수 2개 -> ①과 매개변수 "개수"가 달라요
    public static void add(int a, int b) {
        System.out.println(a + b);
    } // add(int, int) end

    // ③ 실수 2개 -> ②와 개수는 같지만 "자료형"이 달라요
    public static void add(double a, double b) {
        System.out.println(a + b);
    } // add(double, double) end

    // ④ 문자열 2개 -> 문자열끼리 + 하면 이어 붙여요
    public static void add(String a, String b) {
        System.out.println(a + b);
    } // add(String, String) end

    /*
     * 아래처럼 ①과 매개변수가 똑같고 리턴형만 다르면 에러예요.
     * 리턴형은 오버로드를 구분하는 기준이 아니기 때문이에요.
     *
     * public static int add(int a) { return a; }
     * -> error: method add(int) is already defined in class OverloadMethod
     */

    public static void main(String[] args) {
        add(3);                  // 정수 1개 -> ① 호출 -> 3
        add(5, 7);               // 정수 2개 -> ② 호출 -> 12
        add(1.2, 3.4);           // 실수 2개 -> ③ 호출 -> 4.6
        add("JAVA", "Python");   // 문자열 2개 -> ④ 호출 -> JAVAPython
    } // main() end
}
