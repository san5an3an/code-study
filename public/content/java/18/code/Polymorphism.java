// 18강 예제 3: 다형성 (부모 타입 변수 = 자식 객체)

import java.util.Calendar;
import java.util.GregorianCalendar;

class Father {
    public String name = "아버지";
    public String addr = "주소";

    public Father() {}
    public Father(String name, String addr) {
        this.name = name; // this.name = 멤버변수, name = 매개변수
        this.addr = addr;
    }

    public void disp() {
        System.out.println(this.name);
        System.out.println(this.addr);
    }
}

class Son extends Father {
    public Son() {}
    public Son(String n, String a) {
        super(n, a); // 부모 생성자 Father(String, String) 를 불러서 name, addr 을 채워요
    }
}

class Daughter extends Father {
    String friend = "절친"; // Daughter 에만 새로 생긴 변수

    public Daughter() {}
    public Daughter(String n, String a) {
        super(n, a);
    }
}

public class Polymorphism {
    public static void main(String[] args) {
        // 자바가 만들어 둔 다형성 예: Calendar(부모) = GregorianCalendar(자식)
        Calendar cal = new GregorianCalendar();
        System.out.println(cal.get(Calendar.YEAR));  // 실행 시점에 따라 달라짐
        System.out.println(cal.get(Calendar.MONTH)); // 0부터 시작(1월=0) — 실행 시점에 따라 달라짐
        System.out.println(cal.get(Calendar.DATE));  // 실행 시점에 따라 달라짐
        System.out.println("-----");

        Father fa = new Father();       // 평범한 객체 생성
        fa.disp();

        Father father = new Son("손흥민", "영국"); // 부모 타입 변수에 자식 객체를 넣었어요 (다형성)
        father.disp();

        father = new Daughter("김연아", "한국");   // 같은 변수에 다른 자식 객체도 들어가요
        father.disp();

        System.out.println(father.name);
        System.out.println(father.addr);
        // System.out.println(father.friend); // 에러! Father 타입으로는 friend 가 안 보여요
    }
}
