# 20강. 예외처리

## 이 강의에서 배우는 것

- **예외(Exception)** 가 무엇인지, 문법 에러(빨간 X)와 어떻게 다른지 알아봐요.
- `try ~ catch` 로 예외가 나도 프로그램이 멈추지 않고 끝까지 가게 만드는 방법을 배워요.
- 자주 만나는 예외 4가지(0으로 나누기, 배열 칸 넘어가기, 숫자 아닌 글자 변환, null 계산)를 직접 일으켜 봐요.
- 여러 개의 `catch`, 모든 예외를 받는 `Exception`, 무조건 실행되는 `finally` 를 익혀요.
- `throws` 로 예외를 "나를 부른 곳"에 떠넘기는 방법을 배워요.

---

## 1. 예외란?

프로그램의 오류는 크게 두 종류로 나눌 수 있어요.

| 종류 | 언제 알 수 있나 | 이클립스에서 보이는 모습 | 예 |
|---|---|---|---|
| 문법 에러 (컴파일 에러) | 저장(컴파일)할 때 | 빨간 X, 빨간 밑줄 | 세미콜론 `;` 빠뜨림 |
| **예외 (Exception)** | **실행(Run)할 때** | 저장할 땐 깨끗한데, 실행하면 콘솔에 빨간 글자 | `3 / 0` |

- **컴파일(compile)**: 우리가 쓴 자바 코드를 컴퓨터가 실행할 수 있는 형태로 바꾸는 과정이에요. 이클립스는 저장할 때 자동으로 해 줘요.
- **예외(Exception)**: 문법은 맞아서 컴파일은 통과했는데, **실행하는 도중에** 생기는 문제예요.

강사 말대로 빨간 X 에러는 오히려 쉬운 편이에요. 어디가 틀렸는지 이클립스가 바로 표시해 주니까요. 예외는 저장할 때는 아무 표시가 없다가 실행해야 비로소 드러나서 더 까다로워요.

비유하자면 문법 에러는 **맞춤법이 틀린 요리법**이에요. 읽는 순간 틀린 게 보여요. 예외는 맞춤법은 완벽한데 **막상 요리해 보니 냉장고에 달걀이 없는 상황**이에요. 직접 해 봐야 문제가 드러나요.

---

## 2. 예외처리를 하지 않으면?

```java
System.out.println(1);
System.out.println(3 / 0);   // 정수를 0으로 나눔
System.out.println(5);
System.out.println("END");
```

`3 / 0` 은 수학에서도 답이 없죠. 이 코드는 문법상 문제가 없어서 저장할 때 아무 표시도 없지만, 실행하면 이렇게 나와요.

실행 결과 (`code/UncaughtException.java`)

```
1
Exception in thread "main" java.lang.ArithmeticException: / by zero
	at UncaughtException.main(UncaughtException.java:7)
```

한 줄씩 읽는 법:

- `java.lang.ArithmeticException` : 예외의 **종류**예요. "산술(계산) 예외"라는 뜻이에요.
- `/ by zero` : 예외의 **메시지**예요. "0으로 나눴다"는 설명이에요.
- `at ...(UncaughtException.java:7)` : **몇 번째 줄**에서 났는지 알려줘요. 고칠 때 이 줄 번호부터 봐요.

여기서 제일 중요한 건 **`5` 와 `END` 가 안 나왔다**는 거예요. 예외가 난 그 줄에서 프로그램이 그대로 멈춰 버린 거예요. 이걸 "비정상 종료"라고 해요.

강사는 `END` 를 "프로그램이 정상적으로 끝났다"는 표시로 맨 끝에 찍어요. 예외가 나더라도 프로그램은 끝까지 가서 정상 종료되어야 한다는 게 이번 강의의 핵심이에요.

---

## 3. try ~ catch 기본

형식은 이래요.

```
try {
    예외가 생길 만한 코드
} catch (예외종류 변수이름) {
    예외가 생겼을 때 할 일
}
```

