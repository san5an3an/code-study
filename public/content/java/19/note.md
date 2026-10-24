# 19강. 추상 클래스와 인터페이스

## 이 강의에서 배우는 것

- 본체 `{ }` 가 없는 **추상 메소드**와, 그걸 가진 **추상 클래스**가 무엇인지 알아봐요.
- 추상 클래스를 상속한 자식은 추상 메소드를 **반드시 오버라이드(재정의)** 해야 한다는 규칙을 익혀요.
- 추상 메소드만 모아 둔 **인터페이스**와, 인터페이스를 상속할 때 쓰는 **implements(구현)** 를 배워요.
- 추상 클래스와 인터페이스 모두 **직접 `new` 할 수는 없지만, 다형성으로 부모 역할**을 한다는 걸 확인해요.
- 클래스는 **단일 상속**만, 인터페이스끼리는 **다중 상속**이 된다는 상속 규칙을 정리해요.

---

## 0. 시작 전에: 앞에서 배운 것 잠깐 떠올리기

- **상속(extends)**: 부모 클래스의 변수와 메소드를 자식이 물려받는 것 (15강)
- **오버라이드(override)**: 물려받은 메소드를 자식이 자기 식으로 다시 만드는 것. 위에 `@Override` 를 붙이면 컴파일러가 제대로 재정의했는지 검사해 줘요. (15강)
- **다형성**: 부모 타입 변수에 자식 객체를 담을 수 있고, 메소드를 부르면 **실제로 담긴 자식의 메소드**가 실행되는 성질 (18강)

> 강의 화면과 말에서 "다양성"이라는 표현이 나오는데, 정확한 용어는 **다형성(polymorphism)** 이에요. "여러 가지 모양을 가질 수 있는 성질"이라는 뜻이에요.

이번 강의의 핵심 단어는 강사가 여러 번 강조한 **"미완성"** 이에요. 추상 메소드, 추상 클래스, 인터페이스는 모두 "아직 덜 만들어진 것"이라고 생각하면 규칙들이 자연스럽게 이해돼요.

---

## 1. 추상 메소드: 본체가 없는 메소드

지금까지 만든 메소드는 모두 `{ }` 안에 "할 일"이 적혀 있었어요. **추상 메소드(abstract method)** 는 이 `{ }`(본체)를 아예 빼고 **세미콜론 `;` 으로 끝낸** 메소드예요. 앞에는 `abstract`(추상적인, 덜 구체적인) 라는 키워드를 붙여요.

```java
abstract void disp();      // 추상 메소드: 이름과 모양만 있고, 할 일은 안 적혀 있어요
void view() { ... }        // 일반 메소드: 할 일이 { } 안에 적혀 있어요
```

형식은 이렇게 돼요.

```
abstract 리턴형 메소드이름(매개변수);
```

**비유**: 추상 메소드는 회사의 **업무 지시서 빈칸**이에요. "보고서 작성"이라는 항목만 있고 내용은 비어 있어요. 내용은 각 담당자(자식 클래스)가 채워야 해요.

### 왜 이런 걸 만드나요?

"동물이라면 모두 자기를 소개하는 기능(`disp`)이 있어야 해. 그런데 **어떻게** 소개할지는 코끼리, 참치마다 달라." 이런 상황이에요. 부모는 "이 기능은 꼭 있어야 한다"는 **약속**만 정하고, 구체적인 내용은 자식에게 맡기는 거예요.

---

## 2. 추상 클래스: 미완성 클래스

추상 메소드가 **하나라도** 들어 있는 클래스는 `class` 앞에 `abstract` 를 붙여서 **추상 클래스(abstract class)** 로 만들어야 해요.

```java
abstract class Animal {          // 추상 클래스
    String name;                 // 멤버 변수도 둘 수 있어요

    void view() {                // 일반 메소드도 같이 둘 수 있어요
        System.out.println("Animal.view()...");
    }

    abstract void disp();        // 추상 메소드
}
```

