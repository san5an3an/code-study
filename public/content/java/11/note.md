# 11강. 메소드 return형과 메소드 오버로드

## 이 강의에서 배우는 것

- 메소드가 일을 끝내고 **값을 가지고 돌아오는 법**(리턴값)을 배워요.
- 돌려주는 값의 자료형에 맞춰 **리턴형**(`int`, `String`, `boolean`, `long` ...)을 정하는 법을 익혀요.
- 리턴값이 있는 메소드 호출은 그 자체가 **하나의 값**처럼 쓰인다는 걸 알아봐요.
- 이름이 같은 메소드를 여러 개 만드는 **메소드 오버로드(중복 정의)** 와, 그게 가능한 조건을 배워요.

---

## 1. 복습: 메소드는 부른 곳으로 돌아온다

10강에서 배운 내용을 잠깐 떠올려 볼게요.

- 메소드는 **정의(만들기)** 해 두고 **호출(부르기)** 해야 실행돼요.
- 메소드는 할 일을 마치면 **자기를 부른 곳으로 되돌아가요.** 이때 쓰는 명령어가 `return` 이에요.
- 지금까지는 돌아갈 때 **빈손**이었어요. 그래서 리턴형 자리에 `void`(돌려주는 값 없음)를 썼죠.

이번 강의는 "돌아갈 때 **값을 하나 들고** 돌아가기"예요.

---

## 2. 리턴값과 리턴형

### 비유: 심부름

친구에게 "편의점 가서 우유 사 와" 하고 심부름을 보낸다고 해 봐요.

- `void` 메소드 = "가서 불 좀 끄고 와" 같은 심부름. 다녀오기만 하면 끝이고, 들고 오는 게 없어요.
- 리턴값이 있는 메소드 = "우유 사 와" 같은 심부름. 돌아올 때 **우유(값)를 들고** 와요.

돌아올 때 들고 오는 값을 **리턴값(return value)**, 그 값의 자료형을 **리턴형(return type)** 이라고 불러요.

### 작성 형식

```
리턴형  메소드이름 ( 매개변수 ) {
    실행할 코드
    return 돌려줄값;
}
```

10강과 형식은 똑같아요. 달라진 건 딱 두 가지예요.

1. `void` 자리에 **돌려줄 값의 자료형**을 써요.
2. `return` 옆에 **돌려줄 값**을 적어요.

### 첫 예제: 두 수를 더해서 돌려주기

```java
public static int test1(int a, int b) {
    int sum = a + b;
    return sum;
}

public static void main(String[] args) {
    int result = test1(3, 5);
    System.out.println(result);
}
```

한 줄씩 볼게요.

- `public static int test1(int a, int b)` : `void` 대신 `int` 를 썼어요. "이 메소드는 끝나면 int 값 하나를 돌려줘요"라는 약속이에요. (`public static` 은 아직 그대로 따라 써요.)
- `int sum = a + b;` : a 에 3, b 에 5 가 들어왔으니 sum 은 8 이에요.
- `return sum;` : sum 의 값 8 을 **들고** 나를 부른 곳으로 돌아가요.
- `int result = test1(3, 5);` : 메소드가 돌아오면 `test1(3, 5)` 라는 부분이 통째로 **8 로 바뀐다**고 생각하면 돼요. 그래서 결국 `int result = 8;` 과 같아요.

실행 결과

```
8
```

### 왜 리턴형을 꼭 맞춰야 하나요?

`return sum;` 이라고 써 놓고 리턴형을 `void` 로 두면 에러가 나요. `void` 는 "아무것도 안 돌려준다"는 약속인데, 실제로는 값을 돌려주려 하니까 약속이 깨진 거예요.

- 이클립스: `Void methods cannot return a value` (강의 [06:45] 화면 하단에 실제로 표시됨)
- javac: `error: incompatible types: unexpected return value`

해결은 강의에서처럼 `void` 를 지우고, 돌려줄 값(sum)의 자료형인 `int` 를 쓰는 거예요.

강사가 알려 준 요령: **처음엔 일단 `void` 로 써 놓고**, 메소드 안을 다 짠 뒤 "내가 무엇을 return 하지?"를 보고 그 자료형으로 바꾸면 돼요.

