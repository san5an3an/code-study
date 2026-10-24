# 15강. 상속과 메소드 오버라이드

## 이 강의에서 배우는 것

- **상속(inheritance)** 이 무엇인지, 왜 쓰는지 알아봐요. 이미 만든 클래스를 물려받아 다시 쓰는 방법이에요.
- `extends` 키워드로 부모 클래스를 지정하는 방법과, 물려받은 메소드를 자식 객체에서 부르는 방법을 익혀요.
- `private` 멤버는 물려받지 못하고, `final` 클래스는 상속할 수 없고, 자바 클래스는 **부모를 하나만** 가질 수 있다는 규칙을 배워요.
- 물려받은 메소드를 내 상황에 맞게 다시 쓰는 **메소드 오버라이드(override)** 와 `@Override` 표시를 배워요.
- `final` 메소드는 오버라이드할 수 없다는 것을 확인해요.

---

## 1. 상속이란?

12강에서 클래스는 "객체를 찍어 내는 설계도(붕어빵 틀)"라고 배웠어요. **상속** 은 이미 있는 설계도를 통째로 물려받고, 거기에 필요한 것만 **덧붙여서** 새 설계도를 만드는 방법이에요.

비유하면 이래요. 부모님이 쓰던 집(부모 클래스)을 물려받았어요. 방, 부엌, 화장실은 그대로 쓰고(물려받은 것), 내가 필요한 서재 하나만 새로 지어요(추가한 것). 집을 처음부터 다시 지을 필요가 없죠. 이게 상속의 핵심인 **자원의 재활용** 이에요.

### 부르는 이름이 여러 개예요

같은 뜻의 말이 많아서 처음엔 헷갈려요. 아래 묶음끼리는 같은 뜻이라고 보면 돼요.

| 물려주는 쪽 | 물려받는 쪽 |
|---|---|
| 부모 클래스 | 자식 클래스 |
| 조상 클래스 | 후손 클래스 |
| 슈퍼(super) 클래스 | 서브(sub) 클래스 |
| 상위 클래스 | 하위 클래스, 파생 클래스 |

### 상속받는 방법은 두 가지

- `extends` (확장): **클래스** 를 물려받을 때 써요. 이번 강의의 주인공이에요.
- `implements` (구현): **인터페이스** 를 물려받을 때 써요. 19강(추상클래스와 인터페이스)에서 배워요.

### 형식

```
class 자식클래스 extends 부모클래스 { }
```

`extends` **앞** 이 자식, **뒤** 가 부모예요. "자식이 부모를 확장한다"라고 읽으면 순서가 안 헷갈려요.

---

## 2. extends 로 물려받기 (AA, BB, CC 예제)

강의 슬라이드의 그림을 글로 옮기면 이래요.

```
 AA            BB               CC
one()   -->   (AA 것) +   -->   (BB 것) +
two()         three()           four()
```

- BB 는 AA 를 물려받고 `three()` 를 추가해요. 그래서 BB 로 쓸 수 있는 메소드는 `one, two, three` 3개예요.
- CC 는 BB 를 물려받고 `four()` 를 추가해요. BB 가 이미 AA 를 물려받은 상태라서, CC 는 `one, two, three, four` 4개를 다 쓸 수 있어요. 할아버지 것까지 대를 이어 내려오는 거예요.

### 코드로 확인하기

```java
class AA {
    private void zero() { }                 // private: AA 안에서만 사용
    public void one() { System.out.println("AA.one() 호출됨"); }
    public void two() { System.out.println("AA.two() 호출됨"); }
}

class BB extends AA {                       // BB 는 AA 의 자식
    public void three() { System.out.println("BB.three() 호출됨"); }
}

class CC extends BB {                       // CC 는 BB 의 자식 (AA 의 손자)
    public void four() { System.out.println("CC.four() 호출됨"); }
}
```

- `class BB extends AA` : BB 를 만들 때 AA 를 부모로 정해요. BB 안에는 `three()` 만 적었지만, AA 의 `one()`, `two()` 도 BB 것처럼 쓸 수 있어요.
- `class CC extends BB` : CC 의 부모는 BB 예요. 부모의 부모(AA) 것까지 물려받아요.

`main` 에서 객체를 만들어 불러 봐요. (객체 만들기 `new` 는 12강 복습)

```java
CC cc = new CC();   // CC 객체 생성
cc.four();          // CC 자기 메소드
cc.three();         // BB 에게 물려받음
cc.one();           // BB 를 거쳐 AA 에게 물려받음
cc.two();
```

실행 결과

