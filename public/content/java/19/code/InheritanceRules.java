// 19강 예제 3: 클래스와 인터페이스의 상속 규칙
// 강의 화면의 Test03_interface.java 를 실행해 볼 수 있게 내용을 조금 채웠어요.
// (강의에서는 move, attack 안을 비워 두고 실행하지 않았어요.)

class Unit {
    int currentHP;
    int x, y;
}

interface Movable {
    void move(int x, int y);
}

interface Attackable {
    void attack(Unit u);
}

// 규칙 1. 클래스는 부모 클래스를 하나만 가질 수 있어요(단일 상속).
// class Test extends Father, Korea { }   // 에러: 쉼표로 부모 클래스 두 개 지정 불가

// 규칙 2. 인터페이스끼리는 extends 로 여러 개를 한꺼번에 상속할 수 있어요(다중 상속).
interface Fightable extends Movable, Attackable {
}

// 규칙 3. 클래스는 클래스 하나를 extends 하면서, 동시에 인터페이스를 implements 할 수 있어요.
//         순서는 항상 extends 가 먼저, implements 가 나중이에요.
class Fight extends Unit implements Fightable {
    // Fightable 이 물려받은 추상 메소드 move, attack 을 모두 완성해야 에러가 안 나요.
    @Override
    public void move(int x, int y) {
        this.x = x;
        this.y = y;
        System.out.println("(" + x + ", " + y + ") 위치로 이동");
    }

    @Override
    public void attack(Unit u) {
        System.out.println("상대 유닛 공격! 상대 HP: " + u.currentHP);
    }
}

public class InheritanceRules {
    public static void main(String[] args) {
        Fight f = new Fight();
        f.move(3, 5);

        Unit enemy = new Unit();
        enemy.currentHP = 100;
        f.attack(enemy);

        // Fight 객체 하나를 여러 부모 타입 변수에 담을 수 있어요.
        Unit asUnit = f;            // 부모 클래스 타입
        Movable asMovable = f;      // 인터페이스 타입
        Fightable asFightable = f;  // 인터페이스 타입
        asMovable.move(0, 0);
        System.out.println("asUnit 의 x 좌표: " + asUnit.x);
        System.out.println(asFightable instanceof Attackable);
    }
}
