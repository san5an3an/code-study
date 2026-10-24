// 16강 예제 5: 프로젝트 - 주민번호 앞자리와 성별코드로 출생연도, 나이, 성별 구하기
// 올해 연도를 Calendar 로 가져오기 때문에, 실행하는 해에 따라 나이가 달라져요!
import java.util.Calendar;

public class AgeProject {

    public static void main(String[] args) {
        // 입력값은 고정값으로 둬요 (원래는 Scanner 로 입력받아도 돼요)
        int birthYY = 19;   // 주민번호 맨 앞 두 자리 (태어난 해의 뒤 두 자리)
        int genderCode = 3; // 주민번호 뒷자리 첫 번째 숫자 (성별코드)

        // 성별코드 1, 2 -> 1900년대생 / 3, 4 -> 2000년대생
        int birthYear;
        if (genderCode == 1 || genderCode == 2) {
            birthYear = 1900 + birthYY;
        } else {
            birthYear = 2000 + birthYY;
        }

        // 올해 연도는 매년 바뀌니까 직접 쓰지 않고 Calendar 로 가져와요
        int thisYear = Calendar.getInstance().get(Calendar.YEAR);
        int age = thisYear - birthYear; // 올해 연도 - 태어난 연도

        // 홀수(1, 3)면 남자, 짝수(2, 4)면 여자
        String gender = (genderCode % 2 == 1) ? "남자" : "여자";

        System.out.println("태어난 연도: " + birthYear);
        System.out.println("나이: " + age + "살 (올해 " + thisYear + "년 기준)");
        System.out.println("성별: " + gender);
    }
}
