// throws 로 예외를 호출한 곳에 떠넘기기 (강의 Test02_throws + Test 예제)

// 예외를 직접 처리하지 않고, 자기를 부른 곳으로 넘기는 메소드들
class Thrower {
    // 이 메소드에서 생길 수 있는 예외들을 나열
    public static void view() throws NullPointerException, NumberFormatException, ArithmeticException {
        int a = 3 / 0;                      // ArithmeticException 발생 -> 호출한 곳으로 넘어감
    }

    // Exception 하나만 적으면 모든 예외를 간단히 떠넘길 수 있어요
    public static void disp() throws Exception {
        int a = Integer.parseInt("KOREA");  // NumberFormatException 발생
    }
}

public class ThrowsExample {
    public static void main(String[] args) {
        // 떠넘겨진 예외는 메소드를 부른 쪽에서 try ~ catch 로 처리해요
        try {
            Thrower.view();   // 여기서 예외가 넘어와서 바로 catch 로 가요
            Thrower.disp();   // 실행되지 않아요
        } catch (Exception e) {
            System.out.println(e);
        }

        try {
            Thrower.disp();
        } catch (Exception e) {
            System.out.println(e);
        }
        System.out.println("END");
    }
}