```
CC.four() 호출됨
BB.three() 호출됨
AA.one() 호출됨
AA.two() 호출됨
```

`cc.one()` 처럼 점(`.`) 다음에 이름을 쓰면 "cc 가 가리키는 객체의 one 메소드"라는 뜻이에요. 점은 "~안에 있는"이라는 소속을 나타내요. 이클립스에서 `cc.` 까지 치고 Ctrl+Space 를 누르면 CC 가 쓸 수 있는 메소드 목록에 one, two, three, four 가 모두 보여요.

전체 코드는 `code/Inheritance.java` 에 있어요.

### 왜 상속을 쓰나요?

- 이미 잘 만들어진 코드를 **다시 쓰지 않고** 물려받아요. 코드 양이 줄어요.
- 부모 클래스를 고치면 자식 클래스 전부에 반영돼요.
- 자식은 **자기에게 필요한 것만** 추가하면 돼요. 그래서 `extends` 라는 이름에 "확장"이라는 뜻이 담겨 있어요.

---

## 3. private 은 물려받지 못해요

AA 에는 `private void zero()` 가 있었어요. `private` 은 "이 클래스 안에서만 쓸 수 있다"는 표시예요.

```java
AA aa = new AA();
// aa.zero();   // 에러: AA 객체로도 바깥(main)에서는 못 불러요

BB bb = new BB();
// bb.zero();   // 에러: 자식에게 물려주지도 않아요
```

- 강의에서 `bb.` 다음에 Ctrl+Space 를 아무리 눌러도 `zero` 는 목록에 안 나와요.
- 비유하면 부모님의 **일기장** 이에요. 집은 물려받아도 일기장은 물려받지 않아요.

javac 로 직접 컴파일해 보면 두 줄에서 각각 이런 에러가 나요.

```
error: zero() has private access in AA      (aa.zero() 줄)
error: cannot find symbol                   (bb.zero() 줄)
```

---

## 4. final 클래스는 상속할 수 없어요

클래스 앞에 `final` 을 붙이면 "여기서 끝"이라는 뜻이에요. 이런 클래스를 **종단 클래스** 라고도 해요. 더 이상 자식을 가질 수 없어요.

```java
final class AA { }
class BB extends AA { }   // 에러!
```

javac 에러 메시지

```
error: cannot inherit from final AA
```

14강에서 `final` 변수는 값을 못 바꾸는 상수라고 배웠죠. `final` 은 어디에 붙든 "더 이상 바꾸지 못한다"는 뜻이에요.

| final 이 붙는 곳 | 의미 |
|---|---|
| 변수 | 값을 바꿀 수 없어요 (상수) |
| 클래스 | 상속할 수 없어요 (자식 금지) |
| 메소드 | 오버라이드할 수 없어요 (6장에서 봐요) |

참고(강의 밖 내용): 자바가 기본으로 주는 `String` 클래스(13강)도 `final` 클래스라서 `class MyString extends String` 은 안 돼요.

---

## 5. 클래스는 부모를 하나만 (다중 상속 불가)

강의에서 가장 강조한 규칙이에요.

```java
class DD { }
class EE extends AA, DD { }   // 에러! 부모를 두 개 쓸 수 없어요
```

쉼표로 부모를 둘 이상 적으면 에러예요. 자바의 클래스는 **단일 상속** 만 돼요. 사람에게 친아버지가 한 명인 것처럼, 클래스도 바로 위 부모는 딱 하나예요. (대신 할아버지, 증조할아버지처럼 **위로 줄줄이** 이어지는 건 괜찮아요. AA-BB-CC 가 그 예예요.)

javac 로 컴파일해 보면 쉼표 위치에서 이런 에러가 나요.

```
error: '{' expected
```

"extends 다음엔 부모 하나만 오고 바로 `{` 가 와야 하는데 쉼표가 왔다"는 뜻이에요. 메시지에 "다중 상속" 같은 말이 없어서 처음엔 알아보기 어려우니 기억해 두세요.

참고(강의 밖 내용): 왜 막았을까요? AA 와 DD 에 똑같은 이름의 메소드가 있으면 EE 는 누구 것을 써야 할지 정할 수 없어요. 이런 혼란을 막으려고 자바는 클래스 다중 상속을 금지했어요. 여러 개를 물려받고 싶으면 인터페이스(19강)를 써요.

---

## 6. 메소드 오버라이드 (재정의, 리폼)

**메소드 오버라이드(method override)** 는 부모에게 물려받은 메소드를 자식 클래스에서 **내용만 새로 써서** 쓰는 거예요. 강사는 이걸 **리폼** 에 비유해요. 물려받은 옷을 내 몸에 맞게 고쳐 입는 것처럼, 물려받은 메소드를 내 클래스에 맞게 고치는 거예요.

