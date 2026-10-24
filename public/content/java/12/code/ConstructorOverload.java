// 강의 [22:20]~[28:21] 예제: 생성자 함수(Constructor)와 생성자 오버로드
// 강의의 School.java + Test02_constructor.java 를 한 파일로 합쳤어요.

// 학교 성적(School) 클래스 : 가장 흔한 설계 방식 -> 멤버 변수는 private, 메소드는 public
class School {
    // ---- 멤버 변수 : 전부 private 으로 숨겨요 (정보 은닉) ----
    private String name;
    private int kor, eng, mat;
    private int aver;

    // ---- 생성자 함수 : 이름이 클래스 이름(School)과 똑같고, 리턴형을 쓰지 않아요 ----
    // new 로 객체가 만들어질 때 맨 처음 한 번 자동으로 실행돼요

    public School() {}                     // ① 전달값 없는 생성자 (아무것도 안 함)

    public School(String n) {              // ② 문자열 1개를 받는 생성자
        name = n;                          // 받은 이름을 멤버 변수 name 에 저장
    } // end

    public School(int k, int e, int m) {   // ③ 정수 3개를 받는 생성자
        kor = k;                           // 국어
        eng = e;                           // 영어
        mat = m;                           // 수학
    } // end

    public School(String n, int k, int e, int m) { // ④ 문자열 1개 + 정수 3개
        name = n;
        kor = k;
        eng = e;
        mat = m;
    } // end

    // ---- 멤버 함수 : 전부 public 으로 열어요 ----
    public void calc() {
        aver = (kor + eng + mat) / 3;      // int 끼리 나눗셈 -> 소수점 아래는 버려져요
    } // calc() end

    public void disp() {
        System.out.println(name);
        System.out.println(kor);
        System.out.println(eng);
        System.out.println(mat);
        System.out.println(aver);
    } // disp() end
} // School end

public class ConstructorOverload {
    public static void main(String[] args) {
        new School();  // ① 이 불려요. 객체는 만들어지지만 주소를 저장 안 해서 못 써요

        // 넘기는 값의 개수·자료형을 보고 자바가 알맞은 생성자를 골라 불러요
        School one   = new School("무궁화");              // ② 이 불림 -> 이름만 채워짐
        School two   = new School(10, 20, 30);            // ③ 이 불림 -> 점수만 채워짐
        School three = new School("오필승", 60, 50, 30);  // ④ 이 불림 -> 전부 채워짐

        one.calc();    // 점수가 없으니 (0+0+0)/3 = 0
        one.disp();

        two.calc();    // (10+20+30)/3 = 20
        two.disp();    // 이름을 안 넣었으니 name 은 null 로 나와요

        three.calc();  // (60+50+30)/3 = 140/3 = 46 (나머지 버림)
        three.disp();
    } // main() end
}
