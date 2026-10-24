# 14강. static 및 final 예약어

## 이 강의에서 배우는 것

- `static`(정적) 이 붙은 변수와 함수가 무엇인지, 왜 **객체를 만들지 않고도** 쓸 수 있는지 알아봐요.
- static 변수/함수는 `클래스이름.변수이름`, `클래스이름.함수이름()` 으로 접근하는 게 정석이라는 걸 익혀요.
- 자바가 미리 만들어 둔 static 함수(`Integer.parseInt`, `Integer.max`, `Character.toLowerCase` 등)를 써 봐요.
- `final`(마지막) 이 변수, 메소드, 클래스에 붙으면 각각 무엇을 막는지 배워요.

---

## 0. 먼저 떠올릴 것: 클래스와 객체 (12강 복습)

- **클래스** 는 설계도(붕어빵 틀), **객체(인스턴스)** 는 그 설계도로 `new` 해서 실제로 만든 것(붕어빵)이에요.
- 지금까지 멤버 변수를 쓰려면 `Sawon one = new Sawon(...);` 처럼 **객체를 먼저 만들고** `one.name` 처럼 접근했어요.

이번 강의의 static 은 이 규칙에 "예외"를 만들어 줘요. 객체를 만들지 않아도 쓸 수 있는 변수와 함수예요.

---

## 1. static 이란?

**static** 은 영어로 "고정된, 정적인" 이라는 뜻이에요. 변수나 함수 앞에 붙일 수 있어요.

- 변수 앞에 붙으면 **static 변수(정적 변수)**
- 함수(메소드) 앞에 붙으면 **static 함수(정적 함수, static 메소드)**

```java
public class 클래스이름 {
    static int 변수이름 = 초기값;      // static 변수
    static 리턴형 함수이름() { }       // static 함수
}
```

접근 방법은 이렇게 간단해요.

```
클래스이름.변수이름
클래스이름.함수이름()
```

### 왜 객체 없이 쓸 수 있나요?

일반 멤버 변수는 **객체마다 하나씩** 따로 생겨요. 사원이 3명이면 `name` 도 3개예요. 그래서 "누구의 name?" 인지 알려면 객체 이름(`one.name`)이 꼭 필요해요.

반면 static 변수는 **객체가 아니라 클래스에 딱 하나만** 있어요. 주인이 클래스니까, 클래스 이름만 대면 바로 찾을 수 있어요. 객체를 하나도 만들지 않았어도 이미 존재해요.

비유하면 이래요.

- 붕어빵 틀(클래스)로 붕어빵(객체)을 여러 개 구웠어요. 붕어빵마다 들어간 **팥의 양**은 다를 수 있어요. → 일반 멤버 변수
- 그런데 붕어빵 가게 **간판에 적힌 가게 이름**은 붕어빵마다 따로 있는 게 아니라, 가게에 하나만 걸려 있어요. 붕어빵을 하나도 안 구웠어도 간판은 있어요. → static 변수

그래서 "모든 객체가 같이 쓰는 값"(회사 이름, 세율 등)을 static 으로 만들어요.

---

## 2. 자바가 미리 만들어 둔 static 변수와 함수

자바에는 이미 static 으로 만들어진 것들이 아주 많아요. 특히 13강에서 배운 **래퍼 클래스**(`Integer`, `Character` 등)에 많아요.

이클립스에서 `Integer.` 까지 치면 목록이 나오는데, 이름 옆에 붙은 표시를 보면 구분할 수 있어요.

- 빨간 **S** : static
- 대문자 **F** : final

```java
System.out.println(Integer.SIZE);                    // 32
System.out.println(Integer.max(3, 5));               // 5
System.out.println(Integer.toBinaryString(15));      // 1111
System.out.println(Integer.toOctalString(15));       // 17
System.out.println(Integer.toHexString(15));         // f
int num = Integer.parseInt("789");
System.out.println(num + 1);                         // 790
System.out.println(Character.getNumericValue('3'));  // 3
System.out.println(Character.toLowerCase('R'));      // r
```

한 줄씩 볼게요.

