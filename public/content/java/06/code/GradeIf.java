// 06강 예제 1: if 조건문으로 성적 판정하기
public class GradeIf {
    public static void main(String[] args) {
        // 성적 프로그램에 쓸 데이터 (값을 바꿔 가며 결과가 어떻게 달라지는지 꼭 확인해 보세요)
        String name = "무궁화";              // 이름 (문자열)
        int kor = 100, eng = 100, mat = 35;  // 국어, 영어, 수학 점수 (정수)

        // 평균 구하기: 세 점수를 "먼저" 더한 뒤 3.0으로 나눠요
        // 괄호가 없으면 mat / 3.0 이 먼저 계산돼서 엉뚱한 값이 나와요
        // 3이 아니라 3.0으로 나누는 이유: 소수점까지 있는 실수(double) 결과를 얻기 위해서예요
        double aver = (kor + eng + mat) / 3.0;

        // 출력하기 (printf: %s=문자열, %d=정수, %.2f=소수 둘째 자리까지, \n=줄바꿈)
        System.out.printf("이름 : %s\n", name);
        System.out.printf("국어 : %d\n", kor);
        System.out.printf("영어 : %d\n", eng);
        System.out.printf("수학 : %d\n", mat);
        System.out.printf("평균 : %.2f\n", aver);

        // [1형식] 조건이 true일 때만 실행해요
        // 평균이 95점 이상이면 "장학생" 출력 (지금은 78.33 >= 95 → false라서 아무것도 안 나와요)
        if (aver >= 95) {
            System.out.println("장학생");
        } // if 끝

        // [2형식] true면 위쪽, false면 else 쪽 - 둘 중 딱 하나만 실행돼요
        // 국어 점수가 70점 이상이면 합격, 아니면 불합격
        if (kor >= 70) {                       // 100 >= 70 → true
            System.out.println("국어:합격");
        } else {                               // 조건이 false일 때만 여기로 와요
            System.out.println("국어:불합격");
        } // if 끝

        // [중첩 if (else if)] 조건을 위에서부터 차례로 물어보다가
        // 처음으로 true가 나온 곳 하나만 실행하고, if 덩어리 전체를 빠져나가요
        if (mat >= 90) {                       // 35 >= 90 → false, 다음 조건으로
            System.out.println("수학:A학점");
        } else if (mat >= 80) {                // 35 >= 80 → false
            System.out.println("수학:B학점");
        } else if (mat >= 70) {                // 35 >= 70 → false
            System.out.println("수학:C학점");
        } else if (mat >= 60) {                // 35 >= 60 → false
            System.out.println("수학:D학점");
        } else {                               // 위 조건이 전부 false면 무조건 여기
            System.out.println("수학:F학점");
        } // if 끝
    }
}
