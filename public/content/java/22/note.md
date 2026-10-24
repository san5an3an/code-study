# 22강. 파일 입출력

## 이 강의에서 배우는 것

- 프로그램 밖에 있는 파일을 읽어 들이는 **입력 스트림**과, 프로그램이 만든 데이터를 파일로 내보내는 **출력 스트림**의 개념을 알아봐요.
- 메모장 파일(.txt)을 세 가지 방법으로 읽어 봐요: `FileInputStream`(1바이트씩), `FileReader`(한 글자씩), `BufferedReader`(한 줄씩).
- 왜 바이트 단위로 읽으면 한글이 깨지고, 글자 단위로 읽으면 안 깨지는지 이해해요.
- `FileWriter` + `PrintWriter` 로 파일에 써 보고, `true`(이어 쓰기)와 `false`(덮어쓰기)의 차이를 확인해요.
- 다 쓴 파일은 `close()` 로 꼭 닫아야 하는 이유를 알아봐요.

> 앞에서 배운 것 잠깐 떠올리기: `try { } catch (Exception e) { } finally { }` 예외 처리(앞 강의), `while (true)` 와 `break`(8강), `System.out.printf` 서식(5강)을 이번 강의에서 그대로 써요. 21강의 `import` 도 다시 나와요.

---

## 1. 스트림이란? 입력과 출력

**스트림(stream)** 은 "흐름"이라는 뜻이에요. 데이터가 한쪽에서 다른 쪽으로 **물처럼 차례차례 흘러가는 통로**라고 생각하면 돼요.

비유: 수도관. 물탱크(파일)에서 집(프로그램)으로 물이 흘러 들어오는 관이 **입력 스트림**, 집에서 밖으로 물을 내보내는 관이 **출력 스트림**이에요.

| 구분 | 방향 | 강의에서 쓴 클래스 |
|---|---|---|
| 입력 스트림 | 파일 → 자바 프로그램 (읽기) | `FileInputStream`, `FileReader`, `BufferedReader` |
| 출력 스트림 | 자바 프로그램 → 파일 (쓰기) | `FileWriter`, `PrintWriter` |

- 엑셀, 파워포인트, csv, 이미지 파일처럼 자바 프로그램이 아닌 **외부 파일**도 읽고 쓸 수 있어요. 이번 강의는 그중 가장 단순한 **메모장(.txt)** 파일만 다뤄요.
- 관련 클래스는 대부분 **`java.io`** 패키지에 있어요. 그래서 `import java.io.FileReader;` 처럼 import 를 꼭 써야 해요.

입력과 출력은 파일이 없을 때 반응이 달라요. 꼭 기억하세요.

| | 파일이 없으면? |
|---|---|
| 입력(읽기) | 예외 발생 (`FileNotFoundException`, `IOException` 의 한 종류) |
| 출력(쓰기) | 새 파일을 만들어 줌 |

읽을 책이 없으면 읽을 수가 없지만, 쓸 공책이 없으면 새 공책을 꺼내 쓰면 되는 것과 같아요.

> 참고(강의 밖 내용): 쓰기에서 새로 만들어 주는 건 **파일**까지예요. `없는폴더/result.txt` 처럼 폴더 자체가 없으면 쓰기도 실패해요.

---

## 2. 준비: data.txt 와 파일 경로

### 2-1. 읽을 파일 만들기

강의에서는 메모장으로 `D:/workspace/data.txt` 를 만들고 아래 내용을 넣어요. 한글, 영어, 특수문자, 숫자를 골고루 섞은 거예요.

```
무궁화 꽃이 피었습니다~~
Gone With The Wind!!
2023년
오필승
KOREA....대한민국
```

code 폴더에서는 `MakeDataFile.java` 를 먼저 실행하면 같은 내용의 `data.txt` 가 만들어져요(메모장으로 직접 만들어도 돼요).

```
data.txt 준비 완료
```

### 2-2. 경로 쓰는 법

**경로(path)** 는 "파일이 어디 있는지 적은 주소"예요.

강의는 Windows 에서 이렇게 썼어요.