- `Integer.SIZE` : int 하나가 몇 비트인지 담긴 static 변수예요. int 는 32비트(= 4바이트, 04강)라서 32가 나와요.
- `Integer.max(3, 5)` : 두 정수 중 큰 수를 돌려주는 static 함수예요.
- `Integer.toBinaryString(15)` : 10진수 15를 2진수 글자 `"1111"` 로 바꿔 줘요. `toOctalString` 은 8진수, `toHexString` 은 16진수예요.
- `Integer.parseInt("789")` : 큰따옴표 안의 **글자** `"789"` 를 **진짜 정수** 789로 바꿔 줘요. 강사가 "굉장히 자주 쓴다"고 강조한 함수예요. 정수가 되었으니 `+ 1` 이 덧셈으로 계산돼서 790이 나와요. (강의에서는 바로 789를 출력했고, 여기서는 정수로 바뀐 걸 보여 주려고 1을 더했어요.)
- `Character.getNumericValue('3')` : 문자 `'3'` 을 정수 3으로 바꿔 줘요.
- `Character.toLowerCase('R')` : 대문자 `'R'` 을 소문자 `'r'` 로 바꿔 줘요.

모두 `new Integer()` 같은 객체 생성 없이 **클래스 이름으로 바로** 불렀다는 게 핵심이에요.

실행 결과

```
32
5
1111
17
f
790
3
r
```

(예제: `code/StaticLibrary.java`)

---

## 3. 직접 static 변수/함수 만들어 보기: 사원 클래스

사원 정보를 담는 `Sawon` 클래스를 만들어요.

```java
class Sawon {
    String sabun;  // 사원 번호
    String name;   // 이름
    int pay;       // 급여

    public Sawon() {}                           // 기본 생성자

    public Sawon(String s, String n, int p) {   // 생성자 오버로드
        sabun = s;
        name = n;
        pay = p;
    }

    static String COMPANY = "(주)대한민국IT 아카데미";
    static double TAX = 0.03;
    static int SUDANG = 10;

    static void line() {
        System.out.println("----------------------");
    }
}
```

- `sabun`, `name`, `pay` : 사원마다 다른 값이니 **일반 멤버 변수**로 둬요.
- `public Sawon() {}` : 매개변수가 없는 생성자, **기본 생성자(default constructor)** 예요 (12강 복습).
- `public Sawon(String s, String n, int p)` : 매개변수가 다른 생성자를 하나 더 만들었어요. 생성자도 메소드처럼 **오버로드**(11강)가 돼요.
- `COMPANY`, `TAX`, `SUDANG` : 회사 이름, 세율, 수당은 **모든 사원이 똑같으니** static 으로 만들었어요.
- `static void line()` : 줄을 긋는 static 함수예요.

### 방법 1. 객체 이름으로 접근 (동작은 하지만 비추천)

```java
Sawon one = new Sawon("1001", "무궁화", 100);
int myTax = (int) (one.pay * one.TAX);          // 세금 = 급여 x 0.03
int total = (one.pay + one.SUDANG) - myTax;     // 실수령액 = (급여 + 수당) - 세금
System.out.println(one.COMPANY);
...
one.line();
```

- `(int)` : 계산 결과(실수)의 소수점 아래를 버리고 정수만 남겨요 (04강 형변환). 100 x 0.03 = 3.
- 실수령액 = (100 + 10) - 3 = 107.
- `one.TAX`, `one.COMPANY`, `one.line()` 처럼 static 인데도 **객체 이름**으로 접근했어요. 문법상 에러는 아니에요. 하지만 이클립스는 노란 경고(`The static field Sawon.COMPANY should be accessed in a static way` 같은 문구)를 띄워요. "static 은 static 방식으로, 즉 클래스 이름으로 접근하라"는 뜻이에요.

### 방법 2. 클래스 이름으로 접근 (추천)

```java
Sawon two = new Sawon("1002", "오필승", 200);
myTax = (int) (two.pay * Sawon.TAX);
total = (two.pay + Sawon.SUDANG) - myTax;
System.out.println(Sawon.COMPANY);
System.out.println(two.sabun);
...
Sawon.line();
```

- 사원마다 다른 값(`two.pay`, `two.sabun`)은 **객체 이름**으로,
- 모두가 같이 쓰는 값(`Sawon.TAX`, `Sawon.COMPANY`)은 **클래스 이름**으로 접근했어요.
- 이렇게 쓰면 코드만 봐도 "이건 사원 한 명의 값", "이건 회사 공통 값" 이 바로 구분돼요. static 을 쓰는 이유가 바로 이거예요.
- 세금 = 200 x 0.03 = 6, 실수령액 = (200 + 10) - 6 = 204.

실행 결과 (방법 1 + 방법 2)

```
(주)대한민국IT 아카데미
1001
무궁화
100
10
세금 : 3
실수령액 : 107
----------------------
(주)대한민국IT 아카데미
1002
오필승
200
10
세금 : 6
실수령액 : 204
----------------------
```

(예제: `code/StaticSawon.java`. 강의에서는 `Sawon.java` 를 따로 만들었지만 한 파일에 합쳤어요.)

