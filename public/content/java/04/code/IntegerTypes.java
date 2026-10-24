// 04강 예제 1: 정수형 자료형(byte, short, int, long)과 변수의 특징
public class IntegerTypes {
    public static void main(String[] args) {
        // 정수형은 크기 순서로 byte < short < int < long
        //               1바이트  2바이트  4바이트  8바이트

        byte b;            // b라는 이름의 byte형 변수를 만든다(선언)
        b = 3;             // b에 3을 넣는다(대입)
        System.out.println(b);      // 3 출력
        System.out.println(b + 1);  // b에 들어 있는 3에 1을 더한 값 4 출력 (b 자체는 그대로 3)

        short s = 5;       // 선언과 대입을 한 줄에 동시에
        System.out.println(s);      // 5 출력

        int i = 7;         // 정수는 보통 int를 가장 많이 쓴다
        System.out.println(i);      // 7 출력

        long l = 9;        // 아주 큰 정수를 담을 때 쓰는 long
        System.out.println(l);      // 9 출력

        // int i = 2;      // 에러! 자료형은 처음 한 번만 붙인다 (i는 이미 위에서 선언됨)
        i = 2;             // 이미 있는 변수에 새 값을 넣을 때는 자료형 없이 이름만 쓴다

        int c = 2, d = 4;  // 같은 자료형 변수는 쉼표(,)로 이어서 한 번에 선언 가능
        System.out.println(c + d);  // 2 + 4 = 6 출력

        c = 10;            // 변수는 값이 바뀔 수 있다(이전 값 2는 사라짐)
        d = 20;            // d도 4 -> 20으로 바뀜
        System.out.println(c + d);  // 10 + 20 = 30 출력
    }
}
