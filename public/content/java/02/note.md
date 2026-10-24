# 02강. 개발 환경 구축 및 콘솔창 출력

## 이 강의에서 배우는 것

- 자바 개발 도구인 **JDK**를 설치하고, 어디서든 자바를 쓸 수 있게 **환경 변수**를 설정해요. (강의는 Windows 기준이고, 이 노트에 **macOS 방법**을 따로 정리했어요.)
- 코딩을 도와주는 프로그램인 **Eclipse(이클립스)**를 설치하고, 작업 공간(workspace), 프로젝트, 패키지, 클래스를 만들어요.
- 자바 문법의 기본 규칙(대소문자 구분, 세미콜론, 클래스 이름, 주석)과 이름 짓는 규칙(식별자)을 배워요.
- 화면(콘솔창)에 결과를 찍는 명령 `System.out.print()` / `System.out.println()`과 Eclipse 단축키를 익혀요.

---

## 1. 준비물 두 가지: JDK와 코딩 툴

| 준비물 | 무엇인가 | 비유 |
|---|---|---|
| **JDK** (Java Development Kit, 자바 개발 키트) | 자바 프로그램을 만들고 실행하는 데 필요한 도구 모음. 01강에서 말한 번역기(컴파일러 `javac`)와 실행기(`java`, JVM)가 여기 들어 있어요. | 요리할 때 필요한 **주방 도구 세트** |
| **코딩 툴** (IDE, 통합 개발 환경) | 코드를 쓰고, 저장하고, 실행하는 것을 한 화면에서 편하게 해 주는 프로그램. 강의에서는 **Eclipse**를 써요. | 도구가 정리된 **주방 작업대** |

왜 코딩 툴이 필요할까요? 프로그래밍은 명령어를 많이 다루는데, 그 철자를 전부 외워서 하는 게 아니에요. 코딩 툴은 명령어를 **불러와서** 자동 완성해 주고, 오타를 빨간 줄로 알려 주고, 버튼 하나로 실행까지 해 줘요.

---

## 2. 강의 방식 (Windows) 따라가기

강의는 Windows + Eclipse 기준이에요. 흐름만 이해해 두고, 실제 설치는 아래 "macOS에서 하는 방법"을 따라 하면 돼요.

1. **작업 폴더 만들기**: 원하는 드라이브에 `workspace` 폴더를 만들어요. 다운로드 파일과 앞으로 만들 자바 소스를 전부 여기 모아요.
2. **JDK 다운로드**: oracle.com -> Products -> Java -> Download Java에서 **JDK 17 Windows용 설치 파일**을 받아요. (강의 당시 19까지 나왔지만 17을 사용해요. 17, 21처럼 오래 지원되는 버전을 LTS라고 해요.)
3. **Eclipse 다운로드**: eclipse.org -> Download -> Other packages에서 **Eclipse IDE for Java Developers** zip 파일을 받아요.
4. **JDK 설치**: 설치 파일을 실행하고 Next만 계속 누르면 돼요.
5. **Eclipse 설치**: zip 파일을 `workspace` 폴더에 **압축만 풀면** 끝이에요. 설치 과정이 따로 없어요.
6. **환경 변수 설정** (Windows):
   - 내 PC 우클릭 -> 속성 -> 고급 시스템 설정 -> 환경 변수 -> 시스템 변수 -> 새로 만들기
   - 변수 이름 `JAVA_HOME`, 변수 값은 JDK가 설치된 경로(예: `C:\Program Files\Java\jdk-17...`). **경로는 손으로 치지 말고 복사해서 붙여 넣기** (오타 방지).
   - 시스템 변수의 `Path` -> 편집 -> 새로 만들기 -> `%JAVA_HOME%\bin` 추가

### 환경 변수는 왜 설정할까?
JDK를 설치해도, 컴퓨터는 `java`나 `javac` 명령을 입력했을 때 그 프로그램이 **어디 있는지** 몰라요. 환경 변수 `Path`에 JDK의 `bin` 폴더 위치를 적어 두면, 어느 폴더에서 명령을 치든 컴퓨터가 거기서 찾아서 실행해 줘요.