### 규칙

- **바꾸는 건 내용(중괄호 안)뿐** 이에요.
- 메소드 **이름, 매개변수(인자), 리턴형** 은 부모와 똑같이 써야 해요.
- `final` 메소드는 오버라이드할 수 없어요.

11강의 **오버로드(overload)** 와 이름이 비슷해서 많이 헷갈려요.

| | 오버로드 (11강) | 오버라이드 (15강) |
|---|---|---|
| 어디서 | 같은 클래스 안 | 부모와 자식 사이 |
| 이름 | 같음 | 같음 |
| 매개변수 | **달라야** 함 | **같아야** 함 |
| 목적 | 같은 이름으로 여러 버전 만들기 | 물려받은 것 고쳐 쓰기 |

### 예제: School, MiddleSchool, HighSchool

```java
class School {
    public String name = "학교";

    public final void view() {                       // final: 오버라이드 금지
        System.out.println("School.view() 호출됨");
    }

    public void disp() {                             // 오버라이드 가능
        System.out.println("School.disp() 호출됨");
    }
}

class MiddleSchool extends School {
    // 아무것도 고치지 않음
}

class HighSchool extends School {
    String name = "고등학교";

    @Override
    public void disp() {                             // 물려받은 disp() 를 다시 작성
        System.out.println("HighSchool.disp() 호출됨");
    }
}
```

- `MiddleSchool` 은 비어 있어요. 그래도 School 의 `name`, `view()`, `disp()` 를 전부 물려받아요.
- `HighSchool` 은 `disp()` 를 **같은 이름, 같은 모양** 으로 다시 썼어요. 이게 오버라이드예요.
- `@Override` 는 아래 7장에서 설명해요.

main 에서 비교해 봐요.

```java
MiddleSchool ms = new MiddleSchool();
System.out.println(ms.name);
ms.view();
ms.disp();

System.out.println("------------------");

HighSchool hs = new HighSchool();
System.out.println(hs.name);
hs.view();
hs.disp();
```

실행 결과

```
학교
School.view() 호출됨
School.disp() 호출됨
------------------
고등학교
School.view() 호출됨
HighSchool.disp() 호출됨
```

- 오버라이드를 **안 한** MiddleSchool 은 부모 것이 그대로 나와요.
- 오버라이드를 **한** HighSchool 은 `disp()` 를 부르면 **자기가 고친 버전** 이 실행돼요. 부모 버전은 가려져서 안 나와요.
- `view()` 는 final 이라 고칠 수 없으니, HighSchool 에서도 부모 것이 그대로 나와요.

전체 코드는 `code/MethodOverride.java` 에 있어요.

### final 메소드를 오버라이드하려고 하면

```java
class HighSchool extends School {
    @Override
    public void view() { }   // 에러!
}
```

javac 에러 메시지

```
error: view() in HighSchool cannot override view() in School
  overridden method is final
```

**강의와 다른 점**: 강의 [22:02]~[22:32] 에서 "view 가 목록에 안 보이니 강제로 불러다 쓸 수 없다"고 말하는데, 이건 **오버라이드(다시 쓰기) 목록** 에 안 나온다는 뜻이에요. final 메소드를 **호출** 하는 건 얼마든지 돼요. 실제로 바로 뒤에서 `hs.view();` 를 불러서 `School.view() 호출됨` 이 잘 나와요. final 메소드는 "고칠 수 없다"이지 "쓸 수 없다"가 아니에요.

### 강의와 다른 점: 변수는 오버라이드되지 않아요

강의에서는 HighSchool 에 `String name = "고등학교";` 를 넣고 "이름을 바꿨다"고 설명해요. 결과로 `hs.name` 이 "고등학교"로 나오는 건 맞아요. 하지만 이건 오버라이드가 아니라 **같은 이름의 변수를 하나 더 만들어 부모 것을 가린 것** 이에요(이걸 "필드 숨기기"라고 해요). 오버라이드는 **메소드** 에만 있어요.

차이는 부모 자료형 변수에 자식 객체를 담으면 드러나요. (이 문법은 18강 "다형성"에서 자세히 배우니 지금은 결과만 보세요.)

```java
School s = new HighSchool();   // 부모 자료형 변수에 자식 객체를 담음
System.out.println(s.name);    // 변수: 변수 자료형(School) 기준
s.disp();                      // 메소드: 실제 객체(HighSchool) 기준
```

실행 결과