> **강의와 다른 점**: 받아쓰기에는 두 번째 사원 이름이 "오피스"로 들렸지만, 화면 코드는 `"오필승"` 이에요. 또 강의 화면에서는 방법 2 의 결과를 직접 보여 주지 않았는데, 실제로 돌려 보면 위처럼 세금 6, 실수령액 204가 나와요.

### static 변수 이름은 대문자로?

강사는 "static 변수는 일반 변수와 구분하려고 대문자로 쓰는 경우가 많다, 꼭 그럴 필요는 없다"고 했어요.

> **강의와 다른 점**: 자바에서 널리 쓰는 약속(코딩 관례)은 조금 달라요. 이름을 전부 대문자로 쓰는 건 **`static final` 로 만든, 절대 안 바뀌는 상수**(예: `Integer.MAX_VALUE`)일 때예요. 그냥 static 변수(값이 바뀔 수 있는 것)는 보통 `count` 처럼 일반 변수와 같은 방식으로 써요. 다만 강사 말대로 문법 규칙은 아니라서 대문자로 써도 에러는 안 나요.

---

## 4. 참고(강의 밖 내용): static 변수는 "모두가 하나를 같이" 써요

강의에서는 접근 방법만 다뤘지만, static 의 진짜 성질을 한 번 확인해 두면 이해가 훨씬 쉬워요.

```java
class Member {
    String name;          // 객체마다 따로
    static int count = 0; // 클래스에 하나, 모두가 같이 씀

    Member(String n) {
        name = n;
        count++;          // 객체가 만들어질 때마다 공용 count 를 1 올림
    }
}

System.out.println("처음 회원 수: " + Member.count);
Member a = new Member("철수");
Member b = new Member("영희");
Member c = new Member("민수");
System.out.println(a.name + ", " + b.name + ", " + c.name);
System.out.println("지금 회원 수: " + Member.count);
Member.count = 100;
System.out.println(a.count);
```

- 객체를 하나도 만들기 전에도 `Member.count` 를 쓸 수 있어요 → 0.
- 객체 세 개가 **각자의 count** 를 올린 게 아니라 **하나뿐인 count** 를 세 번 올렸어요 → 3.
- 클래스 이름으로 100으로 바꾸면, 어느 객체로 봐도 100이에요. 공유하고 있으니까요.

실행 결과

```
처음 회원 수: 0
철수, 영희, 민수
지금 회원 수: 3
100
```

(예제: `code/StaticShared.java`)

### main 앞에 static 이 붙는 이유

10강부터 `public static void main` 이라고 그대로 따라 썼죠. 프로그램이 시작될 때는 아직 객체가 하나도 없어요. 그래서 자바가 객체 없이 바로 부를 수 있도록 main 은 static 이어야 해요. 같은 이유로 10~11강에서 main 이 직접 부르는 메소드에도 static 을 붙였던 거예요.

---

## 5. final 이란?

**final** 은 "마지막" 이라는 뜻이에요. 변수, 메소드(함수), 클래스 세 곳에 붙을 수 있고, 각각 "더는 바꿀 수 없다"는 의미가 돼요.

| 붙는 곳 | 이름 | 막는 것 |
|---|---|---|
| 변수 | final 변수 | 값을 다시 넣는 것 (상수가 됨) |
| 메소드 | final 메소드 | 자식 클래스가 고쳐 쓰는 것 (오버라이드) |
| 클래스 | final 클래스 (종단 클래스) | 자식 클래스를 만드는 것 (상속) |

### 5-1. final 변수: 값을 바꿀 수 없어요

```java
int a = 3;
System.out.println(a);   // 3
a = 5;
System.out.println(a);   // 5

final int b = 2;
System.out.println(b);   // 2
// b = 4;                // 에러!
```

- 보통 변수 `a` 는 새 값을 넣으면 바뀌어요. 이게 변수의 기본 성질이에요.
- `final int b = 2;` 는 2가 **마지막 값**이라는 뜻이에요. `b = 4;` 처럼 다시 넣으려고 하면 컴파일 에러가 나요.
- 이렇게 변수를 못 바꾸게 만드는 걸 **상수화** 한다고 해요. (03강에서 배운 상수와 같은 개념이에요.)

실행 결과

```
3
5
2
```

`b = 4;` 의 주석을 풀면 나오는 에러:

- 이클립스: `The final local variable b cannot be assigned. It must be blank and not using a compound assignment` (강의 화면 [19:30])
- javac: `error: cannot assign a value to final variable b` (직접 컴파일해서 확인)

왜 쓰나요? 원주율이나 세율처럼 **프로그램 중간에 바뀌면 안 되는 값**을 실수로 바꾸는 걸 컴파일러가 막아 주니까요.