- `try` : "일단 시도해 봐" 라는 뜻이에요. 문제가 생길 수 있는 코드를 여기에 넣어요.
- `catch` : "잡는다" 는 뜻이에요. try 안에서 예외가 생기면 그 예외를 여기서 잡아서 처리해요.
- 괄호 안의 `ArithmeticException e` 는 "이 종류의 예외가 오면 `e` 라는 변수에 담아라" 라는 뜻이에요. `e` 는 이름일 뿐이라 다른 이름도 되지만, 보통 `e` 를 써요.

```java
try {
    System.out.println(1);
    System.out.println(3 / 0);   // 여기서 예외 발생 -> 바로 catch 로 점프
    System.out.println(5);       // 건너뜀
} catch (ArithmeticException e) {
    System.out.println(e);       // 예외 정보(종류: 메시지) 출력
}
System.out.println("END");
```

실행 결과

```
1
java.lang.ArithmeticException: / by zero
END
```

실행 흐름을 단계로 보면:

1. `1` 을 출력해요.
2. `3 / 0` 에서 예외가 생겨요. try 안의 **나머지 줄(5 출력)은 건너뛰고** catch 로 점프해요.
3. catch 안에서 `e` 를 출력해요. `System.out.println(e)` 는 "예외종류: 메시지" 형태로 찍혀요.
4. try ~ catch 덩어리를 빠져나와 `END` 를 출력해요. **정상 종료!**

`3 / 0` 대신 `3 / 1` 처럼 예외가 안 나면 catch 는 통째로 건너뛰고 `1 3 5 END` 가 그대로 나와요.

### 꼭 기억할 주의사항

**catch 는 문제를 고쳐 주지 않아요.** 프로그램이 멈추지 않게 해 줄 뿐이에요. catch 에서 출력된 메시지를 보고 원인을 찾아 코드를 고치는 건 개발자의 몫이에요. 강사도 이 점을 여러 번 강조해요.

비유하면 try ~ catch 는 **화재경보기**예요. 불이 났다는 걸 알려 주고 사람들이 안전하게 나가게 해 주지만, 불을 끄고 원인을 고치는 건 사람이 해야 해요.

---

## 4. 자주 만나는 예외 4가지

강사는 "개발자 실수로 자주 나오는 예외"를 하나씩 일부러 일으켜 봐요. 예외 이름만 보고도 원인을 짐작할 수 있게 되는 게 목표예요. (`code/TryCatchBasic.java`)

### (1) ArithmeticException : 0으로 나누기

위에서 본 `3 / 0` 이에요. 메시지는 `/ by zero`.

### (2) ArrayIndexOutOfBoundsException : 없는 배열 칸

```java
int[] num = new int[3];   // 0, 1, 2 번 칸만 있어요
num[5] = 7;               // 5번 칸은 없음 -> 예외
```

```
java.lang.ArrayIndexOutOfBoundsException: Index 5 out of bounds for length 3
```

"길이가 3인 배열에서 5번 칸은 범위 밖이에요" 라는 뜻이에요. 이름이 길지만 쪼개 보면 Array(배열) + Index(번호) + OutOfBounds(범위 밖) 예요. 이 메시지를 보면 "어딘가 배열 번호가 잘못됐구나" 하고 찾으면 돼요.

강의 화면에서는 이 예제의 catch 안에 `e.printStackTrace();` 를 썼어요. 이건 예외 정보에 더해 **몇 번째 줄에서 났는지(at ...)** 까지 출력해 주는 메소드예요. 원인을 찾을 때는 `println(e)` 보다 더 자세해서 편해요.

### (3) NumberFormatException : 숫자가 아닌 글자를 숫자로

`Integer.parseInt("123")` 은 문자열 `"123"` 을 정수 `123` 으로 바꿔 줘요(Wrapper 클래스 때 배웠어요). 그런데 `"KOREA"` 는 숫자로 바꿀 수가 없죠.

```java
int b = Integer.parseInt("KOREA");
```

```
java.lang.NumberFormatException: For input string: "KOREA"
```

"KOREA 라는 입력은 숫자 형식이 아니에요" 라는 뜻이에요.

### (4) NullPointerException : null 로 계산

