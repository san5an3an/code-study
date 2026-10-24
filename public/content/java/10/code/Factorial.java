// 강의 [23:05]~[26:20] 예제: 팩토리얼을 구하는 메소드
// 팩토리얼: 4! = 4 * 3 * 2 * 1 = 24 처럼 어떤 수부터 1까지 차례로 곱한 값
public class Factorial {

    // int a : 몇 팩토리얼을 구할지 전달받는 매개변수
    public static void fact(int a) {
        long gop = 1; // 곱한 결과를 쌓아 둘 변수. 곱셈은 1에서 시작해야 해요(0이면 계속 0)
                      // long : int 보다 큰 수를 담을 수 있는 정수형 (팩토리얼은 금방 커져요)
        for (int f = a; f >= 1; f--) { // f 가 a 부터 1 까지 1씩 줄어들며 반복
            gop = gop * f;             // 지금까지의 곱에 f 를 곱해서 다시 저장
        } // for end
        System.out.println(gop); // 결과 출력
    } // fact() end

    public static void main(String[] args) {
        fact(4); // 4*3*2*1 = 24
        fact(3); // 3*2*1 = 6
        fact(10); // 메소드는 다시 만들 필요 없이 값만 바꿔서 또 부르면 돼요
    } // main() end
}