- `abstract class Animal` : Animal 은 추상 클래스예요.
- `String name;`, `void view() {...}` : 추상 클래스도 보통 클래스처럼 변수와 일반 메소드를 가질 수 있어요.
- `abstract void disp();` : 본체 없는 추상 메소드. 이 줄 때문에 Animal 은 추상 클래스여야 해요.

추상 메소드가 있는데 `class` 앞의 `abstract` 를 빼먹으면 에러가 나요.

### 추상 클래스로는 직접 객체를 만들 수 없어요

```java
Animal animal = new Animal();   // 에러!
```

이클립스에서는 `Cannot instantiate the type Animal`, javac 에서는 이런 에러가 나요.

```
error: Animal is abstract; cannot be instantiated
```

**왜?** Animal 안에는 할 일이 비어 있는 `disp()` 가 있어요. 만약 객체를 만들 수 있다면 `animal.disp()` 를 불렀을 때 실행할 내용이 없잖아요. 미완성 설계도로는 물건을 만들 수 없는 것과 같아요.

> 참고(강의 밖 내용): 강사가 "방법이 전혀 없는 건 아니다"라고 한 건 **익명 클래스**를 말하는 거예요. `new Animal() { void disp() {...} };` 처럼 만드는 그 자리에서 빈 메소드를 채워 주는 방식인데, 결국 "이름 없는 자식 클래스"를 하나 만드는 것이라 규칙이 깨지는 건 아니에요. 지금은 몰라도 괜찮아요.

---

## 3. 추상 클래스 상속하기: 반드시 오버라이드

추상 클래스를 상속할 때도 똑같이 `extends` 를 써요. 그런데 이렇게만 쓰면 에러가 나요.

```java
class Elephant extends Animal {   // 에러!
}
```

```
error: Elephant is not abstract and does not override abstract method disp() in Animal
```

에러 문장을 풀어 보면 "Elephant 는 추상 클래스도 아닌데, Animal 의 추상 메소드 disp() 를 오버라이드하지 않았다"는 뜻이에요. 부모의 미완성 메소드를 물려받았으니 **Elephant 도 미완성**인 상태인 거예요.

해결 방법은 물려받은 추상 메소드를 **오버라이드해서 완성**하는 거예요. (이클립스에서는 클래스 안에서 `Ctrl + Space` 를 누르면 오버라이드할 메소드 목록이 나와요.)

```java
class Elephant extends Animal {
    @Override
    void disp() {
        System.out.println("Elephant.disp()");
    }
}

class Tuna extends Animal {
    @Override
    void disp() {
        System.out.println("Tuna.disp()");
    }
}
```

```java
Elephant jumbo = new Elephant();
jumbo.view();   // 부모에게 물려받은 일반 메소드
jumbo.disp();   // Elephant 가 완성한 메소드

Tuna nemo = new Tuna();
nemo.view();
nemo.disp();
```

실행 결과

```
Animal.view()...
Elephant.disp()
Animal.view()...
Tuna.disp()
```

> **규칙**: 추상 클래스를 상속받은 자식 클래스는 **추상 메소드를 반드시 오버라이드**해야 해요. (자식도 `abstract` 를 붙여 또 다른 추상 클래스로 만드는 방법도 있지만, 그러면 그 자식도 `new` 할 수 없어요.)

### 추상 클래스의 다형성

추상 클래스는 직접 객체가 될 수는 없지만, **부모 타입 변수**로는 쓸 수 있어요. 그래서 강의 슬라이드에도 "추상 클래스는 다형성을 활용해서 주로 부모 역할만 한다"고 적혀 있어요.

```java
Animal animal = null;      // null: 아직 아무 객체도 가리키지 않는 "빈" 상태

animal = new Elephant();   // 부모 타입 변수에 자식 객체를 담아요
animal.disp();             // Elephant 의 disp() 실행

animal = new Tuna();
animal.disp();             // Tuna 의 disp() 실행
```

