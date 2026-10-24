// 강의 [11:39]~[22:18] 예제: 클래스 만들기, new 로 객체 생성, 접근 제어(public / 생략 / private)
// 강의에서는 Sungjuk.java 와 Test01_modifier.java 두 파일로 나눴지만,
// 여기서는 실행하기 쉽게 한 파일에 두 클래스를 같이 넣었어요.

// 성적(Sungjuk) 클래스 : 학생 한 명의 이름과 점수를 담는 "설계도"
// public 이 아닌 보조 클래스라서 앞에 public 을 안 붙였어요 (한 파일에 public 클래스는 하나만)
class Sungjuk {
    // ---- 멤버 변수(필드) : 이 클래스로 만든 객체가 각자 갖게 될 값 ----
    public String name;   // public : 어디서든 접근 가능
    int kor, eng, mat;    // 접근 제어를 생략 -> "package"(같은 패키지에서만 접근 가능)
    private int aver;     // private : 이 클래스 안에서만 접근 가능

    // ---- 멤버 함수(메소드) : 이 클래스로 만든 객체가 할 수 있는 일 ----
    public void calc() {                 // public : 밖에서 불러도 돼요
        aver = (kor + eng + mat) / 3;    // 같은 클래스 안이라 private 인 aver 도 마음대로 써요
    } // calc() end

    void disp() {                        // 접근 제어 생략 -> package
        System.out.println(name);        // 이름 출력
        System.out.println(kor);         // 국어 점수
        System.out.println(eng);         // 영어 점수
        System.out.println(mat);         // 수학 점수
        System.out.println(aver);        // 평균 (calc() 를 먼저 불러야 계산돼 있어요)
    } // disp() end

    private void view() {}               // private : 밖에서는 부를 수 없어요 (확인용 빈 메소드)
} // Sungjuk end

public class ClassBasic {
    public static void main(String[] args) {
        // new 클래스이름() : RAM 의 heap 공간에 객체를 하나 만들어요
        // 주소를 아무 변수에도 저장하지 않아서, 이 객체는 만들고 나서 쓸 방법이 없어요
        new Sungjuk();

        // sj : 참조 변수. 객체가 만들어진 곳의 "주소"를 저장해요
        // 자료형은 int 가 아니라 클래스 이름(Sungjuk) 이에요
        Sungjuk sj = new Sungjuk();

        // 점(.) 연산자 : "sj 가 가리키는 객체 안의 ~" 라는 뜻
        sj.name = "손흥민";  // public -> 접근 가능
        sj.kor = 100;        // package -> 같은 패키지라 접근 가능
        sj.eng = 90;
        sj.mat = 80;
        // sj.aver = 90;     // 에러! aver 는 private 이라 밖에서 접근할 수 없어요

        sj.calc();           // 평균 계산 (public)
        sj.disp();           // 내용 출력 (package)
        // sj.view();        // 에러! view() 는 private
    } // main() end
}
