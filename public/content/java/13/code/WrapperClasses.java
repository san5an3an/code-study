// 강의 [20:31]~[27:25] 예제: 래퍼(Wrapper, 포장) 클래스 - 기본 자료형을 클래스로 쓰기
public class WrapperClasses {

    public static void main(String[] args) {

        // ----- boolean / Boolean -----
        boolean boo1 = true;      // 기본형
        Boolean boo4 = false;     // 클래스형. 값을 바로 넣으면 자바가 알아서 포장해 줘요
        Boolean boo5 = true;
        // 강의의 옛날 방식 new Boolean(false) 는 지금은 쓰지 말라고(deprecated) 경고가 나와요
        System.out.println(boo1);
        System.out.println(boo4.toString()); // 점(.)으로 메소드를 쓸 수 있어요. 결과는 문자열 "false"
        System.out.println(boo5.toString()); // 문자열 "true"

        // ----- byte / Byte -----
        byte by1 = 3;             // 기본형
        Byte by2 = 5;             // 클래스형
        Byte by3 = 7;
        System.out.println(by1);
        System.out.println(by2.doubleValue()); // double 로 바꿔서 -> 5.0
        System.out.println(by3.toString());    // 문자열 "7"

        // ----- int / Integer (이름 주의: Int 가 아니라 Integer) -----
        int in1 = 2;              // 기본형
        Integer in2 = 4;          // 클래스형
        Integer in3 = Integer.valueOf("6"); // 문자열 "6" 을 Integer 로 (강의의 new Integer("6") 대신)
        Integer in4 = 8;
        System.out.println(in1);
        System.out.println(in2.doubleValue()); // 4.0
        System.out.println(in3.longValue());   // long 으로 -> 6
        System.out.println(in4.toString());    // 문자열 "8"
        System.out.println(in2 + in3);         // 클래스형끼리도 기본형처럼 계산돼요 -> 10

        // ----- double / Double -----
        double dou1 = 2.3;
        Double dou2 = 4.5;
        Double dou3 = 6.7;
        System.out.println(dou1);
        System.out.println(dou2.isNaN());      // NaN(Not a Number, 숫자가 아님)인가? -> false
        System.out.println(dou1 + dou3);       // 2.3 + 6.7 -> 9.0

        // ----- char / Character (이름 주의: Char 가 아니라 Character) -----
        char ch1 = 'R';
        Character ch2 = 'B';
        Character ch3 = 'T';
        System.out.println(ch1);
        System.out.println(ch2.toString());    // 문자열 "B"
        System.out.println(ch3.toString());    // 문자열 "T"
    } // main() end
}
