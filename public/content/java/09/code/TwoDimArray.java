// 2차원 배열: 행(줄, row)과 열(칸, column)로 이루어진 표 모양 배열
public class TwoDimArray {
    public static void main(String[] args) {
        // 대괄호 두 쌍 [][] = 2차원 배열
        // new int[2][3] : 2행 3열 = 6칸, int 4바이트 x 6 = 24바이트 할당
        int[][] eng = new int[2][3];

        // [행][열] 순서로 접근. 행도 열도 0부터 시작
        eng[0][0] = 10; // 0행 0열
        eng[0][1] = 20; // 0행 1열
        eng[0][2] = 30; // 0행 2열
        eng[1][0] = 40; // 1행 0열
        eng[1][1] = 50; // 1행 1열
        eng[1][2] = 60; // 1행 2열

        // 배열이름.length       -> 행(줄)의 개수
        System.out.println(eng.length);    // 2
        // 배열이름[행].length   -> 그 행의 열(칸) 개수
        System.out.println(eng[0].length); // 3
        System.out.println(eng[1].length); // 3

        // (강의 밖 보너스) for 문 두 개를 겹쳐서 표 모양으로 출력하기
        for (int r = 0; r < eng.length; r++) {          // 바깥 for: 행을 하나씩
            for (int c = 0; c < eng[r].length; c++) {   // 안쪽 for: 그 행의 칸을 하나씩
                System.out.print(eng[r][c] + " ");      // print 는 줄을 바꾸지 않는다
            }
            System.out.println(); // 한 행을 다 찍었으면 줄 바꿈
        }
    }
}
