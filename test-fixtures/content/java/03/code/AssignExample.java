// 03강 보충 예제: 대입 연산자(=)와 변수 값이 바뀌는 과정 따라가 보기
public class AssignExample {

    public static void main(String[] args) {

        int score = 50;                       // score 라는 상자를 만들고 50을 넣어요
        System.out.println(score);            // 50

        System.out.println(score + 10);       // 50 + 10 = 60 을 계산해서 보여 주기만 해요
        System.out.println(score);            // 그래서 score 는 여전히 50 이에요

        score = 80;                           // = 는 "오른쪽 값을 왼쪽 상자에 넣어라" 라는 뜻
        System.out.println(score);            // 80 (이전 값 50은 잊어버림)

        score = score + 5;                    // 지금 값 80 에 5를 더한 85 를 다시 score 에 넣어요
        System.out.println(score);            // 85
    }
}