### 상속을 아주 짧게 (다음 강의 예고)

final 메소드와 final 클래스는 **상속** 을 알아야 이해돼요. 상속은 15강에서 자세히 배우니, 여기서는 이것만 알아 두면 돼요.

- `class Elephant extends Animal` : Elephant 클래스가 Animal 클래스의 내용을 **물려받는다** 는 뜻이에요. Animal 은 부모, Elephant 는 자식이에요.
- **오버라이드(override)** : 자식이 부모에게 물려받은 메소드를 **자기에게 맞게 고쳐 쓰는 것**이에요.

비유: 부모님께 받은 요리 레시피(메소드)를 내 입맛대로 고쳐 쓰는 게 오버라이드예요. 그런데 "이 레시피는 절대 고치지 마라"고 도장 찍어 둔 게 final 메소드, "이 집안 레시피는 아예 물려주지 않는다"는 게 final 클래스예요.

### 5-2. final 클래스: 자식을 만들 수 없어요

```java
final class Animal {}
class Elephant extends Animal {}   // 에러!
```

- `final class Animal` : Animal 이 "마지막 클래스" 라서 후손을 만들 수 없어요. 그래서 **종단 클래스** 라고도 불러요.
- `final` 을 지우면 에러가 사라져요.

에러 메시지

- javac: `error: cannot inherit from final Animal` (직접 컴파일해서 확인)
- 이클립스 문구는 강의 화면에서 확인하지 못했어요.

참고(강의 밖 내용): 자바의 `String` 클래스도 final 클래스라서 `class MyString extends String` 은 안 돼요.

### 5-3. final 메소드: 자식이 고쳐 쓸 수 없어요

```java
class Fruit {
    void view() {}
    final void disp() {}
}

class Apple extends Fruit {
    @Override
    void view() {}       // OK: 보통 메소드는 고쳐 쓸 수 있어요

    // @Override
    // void disp() {}    // 에러! final 메소드는 고쳐 쓸 수 없어요
}
```

- `Apple` 은 `Fruit` 를 물려받았어요.
- `view()` 는 보통 메소드라 Apple 이 다시 만들어(오버라이드) 쓸 수 있어요.
- `disp()` 는 final 이라 Apple 에서 다시 만들면 에러예요. 강의에서 이클립스 자동 완성(Ctrl+Space)을 눌러 보니 `view` 는 목록에 나오는데 `disp` 는 아예 안 나왔어요. 고쳐 쓸 수 없으니 후보에서 빠진 거예요.
- `@Override` : "이건 부모 메소드를 고쳐 쓰는 거예요" 라고 컴파일러에게 알려 주는 표시예요. 이렇게 `@` 로 시작하는 표시를 **어노테이션(annotation)** 이라고 해요.

에러 메시지 (javac, 직접 컴파일해서 확인)

```
error: disp() in Apple cannot override disp() in Fruit
  overridden method is final
```

(예제: `code/FinalExample.java`)

---

## 6. 정리

- **static** = 클래스에 속한 것. 객체를 만들지 않고 `클래스이름.변수`, `클래스이름.함수()` 로 써요. 모든 객체가 하나를 같이 써요.
- **final** = 한 번 정해지면 마지막. 변수는 값을 못 바꾸고, 메소드는 오버라이드를 못 하고, 클래스는 상속을 못 해요.

---

## 자주 하는 실수

| 증상 / 에러 메시지 | 원인 | 해결 |
|---|---|---|
| `cannot assign a value to final variable b` (javac) / `The final local variable b cannot be assigned...` (이클립스) | final 변수에 새 값을 넣으려 했어요 | 바뀌어야 하는 값이면 final 을 빼고, 아니면 대입하는 줄을 지워요 |
| `non-static variable pay cannot be referenced from a static context` (javac) | static 함수(main 포함) 안에서 일반 멤버 변수를 객체 없이 썼어요. static 함수는 객체 없이 불리니 "누구의 pay?" 인지 알 수 없어요 | 객체를 만들고 `one.pay` 처럼 쓰거나, 정말 공용 값이면 변수를 static 으로 만들어요 |
| `non-static method hello() cannot be referenced from a static context` (javac) | main 에서 static 이 아닌 메소드를 바로 불렀어요 | 메소드에 static 을 붙이거나 객체를 만들어 `객체.hello()` 로 불러요 |
| 이클립스 노란 경고 `The static field Sawon.COMPANY should be accessed in a static way` | static 변수를 객체 이름(`one.COMPANY`)으로 접근했어요. 에러는 아니에요 | `Sawon.COMPANY` 처럼 클래스 이름으로 바꿔요 |
| `cannot inherit from final Animal` (javac) | final 클래스를 extends 했어요 | 상속이 필요하면 부모 클래스에서 final 을 빼요 |
| `disp() in Apple cannot override disp() in Fruit` / `overridden method is final` (javac) | 부모의 final 메소드를 자식에서 다시 만들었어요 | 메소드 이름을 다르게 하거나, 부모에서 final 을 빼요 |
| `variable MAX might not have been initialized` (javac) | `static final int MAX;` 처럼 final 변수를 값 없이 선언만 했어요 | 선언할 때 `= 값` 을 넣어 줘요 |
| 실행하면 `NumberFormatException: For input string: "12a"` | `Integer.parseInt` 에 숫자가 아닌 글자가 섞인 문자열을 넣었어요 (컴파일은 되고 실행 중에 멈춰요) | 숫자로만 된 문자열을 넣어요 |

