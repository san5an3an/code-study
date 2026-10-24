// 강의 [03:00]~[12:20] 예제: 전달값이 없는 메소드 만들고 부르기
public class NoArgumentMethod {

    // test1 메소드 정의(만들기)
    // public static : 아직 안 배웠으니 그대로 따라 써요
    // void : 이 메소드는 돌려주는 값(리턴값)이 없다는 뜻이에요
    // () : 괄호가 비어 있으니 전달값을 받지 않아요
    public static void test1() {
        System.out.println("JAVA");   // 불릴 때마다 JAVA 출력
    } // test1() end

    public static void test2() {
        System.out.println("Python"); // 불릴 때마다 Python 출력
    } // test2() end

    public static void test3() {
        System.out.println("KOREA");  // 불릴 때마다 KOREA 출력
        return; // 나를 부른 곳으로 되돌아가요 (마지막 줄의 return 은 생략 가능)
    } // test3() end

    // main 도 메소드예요. 프로그램은 항상 main 부터 시작해요
    public static void main(String[] args) {
        test1(); // test1 호출 -> JAVA
        test1(); // 한 번 만든 메소드는 몇 번이든 부를 수 있어요
        test2(); // test2 호출 -> Python
        test1(); // 순서도 마음대로 정할 수 있어요
        test3(); // KOREA 를 찍고 이 줄로 돌아와요
        test2(); // 돌아온 다음 줄이 이어서 실행돼요
    } // main() end
}
