// 04강 예제 4: 논리형(boolean)
public class BooleanType {
    public static void main(String[] args) {
        // boolean 변수에는 true(참) 또는 false(거짓) 두 값만 넣을 수 있다
        boolean flag = true;      // 따옴표 없이 true라고 쓴다
        System.out.println(flag); // true 출력

        flag = false;             // 변수라서 다른 값으로 바꿀 수 있다
        System.out.println(flag); // false 출력

        // boolean flag2 = "true"; // 에러! 따옴표를 붙이면 문자열이 되어버린다
    }
}