> 비유: `Path`는 컴퓨터의 **즐겨찾기 주소록**이에요. "java 실행해 줘" 했을 때 주소록에 적힌 장소들을 차례로 뒤져서 찾아요. 주소록에 없으면 "그런 거 몰라요" 하고 에러를 내요.

---

## 3. macOS(Apple Silicon)에서 하는 방법

이 컴퓨터에는 이미 **JDK 21**이 Homebrew로 `/opt/homebrew/opt/openjdk@21`에 설치되어 있어요. 강의의 JDK 17과 버전만 다를 뿐, 이 강좌에서 배우는 문법은 똑같이 동작해요.

### 3-1. 지금 상태 확인하기
터미널(Spotlight에서 "터미널" 검색)을 열고:
```
java -version
```
아래처럼 나오면 **아직 Path 설정이 안 된 것**이에요. (macOS에 기본으로 있는 가짜 `java` 안내 프로그램이 대답하는 거예요.)
```
The operation couldn't be completed. Unable to locate a Java Runtime.
Please visit http://www.java.com for information on installing Java.
```

### 3-2. Path와 JAVA_HOME 설정 (Windows 환경 변수 설정에 해당)
macOS 터미널 기본 쉘은 zsh예요. zsh는 시작할 때 `~/.zshrc` 파일을 읽으니까, 여기에 설정을 적어 두면 돼요.

```
echo 'export JAVA_HOME="/opt/homebrew/opt/openjdk@21"' >> ~/.zshrc
echo 'export PATH="$JAVA_HOME/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```
- 첫 줄: `JAVA_HOME`이라는 이름에 JDK 위치를 저장해요. (Windows의 `JAVA_HOME` 만들기와 같아요.)
- 둘째 줄: `PATH` 맨 앞에 JDK의 `bin` 폴더를 추가해요. (Windows의 `%JAVA_HOME%\bin` 추가와 같아요.)
- 셋째 줄: 방금 바꾼 설정을 지금 열린 터미널에 바로 적용해요. (새 터미널 창은 자동으로 적용돼요.)

다시 확인:
```
java -version
javac -version
```
`openjdk version "21..."`과 `javac 21...`이 나오면 성공이에요.

> 선택 사항: Eclipse나 IntelliJ 같은 다른 프로그램이 이 JDK를 자동으로 찾게 하려면, macOS의 표준 JDK 위치에 연결(바로가기)을 만들어 두면 좋아요. 관리자 비밀번호가 필요해요.
> ```
> sudo ln -sfn /opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-21.jdk
> ```

### 3-3. 터미널만으로 컴파일하고 실행하기
코딩 툴 없이도 자바를 돌릴 수 있어요. 이 폴더의 `code/Welcome.java`로 해 볼게요.
```
cd ~/Downloads/Java-notes/lectures/02-개발-환경-구축-및-콘솔창-출력/code
javac -encoding UTF-8 Welcome.java
java Welcome
```
- `cd` : 그 폴더로 이동해요. `~`는 내 홈 폴더(/Users/내이름)를 뜻해요. 경로에 공백이 있으면 큰따옴표로 감싸야 하는데, 이때 `~`는 따옴표 밖에 둬야 해요(예: `cd ~/"My Folder"`). 긴 폴더 이름은 앞 몇 글자만 치고 Tab 키를 누르면 자동 완성돼요.
- `javac -encoding UTF-8 Welcome.java` : 번역(컴파일)해서 `Welcome.class`를 만들어요. 한글 주석이 깨지지 않게 `-encoding UTF-8`을 붙여요.
- `java Welcome` : 실행해요. 확장자 `.class`는 붙이지 않아요.

Path를 아직 설정하지 않았다면 전체 경로로 써도 돼요.
```
/opt/homebrew/opt/openjdk@21/bin/javac -encoding UTF-8 Welcome.java
/opt/homebrew/opt/openjdk@21/bin/java Welcome
```

### 3-4. 코딩 툴 설치 (둘 중 하나)
- **Eclipse** (강의와 똑같이 하고 싶다면): eclipse.org -> Download -> "Eclipse IDE for Java Developers"에서 **macOS AArch64**(Apple Silicon용) `.dmg`를 받아요. dmg를 열고 Eclipse 아이콘을 응용 프로그램 폴더로 끌어다 놓으면 설치 끝이에요. 처음 실행할 때 workspace 위치를 물어보는데, 예를 들어 `~/workspace`로 정하면 돼요.
- **IntelliJ IDEA Community Edition** (무료, 요즘 많이 씀): jetbrains.com에서 Apple Silicon용을 받아요. 새 프로젝트를 만들 때 JDK 항목에서 21을 고르면 돼요. 화면 구성은 강의와 다르지만 코드는 똑같아요.

