// 참고(강의 밖 내용): static 변수는 모든 객체가 "하나를 같이" 쓴다는 것 확인하기

class Member {
    String name;          // 일반 멤버 변수: 객체마다 따로
    static int count = 0; // static 변수: 클래스에 딱 하나, 모두가 같이 씀

    Member(String n) {
        name = n;  // 내 이름은 내 것에만 저장
        count++;   // 회원이 하나 만들어질 때마다 공용 카운터를 1 올려요
    }
}

public class StaticShared {

    public static void main(String[] args) {
        System.out.println("처음 회원 수: " + Member.count); // 객체가 하나도 없어도 쓸 수 있어요

        Member a = new Member("철수");
        Member b = new Member("영희");
        Member c = new Member("민수");

        System.out.println(a.name + ", " + b.name + ", " + c.name); // 이름은 각자 달라요
        System.out.println("지금 회원 수: " + Member.count);       // 3 (세 객체가 같은 count 를 올렸어요)

        Member.count = 100;                 // 클래스 이름으로 값을 바꾸면
        System.out.println(a.count);         // 어느 객체로 봐도 100 (비추천 접근이지만 확인용)
    } // main() end
}