```java
String fileName = "D:\\workspace\\data.txt";   // 역슬래시 두 번
String fileName = "D:/workspace/data.txt";     // 슬래시도 됨 (강사가 쓴 방식)
```

- 자바 문자열 안에서 `\` 는 `\n`(줄바꿈)처럼 **특별한 글자를 시작하는 기호**라서, 진짜 역슬래시를 쓰려면 `\\` 로 두 번 써야 해요.
- 한 번만 쓰면 컴파일 에러가 나요(직접 확인).

```
error: illegal escape character
```

> **강의와 다른 점**: `D:/...` 는 Windows 전용 주소라 macOS 에서는 동작하지 않아요. 그래서 code 폴더 예제는 모두 `"data.txt"`, `"result.txt"` 처럼 **폴더 이름 없이 파일 이름만** 썼어요. 이걸 **상대경로**라고 하는데, "**프로그램을 실행한 폴더** 안에서 찾아라"는 뜻이에요. 터미널에서 `code` 폴더로 이동한 뒤 실행하면 그 폴더에서 `data.txt` 를 찾고, `result.txt` 도 거기에 만들어요. (Eclipse 에서 실행하면 보통 **프로젝트 폴더**가 기준이에요.)

---

## 3. FileInputStream: 1바이트씩 읽기

### 3-1. 기본 뼈대: try-catch-finally

```java
String fileName = "data.txt";
FileInputStream fis = null;

