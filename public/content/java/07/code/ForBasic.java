// for 반복문 기본: 증가하면서 반복, 감소하면서 반복
public class ForBasic {
    public static void main(String[] args) {
        // 1. 증가에 따른 반복
        // ① int a = 1  : 시작값 (맨 처음 딱 한 번만 실행)
        // ② a <= 3     : 조건식 (true면 중괄호 안을 실행, false면 for문 끝)
        // ③ a = a + 1  : 증감식 (중괄호 실행이 끝날 때마다 a를 1 늘림)
        for (int a = 1; a <= 3; a = a + 1) {
            System.out.println("JAVA"); // ④ 반복해서 실행할 문장
        } // for end

        /* 회전 추적표 (손으로 써 보면 흐름이 보여요)
           a=1  1<=3 true   JAVA   a=1+1
           a=2  2<=3 true   JAVA   a=2+1
           a=3  3<=3 true   JAVA   a=3+1
           a=4  4<=3 false  -> for문 빠져나감
        */

        // 2. 감소에 따른 반복
        // b를 3에서 시작해 1씩 줄이면서, b가 1 이상인 동안 반복해요.
        for (int b = 3; b >= 1; b = b - 1) {
            System.out.println("Python");
        } // for end

        /* 회전 추적표
           b=3  3>=1 true   Python  b=3-1
           b=2  2>=1 true   Python  b=2-1
           b=1  1>=1 true   Python  b=1-1
           b=0  0>=1 false  -> for문 빠져나감
        */
    }
}
