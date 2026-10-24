// while 반복문 기본 예제 (강의 Test01_while 앞부분 정리)
public class WhileBasic {
    public static void main(String[] args) {
        // 형식: while (조건) { 조건이 true인 동안 반복할 내용 }

        int a = 1;                       // 반복 횟수를 세는 변수, 1부터 시작해요

        while (a <= 3) {                 // a가 3 이하인 동안(true인 동안) 중괄호 안을 반복해요
            System.out.println("JAVA");  // 한 바퀴 돌 때마다 JAVA를 한 줄 출력해요
            a = a + 1;                   // a를 1 늘려요. 이 줄이 없으면 영원히 반복돼요(무한루프)
        } // while end: 조건이 false가 되면 여기 아래로 빠져나와요

        /*
            실제로 일어나는 일
            while(1<=3) { JAVA  a=1+1 }
            while(2<=3) { JAVA  a=2+1 }
            while(3<=3) { JAVA  a=3+1 }
            while(4<=3)  -> false, 반복 끝
        */

        System.out.println("반복이 끝난 뒤 a = " + a); // 빠져나온 뒤 a는 4예요
    }
}
