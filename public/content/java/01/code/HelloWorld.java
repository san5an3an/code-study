// HelloWorld.java
// 01강은 개념 소개라 코드가 없어요. 대신 "소스 코드(.java) -> 컴파일 -> 목적 코드(.class) -> 실행"
// 흐름을 직접 겪어볼 수 있도록 가장 짧은 자바 프로그램 하나를 둡니다.
//
// 실행 방법 (macOS 터미널, 이 파일이 있는 폴더에서):
//   javac -encoding UTF-8 HelloWorld.java   <- 번역(컴파일). HelloWorld.class 파일이 생겨요.
//   java HelloWorld                          <- JVM이 HelloWorld.class를 실행해요.

public class HelloWorld {                        // 클래스 이름 HelloWorld = 파일 이름 HelloWorld.java (반드시 같아야 해요)

    public static void main(String[] args) {     // 프로그램이 시작되는 지점(입구). 자바는 항상 main부터 실행해요.

        System.out.println("Hello, Java!");       // 큰따옴표 안의 글자를 화면(콘솔)에 출력하고 줄을 바꿔요.
        System.out.println("나의 첫 자바 프로그램"); // 한글도 출력할 수 있어요.

    }                                            // main 끝
}                                                // 클래스 끝
