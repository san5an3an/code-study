// 06강 예제 3: switch에는 정수뿐 아니라 문자(char)도 넣을 수 있어요 (간단 계산기)
public class SwitchChar {
    public static void main(String[] args) {
        int a = 10, b = 3;       // 계산할 두 숫자
        char op = '*';           // 연산 기호 (char는 작은따옴표 ' ' 로 감싸요)
        // 키보드로 기호를 받고 싶다면 (Scanner 버전):
        //   java.util.Scanner sc = new java.util.Scanner(System.in);
        //   char op = sc.next().charAt(0);   // 입력한 글자 중 첫 글자를 꺼내요

        switch (op) {            // op와 같은 기호를 가진 case를 찾아요
            case '+': System.out.println(a + " + " + b + " = " + (a + b)); break;
            case '-': System.out.println(a + " - " + b + " = " + (a - b)); break;
            case '*': System.out.println(a + " * " + b + " = " + (a * b)); break;  // '*'와 일치!
            case '/': System.out.println(a + " / " + b + " = " + (a / b)); break;  // 정수끼리 나누면 몫만 남아요
            default:  System.out.println("지원하지 않는 기호예요: " + op);
        } // switch 끝

        // 같은 switch를 다른 기호로 한 번 더 (목록에 없는 기호 → default)
        char op2 = '%';
        switch (op2) {
            case '+': System.out.println("더하기"); break;
            case '-': System.out.println("빼기");   break;
            default:  System.out.println("지원하지 않는 기호예요: " + op2);
        } // switch 끝
    }
}
