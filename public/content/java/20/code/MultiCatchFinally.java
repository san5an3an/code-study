// 다중 catch, Exception 으로 한 번에 받기, finally (강의 6~8번 예제)
public class MultiCatchFinally {
    public static void main(String[] args) {

        // 6. 다중 catch : 예외 종류마다 catch 를 따로 둘 수 있어요
        try {
            System.out.println(1);
            int a = Integer.parseInt("KOREA"); // 첫 번째로 만나는 예외 -> 여기서 catch 로
            System.out.println(3 / 0);         // 실행되지 않아요
        } catch (ArithmeticException e) {
            System.out.println("[산술 예외] " + e);
        } catch (NumberFormatException e) {
            System.out.println("[숫자 형식 예외] " + e);   // 이 catch 만 실행돼요
        } catch (NullPointerException e) {
            System.out.println("[null 예외] " + e);
        }
        System.out.println("END");
        System.out.println("-----");

        // 7. Exception 하나로 받기 : 모든 예외의 부모 클래스라서 다 받을 수 있어요 (다형성)
        try {
            System.out.println(1);
            System.out.println(3 / 0);
        } catch (Exception e) {            // ArithmeticException 도 Exception 의 자식
            System.out.println(e);
        }
        System.out.println("END");
        System.out.println("-----");

        // 8. finally : 예외가 나도, 안 나도 꼭 실행
        divide(6, 2);   // 예외 없음
        divide(6, 0);   // 예외 발생
        System.out.println("END");
    }

    static void divide(int x, int y) {
        try {
            System.out.println("OPEN");
            System.out.println(x / y);
        } catch (Exception e) {
            System.out.println(e);
        } finally {
            System.out.println("CLOSE");   // 어느 경우든 출력
        }
    }
}
