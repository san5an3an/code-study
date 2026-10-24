// 16강 예제 4: GregorianCalendar 의 isLeapYear() 로 윤년 판별하기
import java.util.GregorianCalendar; // 이것도 java.util 패키지

public class LeapYearExample {

    public static void main(String[] args) {
        // GregorianCalendar 는 new 로 객체를 만들어서 써요
        GregorianCalendar now = new GregorianCalendar();

        // isLeapYear(연도) : 윤년이면 true, 평년이면 false 를 돌려줘요
        // 결과가 boolean 이니까 if 문의 조건에 바로 넣을 수 있어요
        if (now.isLeapYear(2023)) {
            System.out.println("2023: 윤년");
        } else {
            System.out.println("2023: 평년");
        }

        if (now.isLeapYear(2020)) {
            System.out.println("2020: 윤년");
        } else {
            System.out.println("2020: 평년");
        }

        // 참고(강의 밖): "4년마다 윤년"에는 예외가 있어요
        // 100으로 나누어떨어지면 평년, 그래도 400으로 나누어떨어지면 윤년
        int[] years = {1900, 2000, 2024};
        for (int i = 0; i < years.length; i++) {
            int y = years[i];
            System.out.println(y + ": " + (now.isLeapYear(y) ? "윤년" : "평년"));
        }
    }
}