---

## 3. 리턴값이 있는 호출은 "값"이에요

리턴값이 있는 메소드를 부르면, 그 호출 자리는 돌려받은 값으로 바뀌어요. 그래서 꼭 변수에 담지 않아도 **값이 들어갈 수 있는 자리면 어디든** 바로 쓸 수 있어요.

```java
System.out.println(test1(2, 4));
```

- `test1(2, 4)` 가 실행돼 6 을 들고 돌아와요.
- 그러면 이 줄은 `System.out.println(6);` 과 같아져요.

실행 결과

```
6
```

비유하면 계산기에서 `2 + 4` 를 누르고 나온 결과 `6` 을 바로 다른 계산에 이어 쓰는 것과 같아요.

---

## 4. 여러 가지 리턴형

리턴형은 **돌려주는 값이 어떤 모양이냐**에 따라 정해져요. 강의에서는 String, boolean, long 을 차례로 연습했어요.

### (1) String 을 돌려주기: 짝수/홀수 판별

```java
public static String test2(int a) {
    if (a % 2 == 0) {
        return "짝수";
    } else {
        return "홀수";
    }
}

public static void main(String[] args) {
    String str = test2(7);
    System.out.println(str);
    System.out.println(test2(6));
}
```

- `a % 2 == 0` : 2로 나눈 나머지가 0이면 짝수예요(06강 if 복습).
- `"짝수"`, `"홀수"` 는 큰따옴표로 감싼 글자라서 **String** 이에요. 그래서 리턴형도 `String`.
- `String str = test2(7);` : 돌려받는 값이 String 이니, 받는 변수도 `String` 이어야 해요. **받는 변수의 자료형 = 리턴형** 이라고 기억해요.
- return 이 두 군데 있지만, 실제로 실행되는 건 **둘 중 하나**예요. return 을 만나는 순간 메소드는 끝나요.

실행 결과

```
홀수
짝수
```

### (2) boolean 을 돌려주기: 윤년 판별

```java
public static boolean leap(int year) {
    if (year % 4 == 0) {
        return true;
    } else {
        return false;
    }
}

public static void main(String[] args) {
    if (leap(2020)) {
        System.out.println("윤년");
    } else {
        System.out.println("평년");
    }
}
```

- `true`, `false` 는 boolean(논리형, 04강) 값이라 리턴형이 `boolean` 이에요.
- `if (leap(2020))` : leap 이 true 를 들고 돌아오면 `if (true)` 가 되어 "윤년"이 찍혀요. if 의 괄호 안에는 참/거짓이 와야 하니, boolean 을 돌려주는 메소드는 if 조건 자리에 딱 맞아요.

실행 결과 (2020 과 2023 을 각각 넣어 본 결과)

```
윤년
평년
```

> 참고(강의 밖 내용): 실제 달력의 윤년 규칙은 "4로 나누어떨어지면 윤년, 하지만 100으로 나누어떨어지면 평년, 그래도 400으로 나누어떨어지면 윤년"이에요. 그래서 1900년은 평년, 2000년은 윤년이에요. 강의의 `year % 4 == 0` 은 리턴형 연습을 위한 간단한 버전이에요. 정확히 쓰려면 `(year % 4 == 0 && year % 100 != 0) || year % 400 == 0` 처럼 써요.

> 강의와 다른 점: 받아쓰기 원문에는 "2022 를 넣으면 4의 배수"처럼 들리는 부분이 있는데, 화면에서 실제로 넣은 값은 **2020** 이고 결과는 "윤년"이에요. 2022 는 4의 배수가 아니에요.

### (3) long 을 돌려주기: 팩토리얼

10강에서 만든 팩토리얼 메소드는 결과를 메소드 안에서 바로 **출력**했어요. 이번엔 결과를 **돌려주도록** 바꿔요.

```java
public static long fact(int a) {
    long gop = 1;
    for (int f = a; f >= 1; f--) {
        gop = gop * f;
    }
    return gop;
}

public static void main(String[] args) {
    long f = fact(4);
    System.out.println(f);
}
```

- `long gop = 1;` : 곱셈 누적은 1에서 시작해요(0이면 뭘 곱해도 0).
- `return gop;` : gop 이 long 이니 리턴형도 `long`.

