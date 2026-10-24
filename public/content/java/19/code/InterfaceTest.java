// 19강 예제 2: 인터페이스(interface)와 implements
// 강의 화면의 Creature.java + Test02_interface.java 를 한 파일로 정리했어요.

// 인터페이스: 메소드의 "이름표(목록)"만 적어 두는 설계도예요.
interface Creature {
    // void view() { }       // 에러: 인터페이스에는 본체가 있는 일반 메소드를 쓸 수 없어요(강의 기준).
    abstract void kind();    // 추상 메소드
    void breathe();          // abstract 를 생략해도 자동으로 추상 메소드가 돼요.
}

// 클래스가 인터페이스를 상속할 때는 extends 대신 implements(구현하다)를 써요.
class Tiger implements Creature {
    // 인터페이스의 메소드는 자동으로 public 이라서, 구현할 때도 public 을 꼭 붙여야 해요.
    @Override
    public void kind() {
        System.out.println("포유류");
    }

    @Override
    public void breathe() {
        System.out.println("허파");
    }
}

class Salmon implements Creature {
    @Override
    public void kind() {
        System.out.println("어류");
    }

    @Override
    public void breathe() {
        System.out.println("아가미");
    }
}

public class InterfaceTest {
    public static void main(String[] args) {
        // Creature creature = new Creature(); // 에러: 인터페이스로는 직접 객체를 만들 수 없어요.

        // 인터페이스의 다형성: 인터페이스 타입 변수에 구현 클래스 객체를 담아요.
        Creature creature = null;

        creature = new Tiger();
        creature.kind();
        creature.breathe();

        creature = new Salmon();
        creature.kind();
        creature.breathe();
    }
}