```
학교
HighSchool.disp()
```

메소드는 오버라이드된 버전(HighSchool)이 나오지만, 변수는 부모 것("학교")이 나와요. 그래서 부모 값을 바꾸고 싶을 땐 변수를 새로 선언하지 말고 값만 대입하는 게 좋아요. (`code/OverrideAnimal.java` 의 `dog.kind = "강아지";` 처럼)

---

## 7. @Override 어노테이션

`@` 로 시작하는 `@Override` 같은 표시를 **어노테이션(annotation)** 이라고 해요. 강사는 "명령어라고 생각하면 된다"고 했는데, 좀 더 정확히 말하면 **컴파일러에게 주는 메모** 예요.

`@Override` 는 "이 메소드는 부모 메소드를 재정의한 거니까 진짜 그런지 확인해 줘"라는 뜻이에요. 프로그램 동작을 바꾸지는 않지만, 실수를 잡아 줘요.

```java
class HighSchool extends School {
    @Override
    public void dsip() { }   // disp 를 dsip 으로 오타!
}
```

javac 에러 메시지

```
error: method does not override or implement a method from a supertype
```

`@Override` 가 없으면 이 코드는 에러 없이 컴파일돼요. 자바는 그냥 "dsip 이라는 새 메소드를 추가했구나"라고 생각하거든요. 그러면 `hs.disp()` 를 불렀을 때 부모 버전이 나와서 "왜 내가 고친 게 안 나오지?" 하고 한참 헤매게 돼요. **오버라이드할 때는 항상 `@Override` 를 붙이는 습관** 을 들이세요.

참고(강의 밖 내용): 이클립스에서 자식 클래스 안에 메소드 이름 일부를 치고 Ctrl+Space 를 누르면 부모 메소드 목록이 나오고, 고르면 `@Override` 까지 자동으로 써 줘요. 강의 [20:53] 에서 강사가 쓴 방법이에요.

---

## 8. 한 번 더: 상속 + 오버라이드를 같이 쓰는 이유 (참고, 강의 밖 예제)

```java
class Animal {
    String kind = "동물";
    public void eat()   { System.out.println(kind + "이(가) 밥을 먹어요"); }  // 공통
    public void sound() { System.out.println("..."); }                       // 동물마다 다름
}

class Dog extends Animal {
    @Override
    public void sound() { System.out.println("멍멍"); }
}

class Cat extends Animal {
    @Override
    public void sound() { System.out.println("야옹"); }
}
```

- `eat()` 은 모든 동물이 똑같으니 부모에 한 번만 쓰고 **물려받아** 써요.
- `sound()` 는 동물마다 다르니 각자 **오버라이드** 해요.

```java
Dog dog = new Dog();
dog.kind = "강아지";
dog.eat();
dog.sound();
```

실행 결과

```
강아지이(가) 밥을 먹어요
멍멍
```

공통은 물려받고, 다른 것만 고친다. 이게 상속과 오버라이드를 같이 쓰는 이유예요. 전체 코드는 `code/OverrideAnimal.java` 에 있어요.

---

## 자주 하는 실수

모든 javac 메시지는 openjdk 21 로 직접 컴파일해서 확인했어요.

| 증상 / 에러 메시지 | 원인 | 해결 |
|---|---|---|
| `cannot inherit from final AA` | `final` 클래스를 extends 했어요 | 부모 클래스에서 `final` 을 빼거나, 다른 클래스를 부모로 써요 |
| `'{' expected` (extends 줄의 쉼표 위치) | `extends AA, DD` 처럼 부모를 두 개 썼어요 | 클래스는 부모 하나만. 꼭 필요하면 AA-BB-CC 처럼 줄줄이 잇거나 인터페이스(19강)를 써요 |
| `zero() has private access in AA` | private 메소드를 클래스 바깥에서 불렀어요 | private 은 그 클래스 안에서만 써요. 밖에서 써야 하면 public 으로 바꿔요 |
| `cannot find symbol` ... `method zero()` / `location: variable bb of type BB` | 자식 객체로 부모의 private 메소드를 불렀어요 | private 은 상속되지 않아요 |
| `view() in HighSchool cannot override view() in School` / `overridden method is final` | final 메소드를 오버라이드하려 했어요 | final 메소드는 그대로 써요. 고쳐야 하면 부모에서 final 을 빼요 |
| `method does not override or implement a method from a supertype` | `@Override` 를 붙였는데 이름이나 매개변수가 부모와 달라요 (오타 등) | 부모 메소드와 이름, 매개변수를 똑같이 맞춰요 |
| `disp() in HighSchool cannot override disp() in School` / `attempting to assign weaker access privileges; was public` | 부모는 `public void disp()` 인데 자식에서 `public` 을 빼고 `void disp()` 로 썼어요 | 오버라이드할 때 접근 범위를 좁힐 수 없어요. 부모와 똑같이 `public` 을 붙여요 |
| 에러는 없는데 내가 고친 메소드가 안 불리고 부모 것이 나와요 | `@Override` 없이 이름을 잘못 써서 새 메소드가 따로 생겼어요 | 항상 `@Override` 를 붙여서 컴파일러가 잡게 해요 |
| 이클립스: `The type BB cannot subclass the final class AA` 등 | 위 javac 에러의 이클립스 표현이에요 (이클립스 문구는 직접 확인하지 못했어요) | 위와 같아요 |