(위 javac 문구와 NumberFormatException 문구는 JDK 21 에서 직접 실행해 확인했어요. 이클립스 노란 경고 문구는 강의 화면에 노란 표시만 보이고 문구가 안 보여서, 이클립스가 보통 띄우는 문구를 적었어요. 직접 확인한 것은 아니에요.)

---

## 시간대별 목차

- [00:00] 강의 소개: static 변수/함수 접근 방법, final 의 특징
- [00:34] 이론: static 은 "고정된", 정적 변수와 정적 함수
- [01:25] 접근 방법: 클래스이름.변수이름, 클래스이름.함수이름()
- [02:16] 이론: final 은 "마지막", 변수/함수/클래스에 붙음
- [02:34] final 변수 = 변수의 상수화
- [03:01] final 함수(오버라이드 불가), final 클래스(상속 불가, 종단 클래스)
- [04:26] 실습 시작: oop15 패키지, Test01 클래스
- [04:45] Integer. 자동 완성 목록의 빨간 S(static), F(final) 표시
- [05:10] Integer.SIZE 출력 (32)
- [06:04] Integer.max, toBinaryString
- [07:16] toOctalString, toHexString
- [07:44] Integer.parseInt("789") : 자주 쓰는 함수
- [08:29] Character.getNumericValue, toLowerCase
- [09:24] Sawon 클래스 만들기: 멤버 변수, 기본 생성자
- [11:04] 생성자 오버로드
- [11:37] static 변수 COMPANY, TAX, SUDANG 과 static 함수 line()
- [12:54] 1번: static 특징을 반영하지 않은 경우 (one.TAX 등)
- [15:57] static 함수 line() 호출
- [16:13] 2번: static 특징을 반영한 경우 (Sawon.TAX 등, 추천)
- [18:12] Test03: final 변수, 대입하면 에러
- [20:10] final 클래스: Animal, Elephant extends Animal 에러
- [22:32] final 메소드: Fruit, Apple, view 는 오버라이드 가능 / disp 는 불가
- [24:56] 어노테이션(@Override) 소개
- [25:11] 강의 정리

---

## 용어 정리

| 용어 | 쉬운 뜻 |
|---|---|
| static (정적) | "클래스에 속한다"는 표시. 객체 없이 클래스 이름으로 써요 |
| static 변수 | 클래스에 딱 하나만 있고 모든 객체가 같이 쓰는 변수 |
| static 함수 (static 메소드) | 객체 없이 `클래스이름.함수()` 로 부를 수 있는 함수 |
| 멤버 변수 (필드) | 클래스 안에 선언한 변수. static 이 없으면 객체마다 따로 생겨요 |
| final | "마지막". 한 번 정하면 바꿀 수 없다는 표시 |
| final 변수 | 값을 다시 넣을 수 없는 변수 (= 상수) |
| 상수화 | 변수를 값이 안 바뀌는 상수로 만드는 것 |
| final 메소드 | 자식 클래스가 오버라이드할 수 없는 메소드 |
| final 클래스 (종단 클래스) | 자식 클래스를 만들 수 없는 클래스 |
| 상속 (extends) | 다른 클래스의 내용을 물려받는 것 (15강) |
| 오버라이드 (override) | 물려받은 메소드를 자식이 고쳐 쓰는 것 |
| 어노테이션 (annotation) | `@Override` 처럼 `@` 로 시작해 컴파일러에게 정보를 주는 표시 |
| 래퍼 클래스 | `Integer`, `Character` 처럼 기본 자료형을 감싼 클래스 (13강) |
| Integer.parseInt() | 숫자 모양 문자열을 정수로 바꾸는 static 함수 |
