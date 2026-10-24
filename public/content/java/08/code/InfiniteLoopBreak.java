// 무한루프 + break 짝꿍 예제 (강의 Test03_continue 뒷부분 "프로젝트 참조" 정리)
// + while문에서 continue를 쓸 때 주의할 점
public class InfiniteLoopBreak {
    public static void main(String[] args) {
        // 1) while(true): 조건이 항상 참이라 끝없이 도는 "무한루프"
        int b = 1;
        while (true) {                          // true는 늘 참 -> 스스로는 멈추지 않아요
            System.out.println("KOREA");        // KOREA 출력
            b = b + 1;                          // b를 1 늘려요
            if (b == 5) {                       // b가 5가 되는 순간
                break;                          // 반복문을 빠져나와요 (이게 없으면 영원히 돌아요)
            }
        } // while end

        // 2) while문 안의 continue는 "조건식"으로 U턴해요
        //    그래서 값을 늘리는 코드는 continue보다 "앞"에 둬야 해요
        int n = 0;
        while (n < 6) {
            n = n + 1;                          // 먼저 늘리고
            if (n == 3) {                       // n이 3일 때는
                continue;                       // 아래 출력을 건너뛰고 조건식 (n < 6)으로 가요
            }
            System.out.print(n + " ");          // print는 줄바꿈 없이 출력해요
        }
        System.out.println();                   // 줄바꿈
        // 만약 n = n + 1; 을 continue 아래에 두면, n이 3에서 더 안 늘어나 무한루프가 돼요!
    }
}