실행 결과

```
24
```

### 출력하는 메소드 vs 돌려주는 메소드

| | 10강 방식 (`void`, 안에서 출력) | 11강 방식 (값을 돌려줌) |
|---|---|---|
| 결과 사용 | 화면에 찍고 끝 | 받은 쪽에서 출력, 계산, 비교 등 마음대로 |
| 예 | `fact(4);` → 24 가 찍힘 | `long f = fact(4);` → f 로 다른 계산 가능 |

돌려주는 방식이 훨씬 쓸모가 많아요. 예를 들어 `fact(4) + fact(3)` 처럼 결과끼리 더할 수도 있어요. 출력만 하는 메소드로는 이런 걸 못 해요.

---

## 5. 리턴값은 딱 하나

`return` 으로 돌려줄 수 있는 값은 **오직 한 개**예요. 쉼표로 두 개를 돌려줄 수는 없어요.

```java
return gop, 10;   // 에러!
```

강의 [17:45] 에서도 `return gop, ;` 처럼 쉼표를 넣어 보이며 에러가 나는 걸 보여 줬어요. javac 로 `return a, b;` 를 컴파일하면 이렇게 나와요.

```
error: ';' expected
error: not a statement
```

정리하면, 리턴값은 **없거나(void) 하나이거나** 둘 중 하나예요.

> 참고(강의 밖 내용): 값 여러 개를 한꺼번에 돌려주고 싶으면 배열(09강)이나, 나중에 배울 클래스로 묶어서 "하나"로 만들어 돌려줘요.

---

## 6. 메소드 오버로드 (중복 정의)

### 무엇인가요?

**같은 이름의 메소드를 여러 개 만드는 것**을 **메소드 오버로드(method overload)**, 우리말로 **메소드 중복 정의**라고 해요.

강의 슬라이드는 이렇게 비교해요.

| 이름을 다 다르게 지은 경우 | 오버로드한 경우 |
|---|---|
| `void add1(int a, int b)` | `void add(int a, int b)` |
| `void add2(double a, double b)` | `void add(double a, double b)` |
| `void add3(String a, String b)` | `void add(String a, String b)` |

> 강의와 다른 점: 슬라이드 왼쪽 세 번째 줄은 `add3(String a, String a)` 로 매개변수 이름이 둘 다 `a` 예요. 실제로 이렇게 쓰면 `error: variable a is already defined in method add3` 에러가 나요. `String a, String b` 가 맞아요.

### 왜 쓰나요? (비유: 리모컨의 "재생" 버튼)

리모컨 "재생" 버튼은 DVD 를 넣으면 영화를, CD 를 넣으면 음악을 틀어요. 버튼 이름은 하나인데, **들어온 것에 따라** 알맞게 동작하죠.

오버로드도 같아요. "더하기"라는 같은 일을 하는데 정수용, 실수용, 문자열용 이름을 `add1`, `add2`, `add3` 처럼 따로 외우면 불편해요. 이름은 `add` 하나로 통일하고, **넘긴 값의 모양을 보고 자바가 알아서 맞는 메소드를 골라 줘요.**

사실 우리가 매일 쓰는 `System.out.println` 도 오버로드된 메소드예요. `println(10)`, `println(3.14)`, `println("안녕")` 이 다 되는 이유가 println 이 자료형별로 여러 개 만들어져 있기 때문이에요. (참고(강의 밖 내용))

### 예제

```java
public static void add(int a) {
    System.out.println(a);
}
public static void add(int a, int b) {
    System.out.println(a + b);
}
public static void add(double a, double b) {
    System.out.println(a + b);
}
public static void add(String a, String b) {
    System.out.println(a + b);
}

public static void main(String[] args) {
    add(3);
    add(5, 7);
    add(1.2, 3.4);
    add("JAVA", "Python");
}
```

자바가 메소드를 고르는 과정을 하나씩 따라가 볼게요.

1. `add(3)` : 정수 1개 → 매개변수가 `(int a)` 인 첫 번째 add 를 불러요. → `3`
2. `add(5, 7)` : 정수 2개 → `(int a, int b)` → `12`
3. `add(1.2, 3.4)` : 실수 2개 → `(double a, double b)` → `4.6`
4. `add("JAVA", "Python")` : 문자열 2개 → `(String a, String b)`. 문자열끼리 `+` 는 **이어 붙이기**예요. → `JAVAPython`

