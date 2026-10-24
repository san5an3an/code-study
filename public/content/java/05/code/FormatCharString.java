// 05강 예제 4: printf 로 문자(%c)와 문자열(%s) 출력 + 간단한 표 만들기
public class FormatCharString {
    public static void main(String[] args) {
        // %c : 문자 한 개 (작은따옴표로 감싼 값)
        System.out.printf("%c\n", 'A');           // A
        System.out.printf("#%-5c#\n", 'B');       // #B    #  (5칸, 왼쪽 정렬)

        // %s : 문자열 (큰따옴표로 감싼 값)
        System.out.printf("%s\n", "APPLE");       // APPLE
        System.out.printf("#%-5s#\n", "HI");      // #HI   #  (5칸, 왼쪽 정렬)
        System.out.printf("#%5s#\n", "HI");       // #   HI#  (5칸, 오른쪽 정렬)

        // 여러 서식을 한 줄에 섞어 쓰기 (순서대로 값이 들어간다)
        String name = "홍길동";   // 문자열
        int age = 20;             // 정수
        double height = 175.456;  // 실수
        char grade = 'A';         // 문자
        System.out.printf("이름:%s 나이:%d 키:%.1f 등급:%c\n", name, age, height, grade);

        // 칸 수를 맞추면 표처럼 줄이 가지런해진다
        System.out.printf("%-8s%5s\n", "item", "price");
        System.out.printf("%-8s%5d\n", "apple", 1200);
        System.out.printf("%-8s%5d\n", "melon", 15000);
    }
}