```java
Integer inte = null;   // 객체가 없음
int c = 5 / inte;      // 없는 걸로 계산하려 함 -> 예외
```

- **null** : "아무 객체도 가리키지 않는다", 즉 **비어 있음**을 뜻하는 값이에요.
- `Integer` 는 객체라서 null 을 담을 수 있어요. 계산할 때 자바는 속에 든 int 값을 꺼내려 하는데, 비어 있으니 꺼낼 게 없어서 예외가 나요.

자바 21에서 `System.out.println(e)` 로 찍으면 실제로 이렇게 나와요.

```
java.lang.NullPointerException: Cannot invoke "java.lang.Integer.intValue()" because "<local1>" is null
```

(`code/TryCatchBasic.java` 에서는 출력을 단순하게 하려고 `"NullPointerException 발생!"` 만 찍게 했어요.)

**강의와 다른 점**

- 강사는 이 예제를 "나머지(%) 연산"이라고 말하지만, 화면 코드는 `5/inte` 로 **나누기(/)** 예요. 어느 쪽이든 null 로 계산하면 같은 예외가 나요.
- 강의 화면(자바 11)에서는 메시지 없이 `java.lang.NullPointerException` 만 나와요. 자바 14부터 "무엇이 null 이었는지" 알려주는 친절한 메시지가 붙게 바뀌어서, 자바 21로 돌리면 위처럼 뒤에 설명이 더 붙어요.

이 예외를 보면 "어딘가에 null 이 들어갔구나" 하고 찾으면 돼요. 자바에서 가장 흔하게 만나는 예외 중 하나예요.

---

## 5. 다중 catch : catch 를 여러 개

try 하나에 catch 를 **여러 개** 붙일 수 있어요. 예외 종류마다 다르게 처리하고 싶을 때 써요. (`code/MultiCatchFinally.java`)

```java
try {
    System.out.println(1);
    int a = Integer.parseInt("KOREA"); // 첫 번째로 만나는 예외
    System.out.println(3 / 0);         // 실행되지 않아요
} catch (ArithmeticException e) {
    System.out.println("[산술 예외] " + e);
} catch (NumberFormatException e) {
    System.out.println("[숫자 형식 예외] " + e);
} catch (NullPointerException e) {
    System.out.println("[null 예외] " + e);
}
System.out.println("END");
```

실행 결과

```
1
[숫자 형식 예외] java.lang.NumberFormatException: For input string: "KOREA"
END
```

- try 안에서 **처음 생긴 예외 하나**로 바로 점프해요. 그 뒤 줄들은 실행되지 않으니, 뒤에 있는 `3 / 0` 예외는 아예 생기지 않아요.
- catch 들을 위에서부터 차례로 보면서 **종류가 맞는 catch 하나만** 실행해요.

강의에서는 `3/0` 을 먼저 두어서 ArithmeticException catch 가 실행됐어요. 위 코드는 다중 catch 가 "맞는 것만 골라서" 실행된다는 걸 보이려고 순서를 바꿔 봤어요.

---

## 6. Exception 하나로 다 받기 (다형성)

예외 종류마다 catch 를 쓰다 보면 코드가 길어져요. 그래서 **모든 예외의 부모 클래스**인 `Exception` 을 써요.

```java
try {
    System.out.println(1);
    System.out.println(3 / 0);
} catch (Exception e) {      // 어떤 예외든 받을 수 있어요
    System.out.println(e);
}
```

실행 결과

```
1
java.lang.ArithmeticException: / by zero
END
```

왜 될까요? 18강에서 배운 **다형성** 때문이에요. 부모 타입 변수에는 자식 객체를 담을 수 있었죠. `ArithmeticException`, `NumberFormatException`, `NullPointerException` 은 모두 `Exception` 의 자식(정확히는 자손)이라서, `Exception e` 라는 부모 타입 변수 하나로 전부 받을 수 있어요.

그리고 `println(e)` 를 하면 담긴 **실제 객체**의 정보가 나오기 때문에, `Exception` 으로 받아도 `ArithmeticException: / by zero` 처럼 진짜 예외 이름이 그대로 보여요.

