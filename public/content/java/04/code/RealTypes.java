// 04강 예제 2: 실수형 자료형(float, double)
public class RealTypes {
    public static void main(String[] args) {
        // 실수형 크기: float(4바이트) < double(8바이트)
        // double이 소수점 아래를 더 정밀하게 표현한다

        float f = 1.2f;    // float는 숫자 뒤에 f(접미사)를 반드시 붙인다
        double d = 3.4d;   // double은 d를 붙일 수 있지만 생략 가능
        double d2 = 3.4;   // 그래서 보통은 이렇게 d 없이 쓴다

        System.out.println(f);   // 1.2 출력
        System.out.println(d);   // 3.4 출력
        System.out.println(d2);  // 3.4 출력

        // float f2 = 1.2;  // 에러! f를 빼면 1.2는 double로 취급돼서 float에 못 넣는다
    }
}
