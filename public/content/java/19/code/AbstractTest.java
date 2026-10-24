// 19강 예제 1: 추상 클래스(abstract class)와 추상 메소드
// 강의 화면의 Animal.java + Test01_abstract.java 를 한 파일로 정리했어요.

// 추상 클래스: 추상 메소드가 하나라도 있으면 class 앞에 abstract 를 붙여야 해요.
abstract class Animal {
    String name;

    // 일반 메소드: 본체 { } 가 있는 보통 메소드예요. 추상 클래스 안에 같이 둘 수 있어요.
    void view() {
        System.out.println("Animal.view()...");
    }

    // 추상 메소드: 본체 { } 없이 세미콜론으로 끝나요. "자식이 꼭 완성해!" 라는 뜻이에요.
    abstract void disp();
}

// 추상 클래스를 상속할 때도 extends 를 써요.
class Elephant extends Animal {
    // 추상 클래스를 상속받으면 추상 메소드를 반드시 재정의(override)해야 해요.
    @Override
    void disp() {
        System.out.println("Elephant.disp()");
    }
}

class Tuna extends Animal {
    @Override
    void disp() {
        System.out.println("Tuna.disp()");
    }
}

public class AbstractTest {
    public static void main(String[] args) {
        // Animal animal = new Animal(); // 에러: 추상 클래스는 직접 객체를 만들 수 없어요.

        Elephant jumbo = new Elephant();
        jumbo.view();   // 부모(Animal)에게 물려받은 일반 메소드
        jumbo.disp();   // Elephant 가 완성한 메소드

        Tuna nemo = new Tuna();
        nemo.view();
        nemo.disp();

        // 추상 클래스의 다형성: 부모 타입 변수에 자식 객체를 담을 수 있어요.
        Animal animal = null;   // null = 아직 아무 객체도 가리키지 않음(비어 있음)

        animal = new Elephant();
        animal.disp();          // 실제 객체가 Elephant 라서 Elephant 의 disp() 가 실행돼요.

        animal = new Tuna();
        animal.disp();          // 이번엔 Tuna 의 disp() 가 실행돼요.
    }
}
