// 강의 [02:30]~[14:48] 예제: String 클래스의 여러 메소드 (글자 수, 글자 꺼내기, 찾기, 바꾸기)
public class StringMethods {

    public static void main(String[] args) {

        // ----- 글자 수: length() -----
        String name = "KOREA";               // 문자열 5글자
        System.out.println(name.length());   // 글자 수를 int 로 돌려줘요 -> 5

        // new String("...") 으로 만들어도 되고, 그냥 "..." 로 만들어도 돼요
        String str = new String("Gone With The Wind"); // 바람과 함께 사라지다 (공백 포함 18글자)
        System.out.println(str);                        // 문자열 그대로 출력

        // ----- 한 글자 꺼내기: charAt(번호) -----
        // 번호(인덱스)는 0 부터 세요. 리턴형은 char
        char ch = str.charAt(0);              // 0번째 글자 -> 'G'
        System.out.println(ch);               // G
        System.out.println(str.charAt(10));   // 10번째 글자 -> 'T'

        System.out.println(str.charAt(17));   // 마지막 글자를 번호로 직접 -> 'd'
        System.out.println(str.length());     // 글자 수 -> 18
        // 마지막 글자는 "글자 수 - 1" 번째예요. 문자열이 바뀌어도 항상 맞아서 이 방법을 추천해요
        System.out.println(str.charAt(str.length() - 1)); // 'd'

        // ----- 찾기: indexOf / lastIndexOf -----
        System.out.println(str.indexOf("G"));     // 앞에서부터 찾은 첫 위치 -> 0
        System.out.println(str.indexOf("i"));     // i 가 두 개지만 처음 찾은 위치만 -> 6
        System.out.println(str.indexOf("B"));     // 없으면 -1
        System.out.println(str.lastIndexOf("i")); // 뒤에서부터 찾은 위치 (번호는 여전히 앞에서 셈) -> 15

        // ----- 바꾸기 -----
        System.out.println(str.toUpperCase());      // 전부 대문자로
        System.out.println(str.toLowerCase());      // 전부 소문자로
        System.out.println(str.replace('n', 'N'));  // 소문자 n 을 전부 대문자 N 으로
        System.out.println(str);                    // 원래 str 은 그대로예요 (바뀐 새 문자열을 돌려줄 뿐)

        // ----- 비어 있는지: isEmpty() -----
        // 리턴형이 boolean(true/false) 이라 if 의 조건으로 바로 쓸 수 있어요
        if (str.isEmpty()) {                  // 글자 수가 0 이면 true
            System.out.println("비어 있다");
        } else {
            System.out.println("비어 있지 않다");
        } // if end
    } // main() end
}
