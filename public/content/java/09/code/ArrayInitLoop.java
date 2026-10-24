// 선언과 동시에 초기값 넣기 { } + for 반복문으로 한꺼번에 출력하기
public class ArrayInitLoop {
    public static void main(String[] args) {
        // 중괄호 안에 값을 나열하면 new 없이도 배열이 만들어진다
        // 값이 3개이므로 칸도 자동으로 3개(인덱스 0, 1, 2)
        int[] eng = {70, 80, 90};

        // i는 0부터 시작, eng.length(=3) "보다 작을 때까지" 반복, 한 번 돌 때마다 1 증가
        // -> i가 0, 1, 2 로 바뀌면서 인덱스 규칙과 딱 맞아떨어진다
        for (int i = 0; i < eng.length; i = i + 1) {
            System.out.println(eng[i]); // i번째 칸 출력
        } // for end

        // 문자열(String) 배열: 큰따옴표 데이터만 모을 수 있다
        String[] name = {"무궁화", "진달래", "개나리"};
        for (int i = 0; i < name.length; i = i + 1) {
            System.out.println(name[i]);
        } // for end

        // 실수(double) 배열: 소수점 있는 값만 모을 수 있다
        double[] height = {165.2, 180.6, 175.9};
        for (int i = 0; i < height.length; i = i + 1) {
            System.out.println(height[i]);
        } // for end

        // 문자(char) 배열: 작은따옴표 안에 글자 하나씩
        char[] ch = {'S', 'K', 'Y'};
        for (int i = 0; i < ch.length; i++) { // i++ 는 i = i + 1 과 같은 뜻
            System.out.println(ch[i]);
        } // for end
    }
}
