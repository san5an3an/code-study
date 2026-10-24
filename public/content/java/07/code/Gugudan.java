// 이중 반복문으로 2단 ~ 9단 구구단 출력하기
public class Gugudan {
    public static void main(String[] args) {
        // 바깥 for: 단(dan)을 2부터 9까지 바꿔요. dan++ 는 dan = dan + 1 과 같아요.
        for (int dan = 2; dan <= 9; dan++) {
            System.out.println(dan + "단"); // 단 제목 출력 (예: 2단)

            // 안쪽 for: 곱하는 수 a를 1부터 9까지 바꿔요.
            for (int a = 1; a <= 9; a++) {
                // (dan * a)를 괄호로 묶어 "먼저 계산한다"는 뜻을 분명히 해요.
                // 곱셈(*)은 괄호가 없어도 먼저 계산되지만, 덧셈(+)이었다면 괄호가 꼭 필요해요.
                System.out.println(dan + "*" + a + "=" + (dan * a));
            } // 안쪽 for end
        } // 바깥 for end
    }
}
