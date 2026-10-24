// 참고(강의 밖 내용): 래퍼 클래스를 실제로 가장 많이 쓰는 곳 - 문자열을 숫자로 바꾸기
public class WrapperParse {

    public static void main(String[] args) {
        String text = "123";                     // 글자로 된 "123" (숫자 아님)
        System.out.println(text + 1);            // 문자열 + 숫자 = 이어 붙이기 -> 1231

        int num = Integer.parseInt(text);        // 문자열 "123" 을 int 123 으로
        System.out.println(num + 1);             // 진짜 덧셈 -> 124

        double d = Double.parseDouble("3.5");    // 문자열 "3.5" 를 double 3.5 로
        System.out.println(d * 2);               // 7.0

        String back = String.valueOf(num);       // 반대로 int 를 문자열로
        System.out.println(back.length());       // 글자 수 -> 3

        // 포장(박싱)과 풀기(언박싱)는 자바가 자동으로 해 줘요
        Integer boxed = 10;                      // int 10 -> Integer 로 자동 포장
        int plain = boxed;                       // Integer -> int 로 자동 풀기
        System.out.println(plain * 3);           // 30

        // 각 자료형이 담을 수 있는 최댓값도 래퍼 클래스가 알려줘요
        System.out.println(Integer.MAX_VALUE);   // 2147483647
    } // main() end
}