### 3-5. macOS에서 Eclipse 단축키 차이
강의의 단축키는 Windows 기준이에요. macOS에서는 보통 **Ctrl 자리에 Cmd(⌘)**를 써요.

| 기능 | Windows (강의) | macOS |
|---|---|---|
| 저장 | Ctrl + S | Cmd + S |
| 글자 크기 키우기/줄이기 | Ctrl + Shift + `+` / `-` | Cmd + `+` / `-` |
| 실행 | Ctrl + F11 | Cmd + Shift + F11 (맥북은 F키를 쓰려면 fn도 같이 눌러야 할 수 있어요. 헷갈리면 툴바의 초록색 실행 버튼) |
| 명령어 불러오기(자동 완성) | Ctrl + Space | Ctrl + Space (macOS에서 이 키가 입력 소스 전환에 잡혀 있으면 시스템 설정 -> 키보드 -> 키보드 단축키 -> 입력 소스에서 끄거나, 메뉴 Edit -> Content Assist 사용) |

단축키가 기억 안 나면 **초록색 세모(Run) 버튼**을 누르면 돼요. 가장 확실해요.

---

## 4. Eclipse에서 첫 프로그램 만들기

### 4-1. 작업 공간(workspace)
Eclipse를 실행하면 "작업 공간이 어디니?"라고 물어요. 앞에서 만든 `workspace` 폴더를 지정하고 Launch를 눌러요. "다시 묻지 않기"에 체크하면 다음부터는 안 물어봐요(나중에 메뉴에서 바꿀 수 있어요). Welcome 페이지가 뜨면 Eclipse가 잘 실행된 거예요. 여기까지 되면 개발 환경 구축 성공이에요.

workspace 폴더 안에 `.metadata` 폴더가 자동으로 생기는데, Eclipse가 설정과 작업 기록을 보관하는 곳이라 **지우면 안 돼요.**

### 4-2. 프로젝트 -> 패키지 -> 클래스 순서로 만들기
Eclipse에서는 **프로젝트를 먼저 만들어야** 코딩을 시작할 수 있어요.

```
workspace (작업 공간)
 └─ basicJava            <- 프로젝트 (컴퓨터 입장에서는 그냥 폴더)
     ├─ src              <- .java 소스 파일이 저장되는 폴더
     │   └─ oop02        <- 패키지 (관련 파일을 묶는 폴더)
     │       └─ Test01_welcome.java   <- 클래스 (실제 코드)
     └─ bin              <- 컴파일된 .class 파일이 저장되는 폴더
```

1. **프로젝트**: 왼쪽 Package Explorer의 "Create a Java project" (또는 File -> New -> Java Project) -> 이름 `basicJava` -> Next -> Finish. `src`와 `bin` 같은 기본 설정은 바꾸지 않아요.
2. **패키지**: `src` 우클릭 -> New -> Package -> 이름 `oop02` -> Finish. 패키지는 그냥 **폴더**라고 생각하면 돼요. (OOP = 객체지향 프로그래밍의 약자. 숫자 `02`는 맨 앞만 아니면 쓸 수 있어요.)
3. **클래스**: `oop02` 우클릭 -> New -> Class -> 이름 `Test01_welcome` -> `public static void main(String[] args)` 항목에 **체크** -> Finish. (이 부분을 강사님은 "메인 함수"라고 불러요.)

> 참고: 최근 Eclipse는 프로젝트를 만들 때 `module-info.java` 파일도 자동으로 만들 수 있어요. 강의 화면에도 보여요. 이 강좌 범위에서는 신경 쓰지 않아도 돼요. 만약 클래스를 패키지 없이(default package) 만들었다가 에러가 나면, 패키지를 만들어 그 안에 클래스를 두거나 `module-info.java`를 지우면 돼요.

Eclipse는 **저장(Ctrl+S)하면 자동으로 컴파일**해 줘요. 그래서 우리는 저장만 잘 하면 돼요.

