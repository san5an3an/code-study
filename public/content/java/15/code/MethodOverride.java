// 강의 [17:03]~[24:08] 예제: 메소드 오버라이드(재정의, 리폼)

// 부모 클래스
class School {
    public String name = "학교"; // public 이라 자식이 물려받아요

    // final 메소드: 자식이 고쳐 쓸(오버라이드할) 수 없어요. 호출은 가능해요
    public final void view() {
        System.out.println("School.view() 호출됨");
    } // view() end

    // 보통 메소드: 자식이 고쳐 쓸 수 있어요
    public void disp() {
        System.out.println("School.disp() 호출됨");
    } // disp() end
} // class School end

// 1) 오버라이드 하기 전: 부모가 물려준 것을 그대로 써요
class MiddleSchool extends School {
    // 아무것도 안 고쳤어요
} // class MiddleSchool end

// 2) 오버라이드 한 후: 물려받은 disp() 를 내 상황에 맞게 다시 작성
class HighSchool extends School {
    // 같은 이름의 변수를 새로 만들었어요 (이건 오버라이드가 아니라 "가리기"예요. 노트 참고)
    String name = "고등학교";

    @Override // "이건 부모 메소드를 재정의한 거예요" 라고 컴파일러에게 알려 확인받는 표시(어노테이션)
    public void disp() { // 이름, 매개변수, 리턴형은 부모와 똑같이. 내용만 바꿔요
        System.out.println("HighSchool.disp() 호출됨");
    } // disp() end

    // 아래는 에러예요. final 메소드는 오버라이드할 수 없어요
    // @Override
    // public void view() {}   // 에러: overridden method is final
} // class HighSchool end

public class MethodOverride {

    public static void main(String[] args) {
        // 1) 오버라이드 하기 전
        MiddleSchool ms = new MiddleSchool();
        System.out.println(ms.name); // 부모의 name "학교"
        ms.view();                   // 부모의 view()
        ms.disp();                   // 부모의 disp()

        System.out.println("------------------");

        // 2) 오버라이드 한 후
        HighSchool hs = new HighSchool();
        System.out.println(hs.name); // HighSchool 이 새로 만든 name "고등학교"
        hs.view();                   // final 이라 못 고쳤으니 부모 것 그대로
        hs.disp();                   // 내가 고친 disp() 가 실행돼요
    } // main() end
}