강사는 개인적으로 이 방식을 제일 많이 쓴다고 해요. 어차피 메시지를 보고 고치는 건 개발자니까요.

**참고(강의 밖 내용)**: 다중 catch 에서 `Exception` 을 함께 쓸 때는 **맨 아래**에 둬야 해요. 부모인 `Exception` 이 위에 있으면 모든 예외를 먼저 다 받아 버려서, 아래 자식 catch 는 절대 실행될 수 없거든요. 자바는 이걸 아예 컴파일 에러로 막아요.

```java
try { int c = 3 / 0; }
catch (Exception e) { System.out.println(e); }
catch (ArithmeticException e) { }   // 컴파일 에러
```

```
error: exception ArithmeticException has already been caught
```

---

## 7. finally : 무조건 실행

`finally` 블록은 **예외가 나든 안 나든 항상 실행**돼요.

```
try {
    예외가 생길 만한 코드
} catch (예외종류 e) {
    예외가 생겼을 때 할 일
} finally {
    예외와 상관없이 항상 할 일
}
```

try, catch, finally 는 **하나의 덩어리**예요. 따로 떼어서 쓸 수 없어요.

```java
static void divide(int x, int y) {
    try {
        System.out.println("OPEN");
        System.out.println(x / y);
    } catch (Exception e) {
        System.out.println(e);
    } finally {
        System.out.println("CLOSE");   // 어느 경우든 출력
    }
}
```

`divide(6, 2)`, `divide(6, 0)` 을 차례로 부르고 `END` 를 찍으면:

```
OPEN
3
CLOSE
OPEN
java.lang.ArithmeticException: / by zero
CLOSE
END
```

- 예외 없음: OPEN → 3 → (catch 건너뜀) → **CLOSE**
- 예외 있음: OPEN → (예외) → catch → **CLOSE**

둘 다 CLOSE 가 나왔어요. 강사가 OPEN/CLOSE 라는 단어를 쓴 이유가 있어요. 실제 프로그램에서는 파일이나 데이터베이스를 "열었으면 반드시 닫아야" 하는데, 중간에 예외가 나도 닫는 코드는 꼭 실행되어야 하거든요. 그런 "뒷정리" 코드를 finally 에 넣어요.

비유하면 finally 는 **외출할 때 현관문 잠그기**예요. 약속이 잘 됐든 취소됐든 집을 나설 땐 무조건 문을 잠그죠.

---

## 8. throws : 예외 떠넘기기

지금까지는 예외가 생긴 그 자리에서 try ~ catch 로 처리했어요. `throws` 는 **"이 메소드에서 생긴 예외는 내가 처리하지 않고, 나를 부른 곳으로 넘길게"** 라는 표시예요.

```
리턴타입 메소드이름() throws 예외클래스1, 예외클래스2, ... { }
리턴타입 메소드이름() throws Exception { }   // 모든 예외를 한 번에 떠넘기기
```

- 강의에서는 "쓰로우문"이라고 발음하지만 키워드는 **`throws`** (끝에 s) 예요. 메소드 이름과 괄호 **뒤에** 써요.
- 강의 슬라이드에도 나오듯 `throws Exception` 하나만 써도 모든 예외를 간단히 떠넘길 수 있어요.

예제 (`code/ThrowsExample.java`, 강의의 `Test` 클래스를 `Thrower` 로 이름만 바꿨어요)

```java
class Thrower {
    public static void view() throws NullPointerException, NumberFormatException, ArithmeticException {
        int a = 3 / 0;                      // 예외 발생 -> 호출한 곳으로 넘어감
    }

    public static void disp() throws Exception {
        int a = Integer.parseInt("KOREA");
    }
}

public class ThrowsExample {
    public static void main(String[] args) {
        try {
            Thrower.view();   // 여기서 예외가 넘어와서 바로 catch 로
            Thrower.disp();   // 실행되지 않아요
        } catch (Exception e) {
            System.out.println(e);
        }
        ...
    }
}
```

실행 결과 (두 번째 try 에서 disp() 만 따로 부른 결과와 END 포함)

