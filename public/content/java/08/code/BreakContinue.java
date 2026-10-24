// break문과 continue문 비교 (강의 Test03_continue 앞부분 정리)
public class BreakContinue {
    public static void main(String[] args) {
        // 1) break: 반복문을 "완전히" 빠져나가요
        for (int a = 1; a < 10; a = a + 1) {   // a를 1부터 9까지 늘리며 반복
            if (a == 5) {                       // a가 5가 되면
                break;                          // 남은 바퀴가 있어도 for문 밖으로 탈출!
            }
            System.out.printf("%d", a);         // %d는 정수 자리. 줄바꿈 없이 이어서 찍어요
        }
        System.out.println();                   // 괄호 안이 비어 있으면 줄바꿈만 해요

        // 2) continue: 이번 바퀴만 건너뛰고 다음 바퀴로 "U턴"해요
        for (int a = 1; a < 10; a = a + 1) {
            if (a == 5) {                       // a가 5일 때만
                continue;                       // 아래 printf를 건너뛰고 증감식(a = a + 1)으로 가요
            }
            System.out.printf("%d", a);
        }
        System.out.println();                   // 줄바꿈
    }
}
