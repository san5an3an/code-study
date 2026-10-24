// do-while 반복문 기본 예제 (강의 Test01_while 뒷부분 정리)
public class DoWhileBasic {
    public static void main(String[] args) {
        // 형식: do { 반복할 내용 } while (조건);   <- 맨 끝 세미콜론(;) 필수!

        int c = 1;                         // 반복 횟수를 세는 변수

        do {                               // do는 "일단 해라"라는 뜻. 조건을 묻지 않고 바로 들어가요
            System.out.println("Python");  // Python을 한 줄 출력해요
            c = c + 1;                     // c를 1 늘려요
        } while (c <= 3);                  // 다 실행한 다음에 조건을 물어요. true면 do로 다시 올라가요

        /*
            do { Python c=1+1 } while(2<=3)  -> true, 다시
            do { Python c=2+1 } while(3<=3)  -> true, 다시
            do { Python c=3+1 } while(4<=3)  -> false, 끝
        */
    }
}
