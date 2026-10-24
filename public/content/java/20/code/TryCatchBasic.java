// try ~ catch 기본 (강의 2~5번 예제)
public class TryCatchBasic {
    public static void main(String[] args) {

        // 2. ArithmeticException : 0으로 나누기
        try {
            System.out.println(1);
            System.out.println(3 / 0);   // 여기서 예외 발생 -> 바로 catch 로 점프
            System.out.println(5);       // 건너뜀
        } catch (ArithmeticException e) {
            System.out.println(e);       // 예외 정보(종류: 메시지) 출력
        }
        System.out.println("END");       // 예외가 났어도 프로그램은 계속 진행돼요
        System.out.println("-----");

        // 3. ArrayIndexOutOfBoundsException : 없는 배열 칸에 접근
        try {
            int[] num = new int[3];      // 0, 1, 2 번 칸만 있어요
            num[5] = 7;                  // 5번 칸은 없음 -> 예외 발생
            System.out.println(9);
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println(e);
        }
        System.out.println("END");
        System.out.println("-----");

        // 4. NumberFormatException : 숫자가 아닌 글자를 정수로 바꾸려 함
        try {
            int a = Integer.parseInt("123");   // 정상: 123
            System.out.println(a);
            int b = Integer.parseInt("KOREA"); // 숫자가 아니라서 예외 발생
            System.out.println(b);
        } catch (NumberFormatException e) {
            System.out.println(e);
        }
        System.out.println("END");
        System.out.println("-----");

        // 5. NullPointerException : null 로 계산하려 함
        try {
            Integer inte = null;          // 객체가 없음(null)
            int c = 5 / inte;             // null 을 int 로 꺼내려다 예외 발생
            System.out.println(c);
        } catch (NullPointerException e) {
            System.out.println("NullPointerException 발생!");
        }
        System.out.println("END");
    }
}