실행 결과

```
3
12
4.6
JAVAPython
```

### 오버로드가 되는 조건

이름이 같아도 자바가 서로 다른 메소드로 구분하려면, **매개변수가 달라야** 해요. 구체적으로는 아래 중 하나 이상이 달라야 해요.

1. 매개변수의 **개수** : `add(int a)` vs `add(int a, int b)`
2. 매개변수의 **자료형** : `add(int a, int b)` vs `add(double a, double b)`

> 참고(강의 밖 내용): 자료형이 섞여 있을 때 **순서**가 달라도 구분돼요. 예) `f(int a, String b)` 와 `f(String a, int b)`. 정확히는 "매개변수의 개수, 자료형, 순서" 의 조합이 달라야 해요. 매개변수의 **이름**만 다른 건 구분이 안 돼요.

### 주의: 리턴형만 다른 건 오버로드가 아니에요

```java
public static void add(int a) { ... }
public static int  add(int a) { return a; }   // 에러!
```

둘은 리턴형이 `void` 와 `int` 로 다르지만, 매개변수는 `(int a)` 로 똑같아요. 그러면 `add(3);` 이라고 불렀을 때 자바는 둘 중 어느 걸 불러야 할지 알 수 없어요. 그래서 에러예요.

```
error: method add(int) is already defined in class OverloadMethod
```

(javac 로 직접 컴파일해서 확인한 문구예요. 이클립스에서는 "Duplicate method add(int) ..." 비슷한 문구가 나오는데 강의 화면에서는 확인 못 했어요.)

**한 줄 정리: 오버로드는 오직 매개변수로만 구분해요. 리턴형은 기준이 아니에요.**

---

## 7. 응용: 등수 구하기 (프로젝트 참고)

강의 끝에서 강사가 프로젝트할 때 쓸 만한 아이디어로 "등수 구하기"를 주석으로 설명했어요. 점수 `70, 80, 40, 60, 50` 중에서 내 점수 60 은 몇 등일까요?

생각하는 방법:

1. 등수는 **1부터** 시작해요. 혼자 시험 보면 1등이니까요.
2. 다른 점수와 하나씩 비교해서, **나보다 높은 점수가 있을 때마다** 등수를 1 늘려요(한 칸 밀려나요).
3. 60 < 70 → 2등, 60 < 80 → 3등, 나머지(40, 60, 50)는 나보다 높지 않음 → 최종 **3등**.

> 강의와 다른 점: 받아쓰기 원문에서는 "랭크 더하기 2"처럼 들리지만, 화면 코드는 `rank = rank + 1` 이에요. 한 명 앞설 때마다 1씩 늘어나는 게 맞아요.

강의에서는 주석으로만 적었는데, 배운 리턴값을 써서 실제로 돌아가게 만들면 이래요(`code/RankDemo.java`).

```java
public static int getRank(int[] scores, int myScore) {
    int rank = 1;
    for (int i = 0; i < scores.length; i++) {
        if (myScore < scores[i]) {
            rank = rank + 1;
        }
    }
    return rank;
}
```

- `int[] scores` : 배열(09강)도 매개변수로 받을 수 있어요.
- `return rank;` : 계산한 등수를 돌려줘요.

실행 결과 (`getRank(scores, 60)`, 80, 40 을 차례로 출력)

```
60점은 3등
80점은 1등
40점은 5등
```

---

## 자주 하는 실수

