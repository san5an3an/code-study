// 17강 예제 1: this 로 멤버 변수와 지역 변수/매개변수 구분하기
public class ThisKeyword {
    public static void main(String[] args) {
        // 기본 생성자로 객체 만들기 (name 은 처음 값 "무궁화" 그대로)
        Score score = new Score();
        score.disp();

        System.out.println("-----");

        // 매개변수 이름이 멤버 변수와 같은 생성자 사용
        Score s2 = new Score("홍길동", 90, 80, 70);
        s2.printAll();
    }
}

class Score {
    // 멤버 변수(필드): 클래스 안 어디서든 쓸 수 있어요
    private String name = "무궁화";
    private int kor, eng, mat;
    private int aver;

    // 생성자를 하나라도 직접 만들면 기본 생성자는 자동으로 안 생겨요
    // 그래서 기본 생성자를 직접 적어 두는 걸 추천해요
    public Score() {}

    public Score(String n) {
        name = n; // 이름이 겹치지 않으니 this 없이도 멤버 변수를 가리켜요
    }

    // 매개변수 이름이 멤버 변수와 같을 때는 this. 로 멤버 변수를 콕 집어요
    public Score(String name, int kor, int eng, int mat) {
        this.name = name; // 왼쪽 = 멤버 변수, 오른쪽 = 매개변수
        this.kor = kor;
        this.eng = eng;
        this.mat = mat;
        this.aver = (kor + eng + mat) / 3;
    }

    public void disp() {
        String name = "오필승";           // 지역 변수 (이 메소드 안에서만 살아요)
        System.out.println(name);        // 아무것도 안 붙이면 지역 변수가 우선 -> 오필승
        System.out.println(this.name);   // this. 를 붙이면 멤버 변수 -> 무궁화
    }

    public void printAll() {
        System.out.println(name + " " + kor + " " + eng + " " + mat + " 평균 " + aver);
    }
}
