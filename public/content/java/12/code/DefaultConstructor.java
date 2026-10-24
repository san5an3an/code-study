// 참고(강의 밖 내용): 기본 생성자와 필드의 기본값
// - 생성자를 하나도 안 쓰면, 자바가 "아무것도 안 하는 기본 생성자"를 몰래 만들어 줘요
// - 필드는 값을 안 넣으면 자동으로 기본값이 들어가요 (int -> 0, String -> null)

class Cup {
    String drink;  // 아무 값도 안 넣음 -> null
    int ml;        // 아무 값도 안 넣음 -> 0
    // 생성자를 하나도 안 썼어요 -> 자바가 Cup() {} 를 자동으로 만들어 줘요
}

class Mug {
    String drink;
    // 생성자를 직접 하나 썼어요 -> 이제 자동 기본 생성자는 만들어지지 않아요
    Mug(String d) {
        drink = d;
    }
}

public class DefaultConstructor {
    public static void main(String[] args) {
        Cup c = new Cup();               // 자동으로 생긴 기본 생성자 덕분에 가능
        System.out.println(c.drink);     // null
        System.out.println(c.ml);        // 0

        Mug m = new Mug("커피");         // 직접 만든 생성자 사용
        System.out.println(m.drink);     // 커피
        // Mug m2 = new Mug();           // 에러! Mug 에는 전달값 없는 생성자가 없어요

        Cup c2 = new Cup();              // 같은 설계도로 객체를 또 만들면 완전히 별개의 객체
        c2.ml = 500;                     // c2 만 바뀌어요
        System.out.println(c.ml + " / " + c2.ml); // 0 / 500
    }
}