| 증상 / 에러 메시지 | 원인 | 해결 |
|---|---|---|
| `Void methods cannot return a value` (이클립스, 강의 화면) / `incompatible types: unexpected return value` (javac) | 리턴형이 `void` 인데 `return 값;` 을 썼어요 | `void` 를 지우고 돌려줄 값의 자료형을 써요 |
| `missing return statement` (javac) | 리턴형을 `int` 등으로 정해 놓고 `return` 을 안 썼어요. 또는 if 에서 한쪽 경우에만 return 했어요 | 어떤 경우에도 반드시 값이 return 되게 해요 (else 쪽도 return) |
| `incompatible types: String cannot be converted to int` (javac) | 리턴값의 자료형과 받는 변수의 자료형이 달라요. 예) `int r = test2(3);` | 받는 변수의 자료형을 리턴형과 똑같이 맞춰요 (`String r = ...`) |
| `';' expected` + `not a statement` (javac) | `return a, b;` 처럼 값을 두 개 돌려주려 했어요 | 리턴값은 하나만. 여러 개면 배열 등으로 묶어요 |
| `method add(int) is already defined in class ...` (javac) | 매개변수는 똑같고 리턴형만 다른 메소드를 같은 이름으로 또 만들었어요 | 매개변수의 개수나 자료형을 다르게 하거나, 이름을 바꿔요 |
| `variable a is already defined in method ...` (javac) | 한 메소드의 매개변수 이름을 똑같이 두 번 썼어요 (`String a, String a`) | 매개변수 이름은 서로 다르게 지어요 |
| 메소드를 불렀는데 아무것도 안 찍혀요 | 리턴값을 돌려받기만 하고 출력하지 않았어요. 예) `test1(3, 5);` 만 씀 | `System.out.println(test1(3, 5));` 처럼 받은 값을 출력해요 |

---

## 시간대별 목차

- [00:00] 강의 소개: 리턴형과 메소드 오버로드
- [00:38] 슬라이드 1: 메소드 return 타입, 작성 형식
- [01:42] 슬라이드 2: 메소드 중복 정의(오버로드)와 전제 조건
- [03:01] 실습 시작 (Test01_retrun 클래스), test1(3, 5) 호출
- [04:39] test1 안에서 sum = a + b
- [05:15] `return sum;` 으로 값 돌려주기
- [06:38] void 인데 값을 리턴하면 에러 → 리턴형을 int 로
- [08:00] 돌려받은 값을 result 변수에 담아 8 출력
- [08:37] `println(test1(2, 4))` : 호출 자체가 값 → 6
- [09:38] test2(7): 짝수/홀수를 String 으로 리턴
- [11:26] String str 로 받아 "홀수" 출력, test2(6) 은 "짝수"
- [13:13] leap(): 윤년 판별, boolean 리턴형
- [15:20] 2020 을 넣어 "윤년" 확인
- [15:46] fact(4): 팩토리얼을 long 으로 리턴 → 24
- [17:39] 주의: 리턴값은 오직 한 개 (쉼표로 두 개 불가)
- [17:54] 메소드 오버로드 실습 (Test02_overload 클래스), add(3)
- [18:34] add(5, 7): 이름이 같아도 매개변수 개수가 다르면 OK
- [19:36] add(1.2, 3.4): 자료형이 달라도 OK
- [20:20] add("JAVA", "Python"): String 두 개
- [21:17] 오버로드 전제 조건 정리: 매개변수의 개수와 자료형
- [21:51] 주의: 리턴형만 다른 건 오버로드가 아님
- [22:54] 프로젝트 참고: 등수 구하기 아이디어
- [24:37] 강의 정리

---

## 용어 정리

| 용어 | 쉬운 뜻 |
|---|---|
| 리턴값 (return value) | 메소드가 일을 끝내고 부른 곳으로 들고 돌아오는 값 |
| 리턴형 (return type) | 리턴값의 자료형. 메소드 이름 앞에 써요 (`int`, `String`, `boolean` ...) |
| void | 돌려주는 값이 없다는 표시 |
| return | 부른 곳으로 돌아가라는 명령어. 옆에 값을 쓰면 그 값을 들고 가요 |
| String | 큰따옴표로 감싼 글자(문자열)를 담는 자료형 |
| boolean | true(참) / false(거짓) 를 담는 자료형 |
| long | int 보다 큰 범위의 정수를 담는 자료형 |
| 메소드 오버로드 (overload) | 같은 이름의 메소드를 매개변수만 다르게 해서 여러 개 만드는 것 |
| 메소드 중복 정의 | 메소드 오버로드의 우리말 |
| 윤년 | 2월이 29일까지 있는 해. 강의에선 "4로 나누어떨어지는 해"로 단순화 |
| 팩토리얼 | n 부터 1 까지 차례로 곱한 값. 4! = 24 |
