// 18강 예제 2: super 와 super()

class School {
    public String name = "학교";

    public School() { // 기본 생성자
        System.out.println("School()...");
    }
}

class MiddleSchool extends School {
    public String name = "중학교";

    public MiddleSchool() {
        super(); // 부모(School) 생성자를 부르는 명령. 안 써도 자바가 자동으로 넣어 줘요
        System.out.println("MiddleSchool()...");
    }

    public void disp() {
        String name = "서울중학교";       // 지역변수(이 메소드 안에서만 사는 변수)
        System.out.println(name);         // 그냥 name  → 가장 가까운 지역변수
        System.out.println(this.name);    // this.name  → 내(MiddleSchool) 멤버변수
        System.out.println(super.name);   // super.name → 부모(School) 멤버변수
    }
}

class HighSchool extends School {
    String name = "고등학교";

    public HighSchool() {
        // super(); 가 여기 숨어 있어요
        System.out.println("HighSchool()...");
    }
}

public class SuperKeyword {
    public static void main(String[] args) {
        // 상속 관계에서는 부모 생성자가 먼저, 내 생성자가 나중에 실행돼요
        MiddleSchool ms = new MiddleSchool();
        ms.disp();

        System.out.println("-----");
        HighSchool hs = new HighSchool();
    }
}