try {
    fis = new FileInputStream(fileName);   // 파일을 읽기 모드로 열기
    // ... 읽기 ...
} catch (Exception e) {
    System.out.println("실패:" + e);
} finally {                                // 자원 반납
    try {
        if (fis != null) { fis.close(); }
    } catch (Exception e) {}
}
```

한 줄씩 볼게요.

- `FileInputStream fis = null;` : 변수를 `try` **바깥**에 미리 만들어 둬요. 그래야 `finally` 에서도 `fis` 를 쓸 수 있어요. 아직 아무 파일도 안 가리키니까 `null` 로 시작해요.
- `new FileInputStream(fileName)` : 생성자에 경로를 넘기면 그 파일이 열려요. 이제 `fis` 는 "data.txt 를 가리키는 통로"예요.
- `catch` : 파일이 없거나 읽다가 문제가 생기면 여기로 와요.
- `finally` : 성공하든 실패하든 **항상** 실행돼요. 여기서 파일을 닫아요.
- `if (fis != null)` : 파일 열기 자체가 실패했으면 `fis` 는 여전히 `null` 이라 닫을 게 없어요. 열렸을 때만 닫아요.
- `finally` 안에 또 `try-catch` 가 있는 건 틀린 문법이 아니에요. `close()` 도 예외를 던질 수 있어서 감싼 거예요.

**왜 try-catch 가 꼭 필요할까?** 파일 열기는 "파일이 없을 수도 있는" 위험한 작업이라, 자바가 **예외 처리를 하지 않으면 컴파일조차 안 시켜 줘요.** try-catch 없이 쓰면 이런 에러가 나요(직접 확인).

```
error: unreported exception FileNotFoundException; must be caught or declared to be thrown
```

**왜 close() 해야 할까?** 파일은 운영체제에게서 **빌려 쓰는 자원**이에요. 도서관 책처럼 다 썼으면 반납해야 다른 프로그램이 쓸 수 있고, 쓰기의 경우엔 닫아야 내용이 끝까지 저장돼요(6장에서 직접 확인해요).

> **강의와 다른 점**: 강사는 "메모장이라는 외부 응용 프로그램과 연결했으니 반납한다"고 설명해요. 정확히는 메모장 **프로그램**과 연결되는 게 아니라 **파일**과 연결되는 거예요. 메모장이 꺼져 있어도 파일은 읽을 수 있어요.

### 3-2. 파일 이름을 틀리면

강사는 일부러 파일명을 틀리게 써서 예외를 띄워 봐요. macOS 에서 `data.txt` 가 없을 때 실제 출력이에요.

```
실패:java.io.FileNotFoundException: data.txt (No such file or directory)
```

(강의 화면은 Windows 라 `실패:java.io.FileNotFoundException: D:\workspa...` 로 시작했어요. 괄호 안 설명 문구는 운영체제마다 달라요.)

### 3-3. read(): 1바이트 읽기

```java
int by = fis.read();
System.out.println(by);
```

- `read()` 는 파일에서 **1바이트**를 읽어 `int` 로 돌려줘요. 바이트(byte)는 컴퓨터가 저장하는 가장 작은 묶음 단위예요(0~255 사이 숫자 하나).
- 한 번 읽으면 **책갈피가 다음 칸으로** 넘어가요. 그래서 또 `read()` 하면 그다음 바이트가 나와요.

실행 결과(강의 화면과 같아요):

```
235
```

"뭔지 모르는 숫자"가 나왔죠? 이건 `무` 라는 글자를 이루는 3바이트 중 **첫 번째 바이트**예요. (data.txt 는 UTF-8 이라는 방식으로 저장돼 있고, UTF-8 에서 한글 한 글자는 3바이트예요.)

### 3-4. while 로 끝까지 읽기

```java
while (true) {
    int by = fis.read();     // 1바이트 읽음
    if (by == -1) {          // 파일의 끝인지?
        break;
    }
    System.out.printf("%c", by);
}
```

- `while (true)` : 일단 무한 반복으로 돌려요.
- 더 읽을 게 없으면 `read()` 는 **-1** 을 돌려줘요. 바이트 값은 0~255 뿐이라 -1 은 절대 데이터가 아니거든요. 그래서 "-1 = 끝" 이라는 신호로 써요.
- `break` : -1 이 나오면 반복을 빠져나와요.
- `printf("%c", by)` : 숫자를 글자로 바꿔 찍어요.

실행 결과(`ByteReadTest`, macOS 터미널):

```
첫 바이트: 235
¬´ê¶í ê½ì´ í¼ììµëë¤~~
Gone With The Wind!!
2023ë
ì¤íì¹
KOREA....ëíë¯¼êµ­
```

영어, 숫자, 특수문자는 멀쩡한데 **한글만 깨졌어요.** 한글 한 글자(3바이트)를 1바이트씩 쪼개서 각각을 따로 글자로 찍었기 때문이에요. 퍼즐 조각 3개를 하나씩 따로 보여 주면 그림이 안 보이는 것과 같아요.

> 깨진 모양은 환경마다 달라요. 강의 화면(Windows)은 `??` 같은 모양이었고, 위 결과에는 화면에 안 보이는 제어 문자도 섞여 있어서 터미널에 따라 조금 다르게 보일 수 있어요. 첫 줄 `무` 의 첫 바이트(235)는 `첫 바이트:` 로 따로 찍었기 때문에 깨진 줄은 두 번째 바이트부터 시작해요.

강사 말처럼 한글이 깨졌다고 "틀린" 게 아니에요. 바이트 단위 읽기는 이미지처럼 **글자가 아닌 파일**을 다룰 때 쓰는 도구예요. 읽을 파일이 어떤 내용인지 보고 알맞은 클래스를 고르면 돼요.

전체 코드: `code/ByteReadTest.java`

---

## 4. FileReader: 한 글자씩 읽기

`FileReader` 는 **문자(char) 단위**로 읽어요. 한글 한 글자를 한 번에 통째로 읽으니 깨지지 않아요.

```java
FileReader fr = null;
try {
    fr = new FileReader(fileName);
    while (true) {
        int ch = fr.read();      // 글자 하나를 읽어 int 로 돌려줌
        if (ch == -1) {          // 더 읽을 게 없으면 -1
            break;
        }
        System.out.printf("%c", ch);
    }
} catch (Exception e) {
    System.out.println("실패:" + e);
} finally {
    try {
        if (fr != null) { fr.close(); }
    } catch (Exception e) {}
}
```

- 모양은 `FileInputStream` 과 거의 같아요. 같은 입력 스트림 가족이라 메소드 이름(`read`, `close`)도 같아요.
- 차이는 `read()` 가 **바이트가 아니라 글자 하나**를 돌려준다는 것뿐이에요. 끝이면 역시 -1 이에요.

실행 결과(`CharReadTest`, 강의 화면과 같아요):

```
무궁화 꽃이 피었습니다~~
Gone With The Wind!!
2023년
오필승
KOREA....대한민국
```

> **강의와 다른 점**: 강사는 "자바의 char 는 2바이트니까 **2바이트씩 끊어서** 읽어서 한글이 안 깨진다"고 설명해요. 자바 안에서 char 가 2바이트인 건 맞지만, 파일에서 2바이트씩 읽는 건 아니에요. FileReader 는 파일의 바이트를 **글자 규칙(인코딩)에 맞게 묶어서** 한 글자로 바꿔 줘요. UTF-8 파일이라면 영어는 1바이트, 한글은 3바이트를 묶어 한 글자로 만들어요. 그래서 한글이 안 깨지는 거예요.

> 참고(강의 밖 내용): 글자 규칙(인코딩)이 파일과 프로그램 사이에 다르면 FileReader 로 읽어도 한글이 깨질 수 있어요. JDK 18 부터는 기본 규칙이 UTF-8 로 통일돼서, 요즘 메모장 기본값(UTF-8)으로 저장한 파일은 그대로 잘 읽혀요. 강의 화면의 JDK 11(Windows)은 환경에 따라 기본 규칙이 달랐는데, 실제로 강의 후반 `result.txt` 를 메모장으로 열었을 때 아래쪽에 `ANSI` 라고 표시돼 있었어요.

전체 코드: `code/CharReadTest.java`

---

## 5. BufferedReader: 한 줄씩 읽기

메모장 파일은 보통 **줄 단위**로 의미가 있죠. `BufferedReader` 의 `readLine()` 은 **엔터(줄바꿈)를 기준으로 한 줄씩** 읽어 줘요.

```java
FileReader fr = null;
BufferedReader br = null;
try {
    fr = new FileReader(fileName);
    br = new BufferedReader(fr);           // FileReader 를 한 번 더 감싸기

    while (true) {
        String line = br.readLine();       // 한 줄 읽기
        if (line == null) {                // 파일 끝이면 null
            break;
        }
        System.out.println(line);
    }
} catch (Exception e) {
    System.out.println("실패:" + e);
} finally {                                // 자원 반납 (순서 주의)
    try {
        if (br != null) { br.close(); }
    } catch (Exception e) {}
    try {
        if (fr != null) { fr.close(); }
    } catch (Exception e) {}
}
```

- `new BufferedReader(fr)` : 이미 만든 FileReader 를 BufferedReader 에 넣어 **감싸요.** 비유하면 수도꼭지(FileReader)에 **물통(버퍼)** 을 달아서, 한 방울씩이 아니라 한 컵(한 줄)씩 받는 거예요.
- `readLine()` : 한 줄을 `String` 으로 돌려줘요. **줄바꿈 문자는 빼고** 돌려주기 때문에 출력할 때 `println` 으로 줄을 바꿔 줘요.
- 파일 끝에 도착하면 -1 이 아니라 **`null`** 을 돌려줘요. 돌려주는 자료형이 `String` 이라 숫자 -1 을 쓸 수 없어서, "아무것도 없음"을 뜻하는 `null` 을 써요.
- 닫는 순서: **나중에 만든 `br` 을 먼저**, 처음 만든 `fr` 을 나중에 닫아요. 강사 표현대로 "먼저 연 것은 나중에 닫는다"예요.

실행 결과(`LineReadTest` 는 줄 번호를 붙여 출력하도록 조금 바꿨어요):

```
1: 무궁화 꽃이 피었습니다~~
2: Gone With The Wind!!
3: 2023년
4: 오필승
5: KOREA....대한민국
```

강의 코드처럼 `System.out.println(line);` 만 쓰면 결과는 4장(FileReader)과 똑같아요.

> 참고(강의 밖 내용): 사실 `br.close()` 를 부르면 안에 감싼 `fr` 도 같이 닫혀요. 그래도 강의처럼 둘 다 닫아 두면 안전하고, 순서는 강의 방식(br 먼저)을 따르면 돼요.

전체 코드: `code/LineReadTest.java`

---

## 6. FileWriter + PrintWriter: 파일에 쓰기

### 6-1. 코드

```java
String fileName = "result.txt";
FileWriter fw = null;
try {
    fw = new FileWriter(fileName, false);      // true 추가, false 덮어쓰기

    PrintWriter out = new PrintWriter(fw, true);
    out.print("KOREA");
    out.println("대한민국");
    out.printf("%d\n%f", 123, 45.67);

    out.close();                               // 자원 반납
    System.out.println("result.txt 완성!!");
} catch (Exception e) {
    System.out.println("실패:" + e);
} finally {
    try {
        if (fw != null) { fw.close(); }
    } catch (Exception e) {}
}
```

- `new FileWriter(fileName, false)` : result.txt 를 **쓰기 모드**로 열어요. 파일이 없으면 새로 만들어요.
- 두 번째 값이 모드를 정해요.

| 생성자 | 파일이 이미 있으면 |
|---|---|
| `new FileWriter("파일명", true)` | 기존 내용 **뒤에 이어 써요** (append, 추가) |
| `new FileWriter("파일명", false)` | 기존 내용을 **지우고 새로 써요** (overwrite, 덮어쓰기) |

- `new PrintWriter(fw, true)` : FileWriter 를 PrintWriter 로 감싸요. PrintWriter 는 `System.out` 과 똑같이 `print`, `println`, `printf` 를 쓸 수 있어서 **보기 좋게 꾸며 쓰기** 편해요.
- `out.print(...)`, `out.println(...)`, `out.printf(...)` : 화면 대신 **파일**에 써져요.
- `out.close()` : 다 썼으면 닫아요.

강의 화면에서 메모장으로 연 `result.txt` 내용:

```
KOREA대한민국
123
45.670000
```

- `print` 는 줄을 안 바꾸니 KOREA 와 대한민국이 붙어서 나왔어요.
- `%f` 는 기본으로 소수점 아래 6자리까지 찍어서 `45.670000` 이 돼요.

> **강의와 다른 점**: 강사는 PrintWriter 의 두 번째 값 `true` 를 "꼭 줘야 하고, 안 주면 이상한 쓰레기 글자가 같이 출력된다"고 해요. 이 `true` 의 정체는 **autoFlush(자동 비우기)** 예요. `println`/`printf` 를 할 때마다 쌓아 둔 내용을 바로 파일로 내보내라는 뜻이고, 쓰레기 글자와는 상관없어요. 정말 중요한 건 **`close()` 를 꼭 부르는 것**이에요. 직접 실험해 보니(true 없이 쓴 경우):
> - `close()` 를 부른 파일: 5바이트(`KOREA`)가 제대로 저장됨
> - `close()` 를 안 부른 파일: **0바이트**, 내용이 하나도 저장 안 됨
>
> 쓸 내용은 바로 파일로 가지 않고 잠시 **버퍼(임시 보관함)** 에 모였다가 `close()`(또는 flush) 때 한꺼번에 저장되기 때문이에요. 강의 코드는 `out.close()` 를 부르니 `true` 가 없어도 결과는 같아요. 다만 autoFlush 를 켜 두면 중간에 프로그램이 멈춰도 그때까지 쓴 줄은 남는다는 장점이 있어요.

### 6-2. true 와 false 비교 실행

강의는 `false` 로 한 번 실행 → `true` 로 바꿔 여러 번 실행 → 다시 `false` 로 실행하면서 매번 메모장을 열어 봐요. code 폴더의 `FileWriteTest.java` 는 이 과정을 한 번에 보여 주려고 쓰기를 메소드(`write`)로 만들어 여러 번 부르고, 매번 파일을 다시 읽어 화면에 보여 줘요. 줄이 안 붙도록 `printf` 끝에 `\n` 을 하나 더 넣었어요.

실행 결과:

```
[1] false 로 쓰기 (새로 만들기 / 덮어쓰기)
result.txt 완성!!
----- result.txt 내용 -----
KOREA대한민국
123
45.670000
-------------------------
[2] true 로 두 번 더 쓰기 (뒤에 이어 쓰기)
result.txt 완성!!
result.txt 완성!!
----- result.txt 내용 -----
KOREA대한민국
123
45.670000
KOREA대한민국
123
45.670000
KOREA대한민국
123
45.670000
-------------------------
[3] 다시 false 로 쓰기 (앞 내용이 사라짐)
result.txt 완성!!
----- result.txt 내용 -----
KOREA대한민국
123
45.670000
-------------------------
```

- `true` 로 쓸 때마다 내용이 계속 쌓여요.
- `false` 로 쓰면 앞에 쌓인 내용이 싹 지워지고 이번 내용만 남아요.

강사의 실전 팁: 성적표 같은 **결과 파일**을 만들 때는 실행할 때마다 내용이 쌓이면 안 되니까 **`false`(덮어쓰기)** 로 만들라고 해요. 그리고 데이터는 변수에 담아 계산한 뒤 `out.printf` 로 보기 좋게 출력하라고 해요.

> 예제가 만든 `data.txt`, `result.txt` 는 실행 후 지워도 돼요. code 폴더에는 `.java` 파일만 남겨 뒀어요.

전체 코드: `code/FileWriteTest.java`

---

## 7. 한눈에 정리

| 클래스 | 하는 일 | 끝 신호 | 한글 |
|---|---|---|---|
| `FileInputStream` | 1바이트씩 읽기 `read()` | -1 | 깨짐 |
| `FileReader` | 한 글자씩 읽기 `read()` | -1 | 안 깨짐 |
| `BufferedReader` | 한 줄씩 읽기 `readLine()` | `null` | 안 깨짐 |
| `FileWriter` | 파일에 쓰기 (true 추가 / false 덮어쓰기) | | |
| `PrintWriter` | `print`, `println`, `printf` 로 꾸며 쓰기 | | |

---

## 참고(강의 밖 내용): try-with-resources

`finally` 안에서 `close()` 를 일일이 부르는 게 번거롭죠. 자바 7부터는 `try` 옆 괄호 안에서 파일을 열면 **블록이 끝날 때 자동으로 닫아 주는** 문법이 있어요. 이걸 **try-with-resources** 라고 해요.

```java
try (BufferedReader br = new BufferedReader(new FileReader("memo.txt"))) {
    String line;
    while ((line = br.readLine()) != null) {
        System.out.println(line);
    }
} catch (Exception e) {
    System.out.println("실패:" + e);
}
```

- `finally` 와 `close()` 가 없어도 `br` 이 자동으로 닫혀요.
- `while ((line = br.readLine()) != null)` 은 "한 줄 읽어서 line 에 넣고, 그게 null 이 아니면 반복"을 한 줄로 줄인 모양이에요. 강의의 `while (true)` + `if (line == null) break;` 와 같은 뜻이에요.

memo.txt 에 "첫째 줄", "둘째 줄" 두 줄을 넣고 실행한 결과:

```
첫째 줄
둘째 줄
```

지금은 강의 방식(try-catch-finally)을 먼저 확실히 익히고, 익숙해지면 이 방식으로 넘어가면 돼요.

---

## 자주 하는 실수

| 실수 | 결과 | 고치는 법 |
|---|---|---|
| 읽을 파일이 없거나 이름/위치가 틀림 | `java.io.FileNotFoundException: data.txt (No such file or directory)` (macOS 에서 직접 확인) | 파일 이름, 확장자, 실행 폴더 확인 |
| 상대경로인데 엉뚱한 폴더에서 실행 | 위와 같은 예외 | 파일이 있는 폴더에서 실행 |
| try-catch 없이 `new FileReader(...)` | `error: unreported exception FileNotFoundException; must be caught or declared to be thrown` (직접 확인) | try-catch 로 감싸기 |
| 경로에 역슬래시를 한 번만 씀 (`"D:\workspace"`) | `error: illegal escape character` (직접 확인) | `\\` 또는 `/` 사용 |
| `import java.io....` 빠뜨림 | `error: cannot find symbol` (21강과 같은 종류, 이번 강의 클래스로는 따로 확인 안 함) | import 추가 |
| `close()` 를 안 부름 | 쓰기의 경우 파일이 0바이트로 비어 있을 수 있음 (직접 확인) | finally 에서 close, 또는 try-with-resources |
| 읽기 끝을 -1/null 로 확인 안 함 | 무한 반복 | `read()` 는 -1, `readLine()` 은 null 로 끝 확인 |
| 결과 파일을 `true`(이어 쓰기)로 엶 | 실행할 때마다 내용이 계속 쌓임 | 결과 파일은 `false` |
| 한글 파일을 `FileInputStream` + `%c` 로 출력 | 한글 깨짐 | 글자 파일은 `FileReader`/`BufferedReader` |

---

## 시간대별 목차

- [00:00] 강의 목표: 메모장 내용 읽기와 쓰기
- [00:54] 입력 스트림 개념과 java.io 패키지
- [02:04] 주의: 읽을 파일이 없으면 IOException
- [02:48] FileInputStream(바이트 기반, 한글 깨짐)
- [03:17] FileReader(문자 기반, 한글 안 깨짐)
- [03:43] BufferedReader 의 readLine()
- [04:13] 출력 스트림 개념, 파일이 없으면 만들어 줌
- [05:49] FileWriter 의 true(추가) / false(덮어쓰기)
- [06:53] PrintWriter: 다양한 출력 서식
- [07:11] 실습 준비: 패키지 oop23, D:/workspace/data.txt
- [08:05] 경로 쓰기: `\\` 또는 `/`
- [08:47] FileInputStream 과 try-catch-finally, close
- [11:50] 파일명을 틀리게 써서 예외 확인
- [12:39] read() 로 1바이트 읽기(235)
- [13:39] while(true) 와 -1 로 끝까지 읽기
- [15:22] printf %c 로 출력, 한글 깨짐 확인
- [16:35] Test02: FileReader 로 읽기, 한글 정상
- [20:34] Test03: BufferedReader 로 한 줄씩 읽기
- [21:27] 자원 반납 순서(br 먼저, fr 나중)
- [22:15] readLine() 은 파일 끝에서 null
- [23:49] Test04: FileWriter + PrintWriter 로 result.txt 쓰기
- [25:57] result.txt 생성과 내용 확인
- [26:44] true 로 바꿔 여러 번 실행: 내용 추가
- [27:51] false 로 다시 실행: 덮어쓰기
- [28:19] 프로젝트 팁: 결과 파일은 false, printf 활용
- [28:53] 강의 내용 정리

---

## 용어 정리

| 용어 | 쉬운 뜻 |
|---|---|
| 파일 입출력 | 프로그램이 파일을 읽거나(입력) 파일에 쓰는(출력) 것 |
| 스트림(stream) | 데이터가 차례대로 흘러가는 통로 |
| 입력 스트림 | 파일 → 프로그램 방향 통로 (읽기) |
| 출력 스트림 | 프로그램 → 파일 방향 통로 (쓰기) |
| `java.io` | 입출력 클래스들이 들어 있는 패키지 |
| 바이트(byte) | 컴퓨터 저장의 기본 단위. 0~255 숫자 하나 |
| 인코딩 | 글자를 바이트로 바꾸는 규칙. 예: UTF-8(한글 한 글자 = 3바이트) |
| 경로(path) | 파일이 있는 위치를 적은 주소 |
| 절대경로 / 상대경로 | 맨 처음부터 다 적은 주소 / 실행 폴더 기준으로 적은 주소 |
| `read()` | 1바이트(또는 1글자) 읽기. 끝이면 -1 |
| `readLine()` | 한 줄 읽기. 끝이면 null |
| `close()` | 다 쓴 파일을 닫아 자원을 돌려주는 것 |
| 자원 반납 | 빌려 쓴 파일 같은 자원을 close 로 돌려주는 것 |
| append / overwrite | 기존 내용 뒤에 이어 쓰기 / 지우고 새로 쓰기 |
| 버퍼(buffer) | 데이터를 잠시 모아 두는 임시 보관함 |
| autoFlush | println/printf 때마다 버퍼 내용을 바로 파일로 내보내는 설정 |
| `FileNotFoundException` | 파일을 찾지 못했을 때 나는 예외. IOException 의 한 종류 |
| try-with-resources | try 괄호 안에서 연 자원을 자동으로 닫아 주는 문법 (강의 밖) |
