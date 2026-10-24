// 06강 예제 2: switch-case문 기본, break가 없을 때, default
public class SwitchBasic {
    public static void main(String[] args) {
        // (1) 기본형: switch 괄호 안의 값과 "똑같은" case를 찾아서 실행해요
        int city = 20;                  // 찾고 싶은 값
        switch (city) {                 // city(20)와 일치하는 case를 찾아요
            case 10: System.out.println("SEOUL"); break;   // 10이 아니니 건너뜀
            case 20: System.out.println("BUSAN"); break;   // 20과 일치! 출력 후 break로 switch를 빠져나감
            case 30: System.out.println("JEJU");  break;   // 여기는 실행되지 않아요
        } // switch 끝

        // (2) break가 없는 경우: 일치한 case부터 break를 만날 때까지 아래로 계속 흘러가요
        int subject = 20;
        switch (subject) {
            case 10: System.out.println("국어"); break;
            case 20: System.out.println("영어");           // break가 없어요! 그래서 아래 줄도 실행
            case 30: System.out.println("수학"); break;    // 여기 break에서 비로소 빠져나가요
        } // switch 끝 → "영어", "수학" 두 줄이 출력돼요

        // (3) default: 일치하는 case가 하나도 없을 때 무조건 실행돼요
        int flower = 60;                // 10, 20, 30 어디에도 없는 값
        switch (flower) {
            case 10: System.out.println("개나리"); break;
            case 20: System.out.println("진달래"); break;
            case 30: System.out.println("무궁화"); break;
            default: System.out.println("기타");           // 보통 맨 마지막에 둬요(마지막이라 break는 있어도 없어도 됨)
        } // switch 끝
    }
}
