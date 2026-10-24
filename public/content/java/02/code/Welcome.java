// Welcome.java
// 02강 강의 화면의 Test01_welcome 예제를 정리한 파일이에요.
// 강의에서는 Eclipse의 basicJava 프로젝트 > src > oop02 패키지 안에 만들었기 때문에
// 맨 위에 "package oop02;" 가 있었어요. 여기서는 터미널에서 바로 실행하기 쉽도록 package 줄을 뺐어요.

public class Welcome {                           // 클래스 이름(Welcome) = 파일 이름(Welcome.java). 첫 글자는 대문자로!

    public static void main(String[] args) {     // main 함수: 프로그램이 시작되는 곳

        // 한줄 주석 (보충설명) - 슬래시 두 개 뒤의 글은 자바가 실행하지 않고 건너뛰어요.
        /*  여러줄 주석
            시작 기호와 끝 기호 사이에 있는 글은
            몇 줄이든 전부 주석이에요. */

        // 환영합니다

        System.out.print(123);                   // 123을 출력해요. print는 줄을 바꾸지 않아요.
        System.out.print(456);                   // 바로 옆에 456이 붙어서 "123456"이 돼요.

        // 콘솔창 출력 단축키(Eclipse): syso 입력 후 Ctrl+Space
        System.out.println(789);                 // 789를 출력하고 줄을 바꿔요(ln = line, 엔터).
        System.out.println(10);                  // 앞에서 줄이 바뀌었으니 10은 다음 줄에 나와요.

    }                                            // main 끝
}                                                // 클래스 끝
