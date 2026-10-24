// 강의 [18:12]~[25:00] 예제: final 변수, final 클래스, final 메소드

// final 클래스(종단 클래스): 자식 클래스를 만들 수 없어요
// 아래 주석을 풀면 에러: cannot inherit from final Animal
/*
final class Animal {}
class Elephant extends Animal {}
*/

// 부모 클래스
class Fruit {
    void view() {}          // 보통 메소드: 자식이 고쳐 쓸(오버라이드) 수 있어요
    final void disp() {}    // final 메소드: 자식이 고쳐 쓸 수 없어요
} // Fruit end

// extends Fruit : Fruit 를 물려받는다(상속)는 뜻 (15강에서 자세히 배워요)
class Apple extends Fruit {
    @Override               // "부모 메소드를 고쳐 쓴다"는 표시(어노테이션)
    void view() {}          // OK

    // 아래 주석을 풀면 에러: disp() in Apple cannot override disp() in Fruit
    // @Override
    // void disp() {}
} // Apple end

public class FinalExample {

    public static void main(String[] args) {
        int a = 3;               // 보통 변수
        System.out.println(a);   // 3

        a = 5;                   // 보통 변수는 새 값을 넣을 수 있어요
        System.out.println(a);   // 5

        final int b = 2;         // final 변수: 처음 넣은 값이 "마지막" 값 (상수화)
        System.out.println(b);   // 2

        // b = 4;                // 에러: cannot assign a value to final variable b

        // 참고(강의 밖 내용): 바뀌면 안 되는 값은 보통 static final + 대문자 이름으로 만들어요
        System.out.println(Integer.MAX_VALUE); // int 가 담을 수 있는 가장 큰 수 (static final)
    } // main() end
}
