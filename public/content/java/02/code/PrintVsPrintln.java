// PrintVsPrintln.java
// print 와 println 의 차이, 그리고 숫자/글자 출력 방법을 비교해 보는 예제예요.

public class PrintVsPrintln {

    public static void main(String[] args) {

        // 1) print: 출력만 하고 줄은 그대로 (커서가 같은 줄 끝에 남아요)
        System.out.print("가");                  // 글자(문자열)는 큰따옴표 "" 로 감싸요.
        System.out.print("나");                  // 앞의 "가" 바로 옆에 붙어요.
        System.out.print("다");                  // 결과: 가나다

        System.out.println();                    // 괄호를 비워 두면 아무것도 안 쓰고 줄만 바꿔요.

        // 2) println: 출력한 뒤 줄을 바꿔요 (엔터를 친 것과 같아요)
        System.out.println("첫째 줄");
        System.out.println("둘째 줄");

        // 3) 숫자는 따옴표 없이 그대로 쓸 수 있어요.
        System.out.println(2024);                // 숫자 2024 출력
        System.out.println("2024");              // 따옴표가 있으면 "2024"라는 글자. 화면에는 똑같이 보여요.

        // 4) 대소문자를 정확히! system.out.println 이나 System.out.Println 이라고 쓰면 에러가 나요.
        System.out.println("Java는 대소문자를 구분해요");

    }
}