실행 결과

```
Elephant.disp()
Tuna.disp()
```

- `Animal animal = null;` : `null` 은 문자열 `"null"` 이 아니라 **"비어 있음"을 뜻하는 특별한 값**이에요. 따옴표를 붙이지 않아요.
- 같은 `animal.disp()` 인데 담긴 객체에 따라 결과가 달라져요. 이게 다형성이에요.

**왜 이게 좋을까?** 동물 종류가 100가지로 늘어나도 "`Animal` 이면 `disp()` 가 반드시 있다"는 게 보장돼요. 추상 메소드 덕분에 자식이 `disp()` 를 빼먹는 실수는 컴파일 단계에서 막혀요.

전체 코드: `code/AbstractTest.java`

---

## 4. 인터페이스: 추상 메소드만 모은 설계도

**인터페이스(interface)** 는 추상 클래스보다 한 단계 더 "미완성"인 설계도예요. 강의 기준으로 정리하면:

- 인터페이스에는 **추상 메소드만** 올 수 있어요. 본체가 있는 일반 메소드는 안 돼요.
- 그래서 메소드 앞의 `abstract` 는 **생략해도** 돼요. 써도 되고요.
- 추상 클래스보다 더 추상적이라 **직접 객체를 만들 수 없어요.**

이클립스에서는 패키지 우클릭 → New → **Interface** 로 만들 수 있어요.

```java
interface Creature {
    // void view() { }       // 에러: 본체가 있는 메소드는 못 와요
    abstract void kind();    // 추상 메소드
    void breathe();          // abstract 생략. 그래도 추상 메소드예요
}
```

본체를 넣으면 javac 는 이렇게 알려 줘요.

```
error: interface abstract methods cannot have body
```

**비유**: 인터페이스는 **자격증 시험 과목표**예요. "운전 자격증을 따려면 `출발하기`, `멈추기` 를 할 줄 알아야 한다"는 목록만 있어요. 어떻게 하는지는 각자 익혀서(구현해서) 보여 줘야 해요. 강사도 "인터페이스는 함수 이름만 나열해 놓은 것"이라고 생각하라고 해요.

```java
Creature creature = new Creature();   // 에러: Creature is abstract; cannot be instantiated
```

> 강의와 다른 점: "인터페이스에는 추상 메소드만 올 수 있다"는 건 **자바 7까지의 규칙**이에요. 자바 8부터는 본체가 있는 `default` 메소드와 `static` 메소드도 인터페이스에 넣을 수 있어요. 다만 강의처럼 `default` 없이 `void view() { }` 라고 쓰면 지금도 에러가 나요. 처음 배울 때는 "인터페이스 = 추상 메소드 목록"으로 이해해도 충분하고, 나중에 `default` 를 만나면 "아, 예외가 생겼구나" 하면 돼요.

---

## 5. implements: 인터페이스를 구현하기

클래스가 **클래스**를 상속할 땐 `extends`, 클래스가 **인터페이스**를 상속할 땐 `implements` 를 써요. implements 는 "구현하다"라는 뜻이에요. 인터페이스의 빈 메소드들을 실제로 만들어 채운다는 의미라서 "상속받는다" 대신 **"구현한다"** 라고 말해요.

| 누가 | 무엇을 상속 | 키워드 |
|---|---|---|
| 클래스 | 클래스 (추상 클래스 포함) | `extends` |
| 클래스 | 인터페이스 | `implements` |
| 인터페이스 | 인터페이스 | `extends` |

인터페이스도 미완성이니까, implements 한 클래스는 **인터페이스의 추상 메소드를 전부 오버라이드**해야 해요.

```java
class Tiger implements Creature {
    @Override
    public void kind() {
        System.out.println("포유류");
    }

    @Override
    public void breathe() {
        System.out.println("허파");
    }
}

class Salmon implements Creature {
    @Override
    public void kind() {
        System.out.println("어류");
    }

    @Override
    public void breathe() {
        System.out.println("아가미");
    }
}
```