---

## 5. 자바 문법의 기본 규칙

| 규칙 | 설명 |
|---|---|
| **대소문자를 구분한다** | `System`과 `system`은 완전히 다른 단어예요. 대문자 A와 소문자 a는 다른 글자로 취급해요. |
| **명령 하나가 끝나면 세미콜론 `;`** | "여기까지가 명령 하나예요"라는 마침표 역할이에요. 빠뜨리면 에러가 나요. |
| **클래스 이름의 첫 글자는 대문자** | 소문자도 문법상 되지만, 관례상 대문자로 시작해요. (`Welcome`, `HelloWorld`) |
| **주석(보충 설명)** | `//` 는 한 줄 주석, `/* ... */` 는 여러 줄 주석. 자바는 주석을 실행하지 않고 건너뛰어요. Eclipse에서는 초록색으로 보여요. |

### 주석은 왜 달까?
프로그램이 길어지면 내가 쓴 코드도 시간이 지나면 잊어버려요. 주석은 **미래의 나와 다른 사람을 위한 메모**예요. 결과 화면에는 아무 영향이 없어요.

```java
// 한 줄 주석: 이 줄은 실행되지 않아요
/* 여러 줄 주석
   여기 안에 쓴 글도
   전부 실행되지 않아요 */
```

---

## 6. 식별자 (이름 짓기 규칙)

**식별자**는 프로젝트, 패키지, 클래스, 변수, 함수 등에 붙이는 **이름**이에요. 이름을 붙이는 이유는 사람 이름처럼 "얘와 쟤를 구분하기 위해서"예요.

| 규칙 | 좋은 예 | 나쁜 예 |
|---|---|---|
| **의미가 드러나게** 짓기 | `totalPrice`, `studentName` | `a1`, `xx` |
| **한글 금지** (강의 권장) | `welcome` | `환영` |
| **공백 금지** | `basicJava` | `basic Java` |
| **첫 글자로 숫자 금지** (중간/끝은 가능) | `oop02`, `Test01` | `02oop`, `1Test` |
| 여러 단어를 이으면 **단어 첫 글자를 대문자**로 (권장) | `basicJava`, `HelloWorld` | `basicjava` (읽기 어려움) |

> 참고: 엄밀히는 자바 문법상 한글 이름도 컴파일은 돼요. 하지만 다른 환경에서 글자가 깨지거나 협업 시 문제가 생기기 쉬워서, 강의처럼 **영어로만** 짓는 게 안전해요. 공백과 숫자로 시작하는 이름은 정말로 에러가 나요.

---

## 7. 콘솔창에 출력하기

**콘솔창**은 프로그램 결과가 글자로 찍히는 창이에요. Eclipse에서는 아래쪽 Console 탭, macOS에서는 터미널이 그 역할을 해요. (다른 말로 "명령 프롬프트"라고도 해요.)

### print와 println
| 명령 | 동작 |
|---|---|
| `System.out.print(내용)` | 내용을 출력하고 **줄을 바꾸지 않아요.** 다음 출력이 바로 옆에 붙어요. |
| `System.out.println(내용)` | 내용을 출력하고 **줄을 바꿔요.** `ln`은 line(줄)의 약자, 즉 엔터를 친 것과 같아요. |

> 비유: `print`는 글을 쓰고 펜을 그 자리에 두는 것, `println`은 글을 쓰고 **다음 줄 맨 앞으로 펜을 옮기는 것**이에요.

### 강의 예제 (`code/Welcome.java`)
```java
public class Welcome {
    public static void main(String[] args) {
        // 한줄 주석 (보충설명)
        /*  여러줄 주석 */

        System.out.print(123);
        System.out.print(456);

        System.out.println(789);
        System.out.println(10);
    }
}
```
한 줄씩 보면:
- `public class Welcome { ... }` : Welcome이라는 클래스. 파일 이름도 `Welcome.java`.
- `public static void main(String[] args) { ... }` : 프로그램 시작점(메인 함수). 여기 안의 명령이 위에서부터 차례로 실행돼요.
- `System.out.print(123);` : 123을 출력. 줄은 안 바꿈.
- `System.out.print(456);` : 바로 옆에 456을 출력 -> 지금까지 `123456`.
- `System.out.println(789);` : 바로 옆에 789를 출력하고 줄을 바꿈 -> `123456789` 후 다음 줄로.
- `System.out.println(10);` : 새 줄에 10을 출력.

