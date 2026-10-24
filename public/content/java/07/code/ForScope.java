// 유효범위(scope): 변수가 살아 있는 범위
public class ForScope {
    public static void main(String[] args) {
        // for 괄호 안에서 선언한 c는 for문 안에서만 살아 있어요.
        for (int c = 1; c <= 5; c = c + 1) {
            System.out.println("KOREA"); // 5번 출력
        } // for end
        // System.out.println(c); // 에러! for문이 끝나면서 c는 사라졌어요.

        // d는 for문 바깥(위)에서 선언했으므로 선언된 줄부터 main 끝까지 쓸 수 있어요.
        int d = 0;
        for (d = 1; d <= 5; d = d + 1) { // 여기서는 새로 선언(int)하지 않고 값만 넣어요.
            System.out.println("SEOUL"); // 5번 출력
        } // for end

        // d가 6이 되어 조건(6<=5)이 false가 된 순간 for문이 끝났으므로 6이 남아 있어요.
        System.out.println(d); // 6
    }
}
