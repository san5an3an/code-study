// 예외처리를 하지 않은 경우 (강의 1번 예제)
// 일부러 3/0 을 넣어서 프로그램이 중간에 멈추는 모습을 보여 주는 파일이에요.
// 실행하면 빨간 에러 글자가 나오고 "END" 는 출력되지 않아요. (정상이에요!)
public class UncaughtException {
    public static void main(String[] args) {
        System.out.println(1);
        System.out.println(3 / 0);   // 정수를 0으로 나눔 -> ArithmeticException 발생, 여기서 프로그램 중단
        System.out.println(5);       // 실행되지 않아요
        System.out.println("END");   // 실행되지 않아요
    }
}