```
java.lang.ArithmeticException: / by zero
java.lang.NumberFormatException: For input string: "KOREA"
END
```

흐름:

1. main 이 `view()` 를 불러요.
2. view 안에서 `3 / 0` 예외가 생겨요. view 에는 try ~ catch 가 없으니, 예외를 **자기를 부른 main 으로 던져요.**
3. main 의 try 가 그 예외를 받아 catch 로 점프해요.

비유하면 **아르바이트생과 점장**이에요. 아르바이트생(view)이 처리하기 어려운 손님 문제가 생기면 직접 해결하지 않고 점장(main)에게 넘기죠. 점장은 넘어온 문제를 한곳에서 처리해요. 강의 화면 주석처럼 "예외를 한꺼번에 모아서 처리"할 수 있는 게 장점이에요.

**강의와 다른 점**

강사는 "throws 가 붙은 메소드는 **반드시** try ~ catch 안에서 불러야 한다"고 설명해요. 실제 규칙은 조금 더 섬세해요.

- `throws Exception` 처럼 **반드시 처리해야 하는 예외**를 떠넘기는 메소드는, 부르는 쪽에서 try ~ catch 로 감싸거나 자기도 `throws` 로 한 번 더 떠넘겨야 해요. 안 그러면 컴파일 에러가 나요.

  ```
  error: unreported exception Exception; must be caught or declared to be thrown
  ```

- 반면 `ArithmeticException`, `NullPointerException`, `NumberFormatException`, `ArrayIndexOutOfBoundsException` 같은 예외는 처리를 강제하지 않는 종류라서, `view()` 처럼 이것들만 throws 에 적은 메소드는 try ~ catch 없이 불러도 컴파일은 돼요. (대신 실행 중 예외가 나면 프로그램이 멈춰요.)

**참고(강의 밖 내용)**: 처리를 강제하는 예외를 **체크 예외(checked exception)**, 강제하지 않는 예외를 **언체크 예외(unchecked exception)** 라고 해요. 위의 4가지 예외는 모두 `RuntimeException` 의 자손인 언체크 예외예요. 파일 입출력 같은 곳에서 체크 예외를 만나게 되는데, 그때는 이클립스가 "처리하라"고 빨간 X 를 띄워 줘요. 지금은 초보 단계이니 강의대로 "throws 가 붙은 메소드는 try ~ catch 로 불러 준다"고 습관을 들여도 충분해요.

**참고(강의 밖 내용)**: `throws`(s 있음)와 헷갈리는 `throw`(s 없음)도 있어요. `throw` 는 `throw new Exception("메시지");` 처럼 **예외를 직접 만들어 일으키는** 명령이에요. 이번 강의에는 나오지 않아요.

---

## 자주 하는 실수

| 증상 / 에러 메시지 | 원인 | 해결 |
|---|---|---|
| 콘솔에 `Exception in thread "main" java.lang.ArithmeticException: / by zero` 가 나오고 뒤 코드가 실행 안 됨 | 정수를 0으로 나눴는데 예외처리를 안 했어요 | 나누는 값이 0이 아닌지 확인하고, 필요하면 try ~ catch 로 감싸요 |
| `java.lang.ArrayIndexOutOfBoundsException: Index 5 out of bounds for length 3` | 배열 길이보다 큰 번호(또는 음수)에 접근했어요. 길이 3이면 마지막 번호는 2예요 | 반복문 조건을 `i < arr.length` 로 써요 |
| `java.lang.NumberFormatException: For input string: "KOREA"` | 숫자가 아닌 문자열을 `Integer.parseInt` 했어요 | 숫자 형태의 문자열만 넘기거나 try ~ catch 로 처리해요 |
| `java.lang.NullPointerException: Cannot invoke "..." because "<local1>" is null` (자바 14 이상) | null 이 들어 있는 변수로 계산하거나 메소드를 불렀어요 | 변수에 진짜 객체가 들어갔는지 확인해요 |
| `error: exception ArithmeticException has already been caught` (javac) | 다중 catch 에서 부모 `Exception` 을 자식보다 **위에** 뒀어요 | `Exception` catch 는 맨 아래로 옮겨요 |
| `error: unreported exception Exception; must be caught or declared to be thrown` (javac) | `throws Exception` 이 붙은 메소드를 try ~ catch 없이 불렀어요 | try ~ catch 로 감싸거나 부르는 메소드에도 `throws` 를 붙여요 |
| `error: 'try' without 'catch', 'finally' or resource declarations` (javac) | try 만 쓰고 catch 나 finally 를 안 붙였어요 | try 뒤에 catch 또는 finally 를 붙여요 |
| 예외 메시지만 찍고 끝냄 | catch 가 문제를 해결해 준다고 착각했어요 | 메시지와 줄 번호를 보고 원인을 찾아 코드를 고쳐요 |

