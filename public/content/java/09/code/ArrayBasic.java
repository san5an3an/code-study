// 1차원 배열 기본: 선언, 메모리 잡기(new), 값 넣기, 꺼내기, 개수(length)
public class ArrayBasic {
    public static void main(String[] args) {
        // int 값 5개를 담을 배열을 만든다
        // int[]  : "int 여러 개를 묶은 배열" 이라는 자료형
        // new int[5] : int(4바이트) 칸 5개 = 20바이트 메모리를 새로 잡아 달라는 뜻
        int[] kor = new int[5];

        // 인덱스(칸 번호)는 0부터 시작해서 1씩 늘어난다
        kor[0] = 10; // 0번째 칸에 10 저장
        kor[1] = 20; // 1번째 칸에 20 저장
        kor[2] = 30; // 2번째 칸에 30 저장
        kor[3] = 40; // 3번째 칸에 40 저장
        kor[4] = 50; // 4번째 칸(마지막 칸)에 50 저장

        // 칸 번호로 하나씩 꺼내서 출력
        System.out.println(kor[0]); // 10
        System.out.println(kor[1]); // 20
        System.out.println(kor[2]); // 30
        System.out.println(kor[3]); // 40
        System.out.println(kor[4]); // 50

        // 배열이름.length : 요소(칸)가 몇 개인지 알려준다
        System.out.println(kor.length); // 5

        // 아래 줄의 주석(//)을 지우고 실행하면 에러가 난다
        // 칸은 0~4번까지 5개뿐이라 5번째 칸은 존재하지 않기 때문
        // -> java.lang.ArrayIndexOutOfBoundsException 발생
        // System.out.println(kor[5]);
    }
}
