// 강의 [19:27] 주의사항 정리: 이름이 같아도 메소드마다 변수는 서로 다른 변수예요
public class ParameterScope {

    // 이 a 는 change 메소드 안에서만 살아 있는 매개변수예요
    public static void change(int a) {
        a = 999;                                   // 메소드 안의 a 만 바뀌어요
        System.out.println("change 안의 a: " + a); // 999
    } // change() 가 끝나면 이 a 는 사라져요

    public static void main(String[] args) {
        int a = 5;                                // main 의 a (이름만 같고 다른 변수)
        change(a);                                // a 의 "값" 5 가 복사되어 전달돼요
        System.out.println("main 안의 a: " + a);  // 그대로 5
    }
}