### 왜 여기서는 public 을 붙이나요?

앞의 Elephant 에서는 `void disp()` 라고만 썼는데, Tiger 에서는 `public void kind()` 라고 `public` 을 붙였어요. 강의에서는 이클립스 자동완성이 넣어 줘서 따로 설명하지 않았지만 중요한 차이예요.

> 참고(강의 밖 내용): 인터페이스 안의 메소드는 따로 안 써도 **자동으로 `public`** 이에요. 그리고 오버라이드할 때는 부모보다 접근 범위를 **좁힐 수 없어요.** 그래서 `public` 을 빼고 `void kind()` 라고 쓰면 에러가 나요.
>
> ```
> error: kind() in Tiger cannot implement kind() in Creature
>   attempting to assign weaker access privileges; was public
> ```

### 인터페이스의 다형성

인터페이스 타입 변수에도 그 인터페이스를 구현한 객체를 담을 수 있어요. 슬라이드에도 "인터페이스 기반의 다형성 활용도가 많다"고 적혀 있을 만큼 실무에서 정말 많이 쓰는 방식이에요.

```java
Creature creature = null;

creature = new Tiger();
creature.kind();
creature.breathe();

creature = new Salmon();
creature.kind();
creature.breathe();
```

실행 결과

```
포유류
허파
어류
아가미
```

같은 `creature.kind()` 인데 Tiger 가 들어오면 "포유류", Salmon 이 들어오면 "어류"가 나와요.

전체 코드: `code/InterfaceTest.java`

---

## 6. 상속 규칙 정리: 단일 상속과 다중 상속

강의 마지막 예제는 실행 없이 "어떤 상속이 되고 안 되는지"를 보여 줘요. 게임 용어로 만든 클래스와 인터페이스를 써요.

```java
class Unit {                       // 유닛: 체력과 좌표
    int currentHP;
    int x, y;
}

interface Movable {                // 움직일 수 있는 것
    void move(int x, int y);
}

interface Attackable {             // 공격할 수 있는 것
    void attack(Unit u);
}
```

### 규칙 1. 클래스는 부모 클래스를 하나만 (단일 상속)

```java
class Test extends Father, Korea { }   // 에러!
```

이클립스는 `Syntax error on token ",", . expected`, javac 는 `'{' expected` 라고 알려 줘요. 둘 다 "쉼표가 올 자리가 아니다"라는 뜻이에요.

**왜 막았을까?** (참고, 강의 밖 내용) 아빠 클래스와 엄마 클래스에 똑같은 이름의 메소드가 서로 다르게 들어 있으면, 자식은 어느 쪽을 물려받아야 할지 알 수 없어요. 이런 혼란을 막으려고 자바는 클래스 상속을 하나로 제한했어요.

### 규칙 2. 인터페이스끼리는 여러 개를 상속 (다중 상속)

```java
interface Fightable extends Movable, Attackable {
}
```

- 인터페이스가 인터페이스를 상속할 때는 `extends` 를 써요 (implements 아님).
- 쉼표로 여러 개를 이어도 에러가 안 나요. Fightable 은 `move` 와 `attack` 두 추상 메소드를 모두 갖게 돼요.
- 인터페이스는 내용이 비어 있는 이름표뿐이라, 이름이 겹쳐도 충돌할 "내용"이 없어서 허용돼요.

### 규칙 3. 클래스 하나 extends + 인터페이스 implements 동시에

```java
class Fight extends Unit implements Fightable {
    @Override
    public void move(int x, int y) {
        this.x = x;
        this.y = y;
        System.out.println("(" + x + ", " + y + ") 위치로 이동");
    }

    @Override
    public void attack(Unit u) {
        System.out.println("상대 유닛 공격! 상대 HP: " + u.currentHP);
    }
}
```

