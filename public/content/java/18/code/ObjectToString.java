// 18강 예제 1: 모든 클래스의 조상 Object 와 toString()

// 부모를 안 적으면 자동으로 extends Object 가 붙어요. (적어도 되고 생략해도 돼요)
class Korea extends Object {
    String name = "대한민국"; // 설명을 위해 private 을 안 붙였어요

    public void disp() {
        System.out.println(this.name); // this.name = Korea 의 name
    }
}

// Seoul 은 Korea 를 물려받아요.
class Seoul extends Korea {
    String name = "서울특별시"; // 부모와 같은 이름의 변수를 새로 만들었어요

    @Override // 물려받은 disp() 를 다시 작성(오버라이드)
    public void disp() {
        System.out.println("Seoul " + name);
    }

    @Override // Korea 에는 없지만 Object 에서 물려받은 toString() 을 다시 작성
    public String toString() {
        return "[name=" + name + "]";
    }
}

// Busan 은 이클립스 Source 메뉴로 자동 생성한 모양을 따라 했어요.
class Busan extends Korea {
    private String name = "부산광역시";
    private String addr = "경상남도";

    public Busan() {} // 기본 생성자

    // getter / setter : private 변수를 밖에서 읽고 바꾸는 창구
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getAddr() { return addr; }
    public void setAddr(String addr) { this.addr = addr; }

    @Override // 변수 값을 한눈에 보려고(디버깅용) 많이 만들어요
    public String toString() {
        return "Busan [name=" + name + ", addr=" + addr + "]";
    }
}

public class ObjectToString {
    public static void main(String[] args) {
        Seoul seoul = new Seoul();
        seoul.disp();                          // Seoul 이 다시 쓴 disp()
        System.out.println(seoul.toString());  // Seoul 이 다시 쓴 toString()

        Busan busan = new Busan();
        busan.disp();                          // Busan 은 disp() 를 안 고쳤어요 → Korea 의 disp() 실행
        System.out.println(busan.toString());
        System.out.println(busan);             // println 에 객체를 주면 toString() 이 자동으로 불려요

        Korea korea = new Korea();
        // toString() 을 안 고친 클래스: Object 의 기본 toString() 이 나와요 (클래스이름@숫자)
        System.out.println(korea.toString().startsWith("Korea@"));
    }
}
