// 이중 반복문: 반복문 안에 반복문
public class NestedFor {
    public static void main(String[] args) {
        // 바깥 for: a가 1, 2 -> 2번 돌아요.
        for (int a = 1; a <= 2; a = a + 1) {
            System.out.println("JAVA"); // 바깥이 한 번 돌 때마다 1번

            // 안쪽 for: 바깥이 한 번 돌 때마다 b가 1부터 "다시" 시작해서 3번 돌아요.
            for (int b = 1; b <= 3; b = b + 1) {
                System.out.println("Python");
            } // 안쪽 for end
        } // 바깥 for end

        // System.out.println(a); // 에러: a는 바깥 for 안에서만 유효
        // System.out.println(b); // 에러: b는 안쪽 for 안에서만 유효

        /* 회전 추적표
           a=1  1<=2  JAVA
                     b=1 1<=3 Python b=1+1
                         2<=3 Python b=2+1
                         3<=3 Python b=3+1
                         4<=3 false -> 안쪽 끝
           a=2  2<=2  JAVA
                     b=1 ... Python 3번 (b는 1부터 다시)
           a=3  3<=2 false -> 바깥 끝
           결과: JAVA 2번, Python 2x3 = 6번
        */
    }
}
