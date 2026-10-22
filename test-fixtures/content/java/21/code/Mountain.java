// 21강 예제 3에서 쓰는 사용자 정의 클래스 (산 정보)
public class Mountain {

    String name;    // 산 이름
    int height;     // 산 높이

    public Mountain() {}    // 기본 생성자

    public Mountain(String name, int height) {
        this.name = name;       // this.멤버변수 = 매개변수
        this.height = height;
    }
}