- `extends Unit` : 부모 클래스는 Unit 하나.
- `implements Fightable` : 인터페이스도 함께 구현해요. 순서는 **항상 extends 가 먼저, implements 가 나중**이에요.
- Fightable 이 물려받은 `move`, `attack` 을 둘 다 오버라이드해야 에러가 안 나요.
- 슬라이드처럼 `implements A, B` 로 인터페이스를 여러 개 구현하는 것(**다중 구현**)도 돼요.

강의에서는 메소드 안을 비워 두고 실행하지 않았는데, `code/InheritanceRules.java` 에서는 출력문을 채워서 실행해 볼 수 있게 했어요.

```java
Fight f = new Fight();
f.move(3, 5);

Unit enemy = new Unit();
enemy.currentHP = 100;
f.attack(enemy);
```

실행 결과 (앞부분)

```
(3, 5) 위치로 이동
상대 유닛 공격! 상대 HP: 100
```

---

## 7. 한눈에 비교: 일반 클래스 vs 추상 클래스 vs 인터페이스

| | 일반 클래스 | 추상 클래스 | 인터페이스 |
|---|---|---|---|
| 선언 | `class A` | `abstract class A` | `interface A` |
| 일반 메소드 | 가능 | 가능 | 불가 (강의 기준, 자바 8부터 `default` 는 가능) |
| 추상 메소드 | 불가 | 가능 | 가능 (`abstract` 생략 가능) |
| `new` 로 직접 객체 생성 | 가능 | 불가 | 불가 |
| 자식이 상속할 때 | `extends` | `extends` | `implements` |
| 몇 개까지 상속 | 1개 | 1개 | 여러 개 |
| 주된 역할 | 실제 객체 | 공통 기능 + 약속을 가진 부모 | 약속(기능 목록)만 정한 부모 |

> 참고(강의 밖 내용): 슬라이드는 "추상 메소드가 한 개라도 있으면 추상 클래스가 된다"고 하는데, 정확히는 "추상 클래스로 **선언해야 한다**"예요. 반대로 추상 메소드가 하나도 없어도 `abstract class` 로 선언할 수는 있어요. "이 클래스는 혼자서는 쓰지 말고 상속해서 써라"라는 뜻으로 쓰여요.

---

## 자주 하는 실수

에러 문구는 javac 21 로 직접 컴파일해서 확인한 것이에요. 이클립스 문구는 강의 화면에서 확인된 것만 적었어요.

| 증상 / 에러 메시지 | 원인 | 해결 |
|---|---|---|
| `Cannot instantiate the type Animal` (이클립스) / `Animal is abstract; cannot be instantiated` (javac) | 추상 클래스나 인터페이스를 `new` 했어요 | 자식 클래스로 객체를 만들고, 부모 타입 변수에 담아요 |
| `Elephant is not abstract and does not override abstract method disp() in Animal` | 추상 클래스를 상속(또는 인터페이스를 구현)하고 추상 메소드를 오버라이드하지 않았어요 | 추상 메소드를 **전부** 오버라이드해요 |
| `Animal is not abstract and does not override abstract method disp() in Animal` | 추상 메소드를 만들고 `class` 앞에 `abstract` 를 안 붙였어요 | `abstract class Animal` 로 고쳐요 |
| `abstract methods cannot have a body` | 추상 메소드에 `{ }` 를 붙였어요 | `abstract void disp();` 처럼 세미콜론으로 끝내요 |
| `interface abstract methods cannot have body` | 인터페이스 메소드에 본체를 넣었어요 | 본체를 지우고 세미콜론으로 끝내요 |
| `attempting to assign weaker access privileges; was public` | 인터페이스 메소드를 구현하면서 `public` 을 빼먹었어요 | `public void kind()` 처럼 `public` 을 붙여요 |
| `Syntax error on token ",", . expected` (이클립스) / `'{' expected` (javac) | `class Test extends Father, Korea` 처럼 클래스를 두 개 상속했어요 | 클래스는 하나만 extends 해요 |
| `no interface expected here` | 클래스가 인터페이스를 `extends` 했어요 | 클래스 → 인터페이스는 `implements` 를 써요 |
| `null` 을 `"null"` 로 씀 | `"null"` 은 글자 네 개짜리 문자열이에요 | 비어 있음을 뜻할 땐 따옴표 없이 `null` |