---

## 시간대별 목차

- [00:00] 강의 소개: extends 와 메소드 오버라이드
- [00:30] 상속의 개념: 자원의 재활용, 부모/조상/super, 자식/후손/sub
- [01:01] 상속받는 두 방법: extends(확장), implements(구현)
- [01:20] 형식: class 자식클래스 extends 부모클래스
- [01:46] 그림 설명: AA -> BB -> CC, 쓸 수 있는 메소드 개수
- [03:51] DD, EE 그림: 클래스는 다중 상속 불가
- [04:54] 메소드 오버라이드 개념: 재정의, 리폼
- [05:35] 내용만 바꾸고 이름/인자/반환형은 그대로, final 메소드는 오버라이드 불가
- [06:53] @Override 어노테이션 소개
- [07:12] 실습 1 시작: Test01_sangsok
- [08:18] final class AA 는 상속 불가 (에러 확인)
- [08:47] AA 클래스: private zero(), one(), two()
- [10:02] private 메소드는 클래스 내부에서만 접근 가능
- [10:34] BB extends AA, three() 추가
- [12:05] BB 객체로 three(), one(), two() 호출
- [13:02] private zero() 는 상속되지 않음
- [13:21] CC extends BB, four() 추가 후 4개 메소드 호출
- [15:18] EE extends AA, DD 시도 -> 에러, 단일 상속만 가능
- [17:03] 실습 2 시작: Test02_override, School 클래스 (name, final view(), disp())
- [17:55] MiddleSchool, HighSchool 이 School 을 상속
- [19:20] 오버라이드 전: MiddleSchool 은 부모 것 그대로 출력
- [20:40] 오버라이드 후: HighSchool 에서 name 변경, disp() 재정의, @Override
- [21:54] final 메소드 view() 는 오버라이드 불가
- [22:42] HighSchool 객체로 결과 확인 (고등학교, School.view(), HighSchool.disp())
- [24:10] 정리하기

---

## 용어 정리

| 용어 | 쉬운 뜻 |
|---|---|
| 상속 (inheritance) | 이미 있는 클래스의 내용을 물려받아 새 클래스를 만드는 것 |
| 부모 클래스 (super class) | 물려주는 클래스. 조상, 상위 클래스라고도 해요 |
| 자식 클래스 (sub class) | 물려받는 클래스. 후손, 하위, 파생 클래스라고도 해요 |
| extends | "확장한다". 클래스를 상속받을 때 쓰는 키워드 |
| implements | "구현한다". 인터페이스를 상속받을 때 쓰는 키워드 (19강) |
| 단일 상속 | 클래스는 바로 위 부모를 하나만 가질 수 있다는 규칙 |
| 다중 상속 | 부모를 여러 개 두는 것. 자바 클래스는 안 돼요 |
| private | 그 클래스 안에서만 쓸 수 있다는 표시. 상속되지 않아요 |
| final 클래스 (종단 클래스) | 더 이상 자식을 가질 수 없는 클래스 |
| final 메소드 | 자식이 오버라이드할 수 없는 메소드. 호출은 가능해요 |
| 메소드 오버라이드 (override) | 물려받은 메소드의 내용을 자식 클래스에서 다시 쓰는 것 (재정의, 리폼) |
| 메소드 오버로드 (overload) | 같은 클래스 안에서 이름은 같고 매개변수가 다른 메소드를 여러 개 만드는 것 (11강) |
| 어노테이션 (annotation) | `@` 로 시작하는 표시. 컴파일러 등에게 주는 메모 |
| @Override | "부모 메소드를 재정의한 것이 맞는지 확인해 줘"라는 어노테이션 |
| 필드 숨기기 | 자식이 부모와 같은 이름의 변수를 새로 만들어 부모 변수를 가리는 것. 오버라이드와 달라요 |
