// while문과 do-while문의 차이 (강의 Test02_while 정리)
// 일부러 "처음부터 틀린 조건"을 줘서 차이를 확인해요
public class WhileVsDoWhile {
    public static void main(String[] args) {
        // 1) while문: 조건을 "먼저" 물어봐요
        int a = 3;
        while (a <= 0) {                     // 3 <= 0 은 false -> 중괄호 안에 한 번도 못 들어가요
            System.out.println("SEOUL");     // 그래서 이 줄은 실행되지 않아요
            a = a + 1;
        }
        System.out.println(a);               // a는 그대로 3이에요

        // 2) do-while문: 조건을 "나중에" 물어봐요
        int b = 3;
        do {
            System.out.println("BUSAN");     // 조건과 상관없이 일단 한 번은 실행돼요
            b = b + 1;                       // b는 4가 돼요
        } while (b <= 0);                    // 4 <= 0 은 false -> 여기서 끝
        System.out.println(b);               // b는 4예요 (한 번 실행됐으니까)
    }
}
