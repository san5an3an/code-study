// 강의 [07:12]~[17:00] 예제: 상속(extends) 기본
// AA -> BB -> CC 로 대를 이어 물려받는 모습을 확인해요

// 부모 클래스 AA
class AA {
    // private 메소드: AA 클래스 안에서만 쓸 수 있어요 (자식에게 물려주지 않아요)
    private void zero() {
    } // zero() end

    public void one() {
        System.out.println("AA.one() 호출됨");
    } // one() end

    public void two() {
        System.out.println("AA.two() 호출됨");
    } // two() end
} // class AA end

// BB 는 AA 를 상속받아요. 형식: class 자식클래스 extends 부모클래스
class BB extends AA {
    // BB 가 새로 추가한 메소드
    public void three() {
        System.out.println("BB.three() 호출됨");
    } // three() end
} // class BB end

// CC 는 BB 를 상속받아요. BB 가 AA 에게 받은 것까지 같이 물려받아요
class CC extends BB {
    public void four() {
        System.out.println("CC.four() 호출됨");
    } // four() end
} // class CC end

// 아래처럼 부모를 두 개 쓰면 에러예요. 자바 클래스는 부모를 하나만 가질 수 있어요(단일 상속)
// class DD {}
// class EE extends AA, DD {}   // 에러: '{' expected

// 아래처럼 부모에 final 을 붙이면 아무도 상속받을 수 없어요
// final class FF {}
// class GG extends FF {}       // 에러: cannot inherit from final FF

public class Inheritance {

    public static void main(String[] args) {
        // 1) 부모 클래스 AA 부터 확인
        AA aa = new AA(); // AA 객체를 만들어 참조 변수 aa 에 연결
        aa.one();         // AA 자기 메소드
        aa.two();
        // aa.zero();     // 에러: private 은 클래스 내부에서만 쓸 수 있어요
        System.out.println("----------------");

        // 2) BB: 자기 것 three() + 물려받은 one(), two()
        BB bb = new BB();
        bb.three(); // BB 자기 메소드
        bb.one();   // AA 에게 물려받은 메소드
        bb.two();   // AA 에게 물려받은 메소드
        // bb.zero(); // 에러: private 메소드는 물려받지 못해요
        System.out.println("----------------");

        // 3) CC: 자기 것 four() + BB 의 three() + AA 의 one(), two() = 4개
        CC cc = new CC();
        cc.four();  // CC 자기 메소드
        cc.three(); // BB 에게 물려받은 메소드
        cc.one();   // BB 를 거쳐 AA 에게 물려받은 메소드
        cc.two();
    } // main() end
}