---

## 시간대별 목차

- [00:00] 강의 소개, 목표: 추상 메소드를 이해하고 구현해서 객체를 만들기
- [00:35] 이론: 추상 메소드(본체 없는 메소드)와 추상 클래스
- [01:08] 추상 클래스는 미완성이라 직접 객체 생성 불가, "미완성"으로 기억하기
- [02:30] 추상 클래스는 다형성으로 부모 역할을 주로 함
- [02:40] 이론: 인터페이스와 implements, abstract 생략 가능
- [04:16] implements 로 인터페이스 다중 구현 가능
- [04:51] 실습 1 준비: 패키지 oop20, Animal 추상 클래스 작성
- [06:29] `new Animal()` 에러 확인
- [06:55] Elephant extends Animal 에러, disp() 오버라이드로 해결
- [09:03] Elephant 객체로 view(), disp() 실행
- [09:22] Tuna 클래스로 한 번 더 연습
- [10:39] 추상 클래스의 다형성 (Animal 변수에 Elephant, Tuna 담기)
- [12:24] 실습 2: 인터페이스 Creature 만들기 (New → Interface)
- [13:16] 인터페이스에 일반 메소드는 에러, abstract 생략 가능
- [14:48] `new Creature()` 에러 확인
- [15:23] Tiger, Salmon implements Creature
- [17:00] 추상 메소드 kind(), breathe() 오버라이드로 에러 해결
- [19:31] 인터페이스의 다형성 실행 (포유류/허파, 어류/아가미)
- [21:13] 실습 3: Unit 클래스, Movable·Attackable 인터페이스
- [22:10] 클래스 다중 상속 에러 (extends Father, Korea)
- [23:17] 인터페이스끼리 다중 상속 (Fightable extends Movable, Attackable)
- [23:59] Fight extends Unit implements Fightable, 추상 메소드 오버라이드
- [25:53] 강의 정리

---

## 용어 정리

| 용어 | 쉬운 뜻 |
|---|---|
| 추상 메소드 (abstract method) | 본체 `{ }` 없이 이름과 모양만 있는 메소드. 자식이 내용을 채워야 함 |
| 추상 클래스 (abstract class) | `abstract` 가 붙은 미완성 클래스. 직접 `new` 불가, 부모 역할 |
| 인터페이스 (interface) | 추상 메소드 목록만 적어 둔 설계도. 직접 `new` 불가 |
| implements | "구현하다". 클래스가 인터페이스를 상속할 때 쓰는 키워드 |
| 구현 | 인터페이스의 빈 메소드를 실제 내용으로 채워 만드는 것 |
| 오버라이드 (override) | 물려받은 메소드를 자식이 다시 만드는 것 |
| `@Override` | "이건 오버라이드한 메소드예요"라는 표시. 잘못 쓰면 컴파일러가 알려 줌 |
| 다형성 (polymorphism) | 부모 타입 변수에 자식 객체를 담고, 실제 객체의 메소드가 실행되는 성질. 강의 속 "다양성"은 이 말 |
| 단일 상속 | 클래스는 부모 클래스를 하나만 가질 수 있다는 규칙 |
| 다중 상속 / 다중 구현 | 인터페이스는 여러 개를 동시에 상속(구현)할 수 있다는 것 |
| null | 참조 변수가 아무 객체도 가리키지 않는 "비어 있음" 상태 |
| 인스턴스화 (instantiate) | `new` 로 객체를 만드는 것. 에러 문구의 `cannot be instantiated` 는 "객체로 못 만든다" |
