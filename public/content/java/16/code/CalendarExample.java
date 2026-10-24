// 16강 예제 3: Calendar 클래스로 현재 날짜와 시간 알아내기
// 실행하는 날짜와 시각에 따라 결과가 달라져요!
import java.util.Calendar; // Calendar 는 java.util 패키지에 있어서 import 가 꼭 필요해요

public class CalendarExample {

    public static void main(String[] args) {
        // 컴퓨터(시스템)의 현재 날짜·시간 정보를 통째로 가져와요
        // Calendar 는 new 로 만들 수 없고, getInstance() 로 받아요
        Calendar cal = Calendar.getInstance();

        // cal.get(무엇) : 원하는 항목 하나를 꺼내요
        System.out.println(cal.get(Calendar.YEAR));          // 년

        // 주의! 월(MONTH)은 0부터 시작해요 (1월 = 0, 12월 = 11)
        System.out.println(cal.get(Calendar.MONTH));         // 실제 월보다 1 작은 값
        System.out.println(cal.get(Calendar.MONTH) + 1);     // +1 해야 우리가 쓰는 월이 돼요

        System.out.println(cal.get(Calendar.DATE));          // 일
        System.out.println(cal.get(Calendar.HOUR));          // 시 (12시간 기준, 0~11)
        System.out.println(cal.get(Calendar.HOUR_OF_DAY));   // 시 (24시간 기준, 0~23)
        System.out.println(cal.get(Calendar.MINUTE));        // 분
        System.out.println(cal.get(Calendar.SECOND));        // 초

        // 요일: 1=일, 2=월, 3=화, 4=수, 5=목, 6=금, 7=토
        int dayOfWeek = cal.get(Calendar.DAY_OF_WEEK);
        System.out.println(dayOfWeek);

        // 숫자 요일을 글자로 바꿔 보기 (배열 칸 0은 비워 두고 1~7 을 씀)
        String[] names = {"", "일", "월", "화", "수", "목", "금", "토"};
        System.out.println(names[dayOfWeek] + "요일");

        // 한 줄로 모아 찍기
        System.out.printf("%d년 %d월 %d일 %d시 %d분 %d초%n",
                cal.get(Calendar.YEAR),
                cal.get(Calendar.MONTH) + 1,
                cal.get(Calendar.DATE),
                cal.get(Calendar.HOUR_OF_DAY),
                cal.get(Calendar.MINUTE),
                cal.get(Calendar.SECOND));
    }
}
