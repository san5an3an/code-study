// 16강 예제 1: Math 클래스의 상수와 기본 함수
// Math 클래스는 java.lang 패키지에 있어서 import 없이 바로 쓸 수 있어요.
// 모든 멤버가 static 이라서 new 로 객체를 만들지 않고 "Math.이름" 으로 불러요.
public class MathExample {

    public static void main(String[] args) {
        // 1) 수학 상수
        System.out.println(Math.E);   // 자연상수 e (약 2.718)
        System.out.println(Math.PI);  // 원주율 파이 (약 3.14159)

        // 2) 절댓값: 부호를 떼고 0으로부터의 거리만 돌려줘요
        System.out.println(Math.abs(-3));   // int 를 넣으면 int 로 돌려줘요 -> 3
        System.out.println(Math.abs(5));    // 5
        System.out.println(Math.abs(2.4));  // double 을 넣으면 double -> 2.4
        System.out.println(Math.abs(-6.7)); // 6.7

        // 3) 큰 값, 작은 값
        System.out.println(Math.max(8, 9)); // 둘 중 큰 수 -> 9
        System.out.println(Math.min(8, 9)); // 둘 중 작은 수 -> 8

        // 4) 세 수 중 가장 큰 값: max 안에 max 를 또 넣어요
        int a = 10, b = 20, c = 30;
        // 안쪽 Math.max(b, c) 가 먼저 계산되어 30 이 되고,
        // 바깥은 Math.max(10, 30) 이 되어 30 이 나와요
        System.out.println(Math.max(a, Math.max(b, c)));

        // 5) 소수점 처리
        System.out.println(Math.ceil(1.3));  // 올림 -> 2.0 (결과가 double)
        System.out.println(Math.floor(2.7)); // 버림(내림) -> 2.0 (결과가 double)
        System.out.println(Math.round(3.8)); // 반올림 -> 4 (결과가 long, 소수점 없음)
    }
}
