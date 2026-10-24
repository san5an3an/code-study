// 강의 [22:54]~[24:32] "프로젝트 참조" 아이디어를 실제로 돌아가게 만든 예제
// 강의에서는 주석으로 생각만 적었고, 여기서는 배열(09강) + for + 리턴값으로 완성했어요
public class RankDemo {

    // scores 배열 안에서 myScore 가 몇 등인지 계산해서 int 로 돌려줘요
    public static int getRank(int[] scores, int myScore) {
        int rank = 1;                        // 혼자면 1등. 등수는 1부터 시작
        for (int i = 0; i < scores.length; i++) {
            if (myScore < scores[i]) {       // 나보다 높은 점수가 있으면
                rank = rank + 1;             // 내 등수가 하나 밀려나요
            } // if end
        } // for end
        return rank;
    } // getRank() end

    public static void main(String[] args) {
        int[] scores = {70, 80, 40, 60, 50}; // 강의 화면의 점수 5개
        int rank = getRank(scores, 60);      // 60점은 몇 등?
        System.out.println("60점은 " + rank + "등");   // 70, 80 두 명이 더 높으니 3등

        System.out.println("80점은 " + getRank(scores, 80) + "등"); // 1등
        System.out.println("40점은 " + getRank(scores, 40) + "등"); // 5등
    } // main() end
}
