// 17강 예제 2: this() 로 같은 클래스의 다른 생성자 부르기
public class ThisConstructor {
    public static void main(String[] args) {
        Sungjuk a = new Sungjuk();            // 기본 생성자 -> this("무궁화")
        a.print();

        Sungjuk b = new Sungjuk(90, 80, 70);  // this("코리아") 후 평균 계산
        b.print();

        Sungjuk c = new Sungjuk("서울", 100, 90, 80); // 생성자 안에서 일반 메소드 calc() 호출
        c.print();
    }
}

class Sungjuk {
    private String name;
    private int kor, eng, mat;
    private int aver;

    public Sungjuk() {
        // Sungjuk("무궁화");  // 에러: 생성자 이름으로 직접 부를 수 없어요
        this("무궁화");        // 자기 생성자는 this(...) 로 불러요
        System.out.println("기본 생성자 실행");
    }

    public Sungjuk(String name) {
        this.name = name;
        System.out.println("이름 생성자 실행: " + name);
    }

    public Sungjuk(int k, int e, int m) {
        this("코리아");           // this() 는 반드시 생성자의 첫 줄!
        this.aver = (k + e + m) / 3;
        // this("코리아");        // 여기에 쓰면 에러 (첫 줄이 아니라서)
    }

    public Sungjuk(String n, int k, int e, int m) {
        this.name = n;
        this.kor = k;
        this.eng = e;
        this.mat = m;
        calc();                   // 생성자는 일반 메소드를 부를 수 있어요
    }

    public void calc() {
        // this();                // 에러: 일반 메소드에서는 생성자를 부를 수 없어요
        this.aver = (kor + eng + mat) / 3;
    }

    public void print() {
        System.out.println(name + " 평균: " + aver);
    }
}
