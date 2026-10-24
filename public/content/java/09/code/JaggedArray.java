// 2차원 배열도 { } 로 초기값을 줄 수 있고, 행마다 칸 수가 달라도 된다
public class JaggedArray {
    public static void main(String[] args) {
        // 바깥 중괄호 안에 행마다 중괄호를 하나씩 쓴다
        // 한 줄로 써도 되지만, 행별로 줄을 나누면 읽기 쉽다
        int[][] aver = {
            {10, 20, 30, 40, 50}, // 0행: 5칸
            {60, 70},             // 1행: 2칸
            {80, 90, 100}         // 2행: 3칸
        };

        System.out.println(aver.length);    // 3  (행이 3줄)
        System.out.println(aver[0].length); // 5  (0행은 5칸)
        System.out.println(aver[1].length); // 2  (1행은 2칸)
        System.out.println(aver[2].length); // 3  (2행은 3칸)

        // 행마다 칸 수가 달라도 aver[r].length 를 쓰면 정확히 돌 수 있다
        for (int r = 0; r < aver.length; r++) {
            for (int c = 0; c < aver[r].length; c++) {
                System.out.print(aver[r][c] + " ");
            }
            System.out.println();
        }
    }
}