(위 에러 문구는 모두 자바 21에서 직접 실행해 확인한 거예요. 이클립스는 같은 상황에서 다른 문구로 보여 줄 수 있어요.)

---

## 시간대별 목차

- [00:00] 강의 목표: 프로그램 오류에 대처하는 예외처리
- [00:37] 이론: 예외란? 예외가 나도 프로그램은 정상 종료되어야 함
- [01:17] try ~ catch ~ finally 형식
- [02:21] 주의: 원인을 보고 고치는 건 개발자의 몫
- [02:48] 이론: throws 문 (호출한 곳으로 떠넘기기)
- [03:42] throws Exception 으로 모든 예외 떠넘기기
- [04:32] 실습 시작 (oop21 패키지, Test01_exception)
- [04:45] 빨간 X 문법 에러와 실행 중 예외의 차이
- [07:01] 3/0 으로 예외 일으키기, END 가 안 나오는 비정상 종료
- [09:40] 같은 코드를 try ~ catch 로 감싸기
- [11:25] 예외 발생 시 catch 로 점프하는 흐름
- [13:52] ArrayIndexOutOfBoundsException (배열 범위 초과)
- [15:30] NumberFormatException (Integer.parseInt("KOREA"))
- [16:55] NullPointerException (null 로 계산)
- [17:47] 다중 catch 문
- [18:54] Exception 클래스로 모든 예외 받기 (다형성)
- [20:47] finally 문 (OPEN / CLOSE)
- [22:09] throws 실습 (Test 클래스의 view, disp)
- [23:16] throws 메소드를 try ~ catch 로 호출
- [23:59] 강의 정리

---

## 용어 정리

| 용어 | 쉬운 뜻 |
|---|---|
| 예외 (Exception) | 문법은 맞지만 실행 도중에 생기는 문제 |
| 문법 에러 (컴파일 에러) | 저장(컴파일)할 때 걸리는 오류. 이클립스의 빨간 X |
| 비정상 종료 | 예외 때문에 프로그램이 중간에 멈춰 버리는 것 |
| 예외처리 | 예외가 나도 프로그램이 멈추지 않도록 대비하는 것 |
| try | 예외가 생길 만한 코드를 넣는 블록 |
| catch | try 에서 생긴 예외를 잡아서 처리하는 블록 |
| finally | 예외와 상관없이 항상 실행되는 블록 (뒷정리용) |
| 다중 catch | try 하나에 catch 를 여러 개 붙이는 것 |
| throws | 메소드에서 생긴 예외를 호출한 곳으로 떠넘기겠다는 표시 |
| Exception 클래스 | 모든 예외의 부모(조상) 클래스 |
| ArithmeticException | 0으로 나누기 같은 계산 오류 예외 |
| ArrayIndexOutOfBoundsException | 배열에 없는 번호로 접근할 때의 예외 |
| NumberFormatException | 숫자가 아닌 문자열을 숫자로 바꾸려 할 때의 예외 |
| NullPointerException | 비어 있는(null) 변수를 쓰려 할 때의 예외 |
| null | 아무 객체도 가리키지 않는 "비어 있음" 값 |
| printStackTrace() | 예외 정보와 발생 위치(줄 번호)까지 출력하는 메소드 |
| 체크 / 언체크 예외 (강의 밖) | 처리를 강제하는 예외 / 강제하지 않는 예외 |
