// 16강 예제 2: Math.random() 으로 난수(무작위 수) 만들기
// 실행할 때마다 결과가 달라져요!
public class RandomExample {

    public static void main(String[] args) {
        // Math.random() 은 0.0 이상 1.0 미만의 double 값을 무작위로 돌려줘요
        System.out.println(Math.random());

        // 2를 곱하면 0.0 이상 2.0 미만
        System.out.println(Math.random() * 2);

        // (int) 로 형변환하면 소수점 아래를 버려서 정수만 남아요
        System.out.println((int) (Math.random() * 2)); // 0 또는 1
        System.out.println((int) (Math.random() * 4)); // 0, 1, 2, 3 중 하나
        System.out.println((int) (Math.random() * 6)); // 0 ~ 5 중 하나

        // 주사위(1~6): 0~5 를 만든 다음 1 을 더해요
        int dice = (int) (Math.random() * 6) + 1;
        System.out.println("주사위: " + dice);

        // 로또 번호 하나(1~45): 0~44 를 만든 다음 1 을 더해요
        int lotto = (int) (Math.random() * 45) + 1;
        System.out.println("로또 번호: " + lotto);

        // 공식 정리: (int)(Math.random() * 개수) + 시작값
        // 주사위를 10번 굴려서 정말 1~6 만 나오는지 확인해 봐요
        System.out.print("주사위 10번: ");
        for (int i = 0; i < 10; i++) {
            System.out.print(((int) (Math.random() * 6) + 1) + " ");
        }
        System.out.println();
    }
}
