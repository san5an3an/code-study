// 강의 [14:48]~[20:22] 예제: 문자열 자르기(substring), 나누기(split), 앞뒤 공백 지우기(trim), 내용 비교(equals)
public class StringCutCompare {

    public static void main(String[] args) {
        String str = "Gone With The Wind";

        // ----- 자르기: substring -----
        // 번호: G=0 o=1 n=2 e=3 (공백)=4 W=5 i=6 t=7 h=8 (공백)=9 T=10 ...
        System.out.println(str.substring(5));     // 5번째부터 끝까지 -> "With The Wind"
        System.out.println(str.substring(5, 11)); // 5번째부터 (11-1)=10번째까지 -> "With T"

        // ----- 나누기: split -----
        // 기준 글자로 잘라서 String 배열(String[])로 돌려줘요. 기준 글자는 결과에서 빠져요
        String[] word = str.split("n");           // 소문자 n 을 기준으로 나누기
        for (int i = 0; i < word.length; i++) {   // 배열 길이만큼 반복 (09강 배열 복습)
            System.out.println(word[i]);          // 조각 하나씩 출력
        } // for end
        System.out.println("---");

        word = str.split(" ");                    // 공백(스페이스)을 기준으로 나누기 -> 단어별로
        for (int i = 0; i < word.length; i++) {
            System.out.println(word[i]);
        } // for end
        System.out.println("---");

        // ----- 앞뒤 공백 지우기: trim -----
        // 가운데 공백은 그대로, 맨 앞과 맨 뒤 공백만 지워요. # 은 공백이 지워졌는지 보려고 붙인 표시예요
        System.out.println("#" + "   HA   P P  Y    " + "#");        // trim 전
        System.out.println("#" + "   HA   P P  Y    ".trim() + "#"); // trim 후

        // ----- 내용 비교: equals -----
        String a = "HAPPY";
        String b = "HAPPYddd";
        if (a.equals(b)) {                        // 두 문자열의 내용이 같으면 true
            System.out.println("서로 같다");
        } else {
            System.out.println("서로 다르다");
        } // if end

        String c = "HAPPY";
        System.out.println(a.equals(c));          // 내용이 같으니 true
    } // main() end
}
