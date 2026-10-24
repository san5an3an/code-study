// 강의 [04:19]~[09:20] 예제: 자바가 미리 만들어 둔 static 변수와 static 함수 써 보기
// 접근 방법: 클래스이름.변수이름 / 클래스이름.함수이름()
// new 로 객체를 만들지 않고 바로 써요
public class StaticLibrary {

    public static void main(String[] args) {
        // Integer.SIZE : int 한 개가 몇 비트(bit)인지 담긴 static 변수
        System.out.println(Integer.SIZE); // 32

        // Integer.max(a, b) : 둘 중 큰 수를 돌려주는 static 함수
        System.out.println(Integer.max(3, 5)); // 5

        // 10진수 15 를 2진수, 8진수, 16진수 "문자열"로 바꿔 돌려줘요
        System.out.println(Integer.toBinaryString(15)); // 1111
        System.out.println(Integer.toOctalString(15));  // 17
        System.out.println(Integer.toHexString(15));    // f

        // Integer.parseInt("789") : 글자 "789" 를 진짜 정수 789 로 바꿔요 (아주 자주 써요)
        int num = Integer.parseInt("789");
        System.out.println(num + 1); // 정수가 됐으니 더하기가 돼요 -> 790

        // Character.getNumericValue('3') : 문자 '3' 을 정수 3 으로 바꿔요
        System.out.println(Character.getNumericValue('3')); // 3

        // Character.toLowerCase('R') : 대문자를 소문자로 바꿔요
        System.out.println(Character.toLowerCase('R')); // r
    } // main() end
}