실행 결과:
```
123456789
10
```

(강의 화면에서 Eclipse 프로젝트 안에 만들 때는 파일 맨 위에 `package oop02;` 줄이 자동으로 들어가요. 패키지 폴더 안에 있다는 뜻이에요. 이 노트의 `code/` 파일은 터미널에서 바로 실행하기 쉽도록 그 줄을 뺐어요.)

### 숫자와 글자
- 숫자는 그대로: `System.out.println(2024);`
- 글자(문자열)는 큰따옴표로 감싸기: `System.out.println("안녕");`
- 괄호를 비우면 줄 바꿈만: `System.out.println();`

`code/PrintVsPrintln.java` 실행 결과:
```
가나다
첫째 줄
둘째 줄
2024
2024
Java는 대소문자를 구분해요
```

### 출력 명령은 외우지 말고 불러오기
`System.out.println()`은 너무 자주 써서 Eclipse에 단축 입력이 있어요.
- `syso` 라고 치고 **Ctrl + Space** -> `System.out.println();` 이 자동으로 완성돼요.
- 이렇게 명령을 "불러오는" 기능을 **자동 완성(Content Assist)**이라고 해요. IntelliJ에서는 `sout` + Tab(또는 Enter)이에요.

### Eclipse 단축키 정리 (Windows 기준, macOS는 3-5 참고)
| 기능 | 단축키 |
|---|---|
| 글자 크기 | Shift + Ctrl + `+` / `-` |
| 명령어 불러오기 | Ctrl + Space |
| 자바 클래스 실행 | Ctrl + F11 (또는 초록색 세모 버튼) |
| 저장 | Ctrl + S (저장하면 자동 컴파일) |

---

## 자주 하는 실수

아래 에러 메시지는 JDK 21 `javac`로 실제로 틀린 코드를 컴파일해서 나온 것들이에요. Eclipse에서는 같은 내용이 빨간 밑줄과 함께 한국어/영어로 보여요.

| 증상 / 에러 메시지 | 원인 | 해결 |
|---|---|---|
| `error: ';' expected` | 명령 끝에 세미콜론을 빠뜨림. 예: `System.out.println(1)` | 줄 끝에 `;` 추가 |
| `error: package system does not exist` | `System`을 소문자 `system`으로 씀 | 대문자 `S`로 시작하는 `System` |
| `error: cannot find symbol` ... `symbol: method Println(int)` | `println`을 `Println`처럼 대소문자를 틀림 | 정확히 `println` (전부 소문자, `ln`은 엘엔) |
| `error: unclosed string literal` | 문자열의 닫는 큰따옴표를 빠뜨림. 예: `println("hi);` | `"hi"`처럼 따옴표를 짝 맞추기 |
| `error: <identifier> expected` | 클래스 이름을 숫자로 시작함. 예: `class 1Test` | `Test1`처럼 문자로 시작 |
| `class Welcome is public, should be declared in a file named Welcome.java` | 클래스 이름과 파일 이름이 다름 | 둘을 대소문자까지 똑같이 맞추기 |
| macOS 터미널: `Unable to locate a Java Runtime` | Path가 설정되지 않아 macOS 기본 안내 프로그램이 대답함 | 3-2의 `~/.zshrc` 설정 후 `source ~/.zshrc` |
| `println`을 썼는데 `pr1ntln`, `prinln` 등으로 오타 | 손으로 다 치다 생긴 오타 | `syso` + Ctrl+Space로 불러오기 |
| 코드를 고쳤는데 결과가 그대로 | 저장 안 하고 실행함 (터미널이면 다시 `javac` 안 함) | 저장(Ctrl/Cmd + S) 후 실행. 터미널은 `javac` 다시 |
| `.metadata` 폴더를 지웠더니 Eclipse 설정이 사라짐 | Eclipse 관리 폴더를 삭제함 | 지우지 않기. 지웠다면 프로젝트를 다시 Import |

---

## 시간대별 목차

