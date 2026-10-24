// 강의 [09:24]~[18:10] 예제: 사원 클래스로 static 변수/함수 접근 방법 비교하기
// 강의에서는 Sawon.java 를 따로 만들었지만, 여기서는 한 파일에 같이 뒀어요

// 설계도(클래스): 사원 한 명의 정보
class Sawon {
    // 멤버 변수(필드): 사원마다 따로 가지는 값 -> 객체마다 하나씩 생겨요
    String sabun; // 사원 번호
    String name;  // 이름
    int pay;      // 급여

    // 기본 생성자(default constructor): 매개변수가 없는 생성자
    public Sawon() {}

    // 생성자 오버로드: 매개변수가 다른 생성자를 하나 더 만들어요
    public Sawon(String s, String n, int p) {
        sabun = s; // 전달받은 사원 번호를 멤버 변수에 저장
        name = n;  // 이름 저장
        pay = p;   // 급여 저장
    }

    // static 변수: 사원 모두가 "같이 쓰는" 값 -> 클래스에 딱 하나만 있어요
    static String COMPANY = "(주)대한민국IT 아카데미"; // 회사 이름
    static double TAX = 0.03;                        // 세율 3%
    static int SUDANG = 10;                          // 수당

    // static 함수: 객체 없이 Sawon.line() 으로 부를 수 있어요
    static void line() {
        System.out.println("----------------------");
    } // line() end
}

public class StaticSawon {

    public static void main(String[] args) {
        // 1. static 특징을 살리지 않은 경우 (동작은 하지만 추천하지 않아요)
        Sawon one = new Sawon("1001", "무궁화", 100);

        // 세금 = 급여 * 0.03, (int) 로 소수점 아래를 버려요
        int myTax = (int) (one.pay * one.TAX);   // one.TAX : 객체 이름으로 static 변수에 접근
        // 실수령액 = (급여 + 수당) - 세금
        int total = (one.pay + one.SUDANG) - myTax;

        System.out.println(one.COMPANY);   // static 변수인데 객체 이름으로 접근 (비추천)
        System.out.println(one.sabun);
        System.out.println(one.name);
        System.out.println(one.pay);
        System.out.println(one.SUDANG);
        System.out.println("세금 : " + myTax);
        System.out.println("실수령액 : " + total);
        one.line();                        // static 함수도 객체 이름으로 부름 (비추천)

        // 2. static 특징을 살린 경우 (추천)
        Sawon two = new Sawon("1002", "오필승", 200);
        myTax = (int) (two.pay * Sawon.TAX);       // 클래스 이름으로 static 변수 접근
        total = (two.pay + Sawon.SUDANG) - myTax;

        System.out.println(Sawon.COMPANY); // 회사 이름은 모두 같으니 클래스 이름으로
        System.out.println(two.sabun);     // 사원 번호는 사람마다 다르니 객체 이름으로
        System.out.println(two.name);
        System.out.println(two.pay);
        System.out.println(Sawon.SUDANG);
        System.out.println("세금 : " + myTax);
        System.out.println("실수령액 : " + total);
        Sawon.line();                      // static 함수는 클래스 이름으로
    } // main() end
}