| 시간 | 주제 |
|---|---|
| [00:00] | 강의 목표: 개발 도구 설치와 코딩 툴 사용 |
| [01:05] | workspace 폴더 만들기 |
| [01:59] | JDK 소개와 다운로드 (JDK 17, Windows) |
| [02:53] | oracle.com에서 JDK 찾아가는 경로 |
| [03:39] | Eclipse 다운로드 (eclipse.org, Other packages, zip) |
| [05:12] | JDK 설치 (Next 반복) |
| [05:52] | Eclipse 압축 풀기 |
| [06:38] | 환경 변수 설정 (JAVA_HOME, Path에 %JAVA_HOME%\bin) |
| [08:20] | Eclipse 실행과 작업 공간 지정 |
| [09:38] | Welcome 페이지 확인, 환경 구축 완료 |
| [10:04] | Eclipse 단축키 소개 |
| [10:43] | 자바 기본 문법 규칙 (대소문자, 세미콜론, 클래스 이름) |
| [12:00] | 주석문 (// 와 /* */) |
| [13:01] | 식별자와 이름 짓기 규칙 |
| [15:33] | 콘솔창 출력 명령어와 syso 단축키 소개 |
| [16:35] | .metadata 폴더 주의사항 |
| [17:11] | 자바 프로젝트 basicJava 만들기 (src, bin) |
| [19:32] | 패키지 oop02 만들기 |
| [20:47] | 클래스 Test01_welcome 만들기 (main 체크) |
| [21:45] | 단축키 실습 (글자 크기, Ctrl+Space, Ctrl+F11) |
| [22:44] | 주석 직접 써 보기 |
| [23:42] | print(123), print(456) 출력과 실행 |
| [25:01] | syso + Ctrl+Space로 println 입력, print와 println 차이 |
| [26:05] | 강의 내용 정리 |

---

## 용어 정리

| 용어 | 쉬운 뜻 |
|---|---|
| JDK | 자바를 만들고 실행하는 도구 모음 (컴파일러 javac, 실행기 java 포함) |
| LTS | 오래 지원해 주는 버전 (예: 17, 21) |
| IDE / 코딩 툴 | 코드 작성, 저장, 실행을 한곳에서 하게 해 주는 프로그램 (Eclipse, IntelliJ) |
| Eclipse (이클립스) | 강의에서 쓰는 무료 자바 코딩 툴 |
| 환경 변수 | 컴퓨터 전체가 참고하는 설정 값 |
| JAVA_HOME | JDK가 설치된 폴더 위치를 담은 환경 변수 |
| Path (PATH) | 명령어 프로그램을 찾을 폴더 목록 (컴퓨터의 주소록) |
| 터미널 | macOS에서 글자로 명령을 입력하는 프로그램 |
| zsh, ~/.zshrc | macOS 터미널의 기본 쉘과, 시작할 때 읽는 설정 파일 |
| workspace (작업 공간) | Eclipse가 프로젝트들을 저장하는 폴더 |
| .metadata | workspace 안에서 Eclipse가 설정을 보관하는 폴더 (지우면 안 됨) |
| 프로젝트 | 하나의 프로그램을 위한 파일 묶음 (폴더) |
| src / bin | 소스(.java)를 두는 폴더 / 컴파일 결과(.class)를 두는 폴더 |
| 패키지 | 관련 클래스를 묶어 두는 폴더 |
| 클래스 | 자바 코드의 기본 단위. 파일 하나에 public 클래스 하나 |
| main 함수 (메인 함수) | 프로그램이 시작되는 곳 `public static void main(String[] args)` |
| 컴파일 | .java를 .class로 번역하는 것 (Eclipse는 저장 시 자동) |
| 세미콜론 `;` | 명령 하나의 끝을 표시하는 기호 |
| 주석 | 실행되지 않는 설명 메모 (`//`, `/* */`) |
| 식별자 | 프로젝트, 패키지, 클래스, 변수 등에 붙이는 이름 |
| 콘솔창 | 프로그램 결과가 글자로 출력되는 창 (명령 프롬프트) |
| print / println | 출력만 / 출력 후 줄 바꿈 |
| 문자열 | 큰따옴표로 감싼 글자들 (`"안녕"`) |
| 자동 완성 (Content Assist) | 명령어를 일부만 쳐도 나머지를 채워 주는 기능 (`syso` + Ctrl+Space) |
