# 18강. Object 클래스와 super 및 다형성

## 이 강의에서 배우는 것

- 자바의 모든 클래스가 물려받는 최고 조상 **Object 클래스**와, 거기서 물려받는 `toString()` 메소드를 알아봐요.
- 자식 클래스가 부모를 가리킬 때 쓰는 **`super`**(부모의 멤버에 접근)와 **`super()`**(부모 생성자 호출)의 차이를 익혀요.
- 상속 관계에서는 객체를 만들 때 **부모 생성자가 먼저** 실행된다는 걸 눈으로 확인해요.
- `부모타입 변수 = new 자식()` 처럼 쓰는 **다형성(polymorphism)** 을 배우고, 이때 무엇이 되고 무엇이 안 되는지 정리해요.

> **강의 제목에 대해**: 영상 파일 제목은 "다양성"이지만, 강의 슬라이드에는 "다형성(Polymorphism)"이라고 적혀 있어요. 받아쓰기에서도 강사는 계속 "다형성"이라고 말해요(한 번 "다양성"이라고 말실수한 곳이 있어요). 올바른 용어는 **다형성(多形性, 형태가 여러 가지라는 뜻)** 이에요. 이 노트에서는 "다형성"으로 통일해요.

---

## 0. 잠깐 복습: 상속과 오버라이드

15강에서 배운 내용을 한 줄씩만 떠올려 봐요.

- `class 자식 extends 부모` : 부모의 변수와 메소드를 **물려받아요(상속)**.
- **오버라이드(override)** : 물려받은 메소드를 자식이 자기에게 맞게 **다시 작성**하는 것. 위에 `@Override` 를 붙여 두면 컴파일러가 "정말 부모에 있는 메소드를 다시 쓴 게 맞는지" 검사해 줘요.
- `this` : "나 자신(이 객체)". `this.name` 은 내 멤버변수(17강).

이번 강의는 여기에 **"그럼 부모를 가리킬 땐?"(super)**, **"부모의 부모의 ... 맨 꼭대기는?"(Object)**, **"부모 타입 변수에 자식을 넣으면?"(다형성)** 을 더하는 강의예요.

---

## 1. Object 클래스: 자바의 최고 조상

### Object 가 뭐예요?

`Object` 는 자바에 미리 만들어져 있는 클래스이고, **모든 클래스의 맨 꼭대기 부모**예요. `java.lang` 패키지에 들어 있어서 `import` 없이 바로 쓸 수 있어요.

비유하면 족보의 **시조(맨 처음 조상)** 예요. 누구의 족보를 따라 올라가도 결국 같은 시조에 닿아요.

- `GregorianCalendar` 의 부모는 `Calendar`, `Calendar` 의 부모는 `Object`
- `String` 의 부모도 `Object`, `System` 의 부모도 `Object`

그래서 **"자바의 모든 클래스는 Object 클래스의 후손이다"** 는 맞는 말이에요.

### extends Object 는 자동으로 붙어요

`extends` 로 부모를 정하지 않은 클래스는 자바가 알아서 `extends Object` 를 붙여 줘요. 우리가 고를 수 있는 게 아니에요.

```java
class Korea extends Object {   // 이렇게 써도 되고
}
class Korea {                  // 이렇게 생략해도 완전히 같은 뜻이에요
}
```

지금까지 만든 `public class Test {...}` 같은 클래스들도 사실 전부 `extends Object` 가 생략되어 있었던 거예요.

### 그럼 Object 에서 뭘 물려받나요? → toString()

강의에서 `Korea` 를 상속한 `Seoul` 클래스 안에서 이클립스의 자동완성(Ctrl+Space)을 눌러 보니, `Korea` 에는 없는 **`toString()`** 이라는 메소드가 목록에 떠요. `Korea` 에 없는데 보인다는 건, `Korea` 의 부모인 **Object 에서 물려받은 것**이라는 뜻이에요.

`toString()` 은 "이 객체를 **문자열로 표현**하면 어떻게 되나"를 돌려주는 메소드예요. 리턴형이 `String` 이에요.

```java
class Korea {
    String name = "대한민국";

    public void disp() {
        System.out.println(this.name);
    }
}

class Seoul extends Korea {
    String name = "서울특별시";

    @Override
    public void disp() {                 // Korea 에게 물려받은 disp() 를 다시 작성
        System.out.println("Seoul " + name);
    }

    @Override
    public String toString() {           // Object 에게 물려받은 toString() 을 다시 작성
        return "[name=" + name + "]";
    }
}
```

- `@Override public String toString()` : Object 의 `toString()` 을 내 입맛대로 다시 써요. 무엇을 돌려줄지는 자유예요. 여기서는 name 값을 보여 주게 만들었어요.

```java
Seoul seoul = new Seoul();
seoul.disp();
System.out.println(seoul.toString());
```

실행 결과

```
Seoul 서울특별시
[name=서울특별시]
```

### 이클립스로 toString(), 생성자, getter/setter 자동 만들기

`Busan` 클래스에서는 멤버변수를 `private`(클래스 밖에서 직접 못 건드리게 잠금)으로 두고, 이클립스 **Source 메뉴**의 도움을 받아 코드를 자동으로 만들어요.

- `Source > Generate Constructor using Fields...` : 생성자 만들기 (강의에서는 기본 생성자를 만들었어요)
- `Source > Generate Getters and Setters...` : getter/setter 한 쌍 만들기
- `Source > Generate toString()...` : 변수 값을 보여 주는 toString() 만들기

```java
class Busan extends Korea {
    private String name = "부산광역시";
    private String addr = "경상남도";

    public Busan() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    // getAddr(), setAddr() 도 같은 모양

    @Override
    public String toString() {
        return "Busan [name=" + name + ", addr=" + addr + "]";
    }
}
```

**왜 toString() 을 만들어 둘까요?** private 변수는 밖에서 바로 볼 수 없잖아요. 그런데 코딩하다 보면 "지금 이 객체 안에 어떤 값이 들어 있지?"를 확인할 일이 아주 많아요. toString() 을 만들어 두면 한 줄로 내부 값을 다 볼 수 있어서, 개발자들이 **에러를 찾을 때(디버깅)** 많이 써요. 꼭 만들어야 하는 건 아니에요.

**참고(강의 밖 내용)**: `System.out.println(busan);` 처럼 객체를 그냥 출력해도 자바가 알아서 `busan.toString()` 을 불러 줘요. 그리고 toString() 을 오버라이드하지 않은 클래스를 출력하면 Object 가 만든 기본 모양, 즉 `Korea@1b6d3586` 같은 "클래스이름@알 수 없는 숫자"가 나와요(숫자는 실행할 때마다 달라질 수 있어요).

#### 함정 하나 (강의 밖 내용, 실행해서 확인)

`Busan` 은 `disp()` 를 다시 쓰지 않았어요. 그래서 `busan.disp()` 를 부르면 **Korea 의 disp()** 가 실행되고, 그 안의 `this.name` 은 **Korea 쪽 name** 을 가리켜요.

```java
Busan busan = new Busan();
busan.disp();
System.out.println(busan.toString());
```

실행 결과

```
대한민국
Busan [name=부산광역시, addr=경상남도]
```

"부산광역시"가 아니라 "대한민국"이 나와요. **메소드는 오버라이드되지만, 변수는 오버라이드되지 않아요.** 자식이 부모와 같은 이름의 변수를 또 만들면 변수가 두 개 생기고(부모 것, 자식 것), 부모 클래스 안의 코드는 여전히 부모 것을 봐요. 강의에서는 Seoul 의 `String name = "서울특별시";` 도 "재정의"라고 부르는데, 정확히는 **메소드 오버라이드와는 다른 일(같은 이름의 변수를 하나 더 만든 것)** 이에요. 이런 혼란 때문에 실무에서는 부모와 같은 이름의 변수를 자식에 또 만드는 걸 피해요.

---

## 2. super 와 super()

자바에서 **"부모"를 가리키는 말이 `super`** 예요. `this` 가 "나", `super` 가 "내 부모"라고 짝지어 기억하면 쉬워요.

| 쓰는 모양 | 뜻 | 짝꿍(17강) |
|---|---|---|
| `super.이름` | 자식 클래스 안에서 **부모의 멤버**(변수, 메소드)에 접근 | `this.이름` |
| `super(...)` | 자식 생성자 안에서 **부모의 생성자**를 호출 | `this(...)` |

### 2-1. 부모 생성자가 먼저 실행돼요

```java
class School {
    public String name = "학교";
    public School() {
        System.out.println("School()...");
    }
}

class MiddleSchool extends School {
    public String name = "중학교";
    public MiddleSchool() {
        super();   // 부모 생성자 호출. 생략해도 자바가 자동으로 넣어 줘요
        System.out.println("MiddleSchool()...");
    }
}
```

```java
MiddleSchool ms = new MiddleSchool();
```

실행 결과

```
School()...
MiddleSchool()...
```

`new MiddleSchool()` 만 했는데 `School()...` 이 **먼저** 찍혀요.

**왜 그럴까요?** 자식은 부모가 있어야 존재할 수 있잖아요. 자식 객체 안에는 부모에게 물려받은 부분이 들어 있어서, 그 부분을 먼저 준비(부모 생성자 실행)한 다음 자식 부분을 준비해요. 집을 지을 때 **1층(부모)을 먼저 올리고 2층(자식)을 올리는 것**과 같아요.

자식 생성자 첫 줄에 `super();` 를 쓰지 않으면 자바가 몰래 `super();` 를 넣어 줘요. 그래서 강의의 `HighSchool` 처럼 안 써도 결과는 같아요.

```
School()...
HighSchool()...
```

**참고(강의 밖 내용)**: `super(...)` 는 반드시 생성자의 **첫 줄**에 있어야 해요. 다른 문장 뒤에 쓰면 컴파일 에러가 나요(아래 "자주 하는 실수" 참고).

### 2-2. name, this.name, super.name

```java
public void disp() {                    // MiddleSchool 안의 메소드
    String name = "서울중학교";          // 지역변수
    System.out.println(name);           // 가장 가까운 것 = 지역변수
    System.out.println(this.name);      // 나(MiddleSchool)의 멤버변수
    System.out.println(super.name);     // 부모(School)의 멤버변수
}
```

```java
ms.disp();
```

실행 결과

```
서울중학교
중학교
학교
```

이름이 같은 변수가 세 개나 있어도, 앞에 붙이는 말로 골라 쓸 수 있어요.

- 아무것도 안 붙이면 → 가장 가까운 변수(지역변수가 있으면 그것)
- `this.` → 내 클래스의 멤버변수
- `super.` → 부모 클래스의 멤버변수

### 2-3. super(값, 값): 부모 생성자에 값 넘기기

부모에 매개변수가 있는 생성자가 있으면, 자식이 값을 받아 그대로 부모에게 넘길 수 있어요.

```java
class Father {
    public String name = "아버지";
    public String addr = "주소";

    public Father() {}
    public Father(String name, String addr) {
        this.name = name;
        this.addr = addr;
    }
}

class Son extends Father {
    public Son() {}
    public Son(String n, String a) {
        super(n, a);   // Father(String, String) 생성자를 불러서 name, addr 을 채워요
    }
}
```

`Son` 클래스에는 `name`, `addr` 이 눈에 안 보이지만, 부모에게 물려받아서 **살아 있어요.** 그 값을 채우는 일은 부모 생성자에게 맡기는 거예요. "내가 직접 다 하지 말고 부모님이 원래 하던 방식대로 해 주세요"라는 뜻이에요.

---

## 3. 다형성(Polymorphism)

### 3-1. 다형성이 뭐예요?

**다형성 = 형태가 여러 가지**라는 뜻이에요. 핵심 문장은 하나예요.

> **부모 타입 변수에는 자식 객체를 넣을 수 있다.** (`부모 = 자식`)

```java
Father father = new Son("손흥민", "영국");
```

`=` 를 기준으로 왼쪽은 `Father`, 오른쪽은 `Son` 이에요. 지금까지는 `Son s = new Son();` 처럼 양쪽이 같았는데, **오른쪽이 왼쪽의 자식이면** 달라도 문법 에러가 아니에요.

**비유**: "동물" 이라고 적힌 케이지에는 강아지도, 고양이도 넣을 수 있어요. 강아지도 동물이니까요. 하지만 "강아지" 케이지에 아무 동물이나 넣을 수는 없어요. 이처럼 `Son` 은 `Father` 의 한 종류이니 Father 변수에 들어갈 수 있지만, 반대(`Son s = new Father();`)는 안 돼요.

"형태가 여러 가지"는 **부모 입장**에서 보는 말이에요. Father 변수 하나에 Son 이 들어올 수도, Daughter 가 들어올 수도 있으니 담기는 모양이 여러 가지라는 거예요.

### 3-2. 이미 본 적 있는 다형성: Calendar

16강에서 본 이 코드가 바로 다형성이에요.

```java
Calendar cal = new GregorianCalendar();
System.out.println(cal.get(Calendar.YEAR));
System.out.println(cal.get(Calendar.MONTH));
System.out.println(cal.get(Calendar.DATE));
```

`GregorianCalendar` 가 `Calendar` 의 자식이라서 이렇게 쓸 수 있어요.

실행 결과 (실행 시점에 따라 달라짐. 아래는 2026년 10월 18일에 실행한 결과)

```
2026
9
18
```

`Calendar.MONTH` 는 **0부터 시작**(1월=0)해서 10월이 `9` 로 나와요. 강의 화면에서도 2023년 1월 22일에 실행해 `0` 이 나왔어요. (자세한 건 16강)

### 3-3. Father 예제 따라가기

```java
Father fa = new Father();
fa.disp();                                  // 아버지 / 주소

Father father = new Son("손흥민", "영국");    // 부모 변수 = 자식 객체
father.disp();                              // 손흥민 / 영국

father = new Daughter("김연아", "한국");      // 같은 변수에 다른 자식
father.disp();                              // 김연아 / 한국

System.out.println(father.name);
System.out.println(father.addr);
```

(`disp()` 는 Father 에 있는, name 과 addr 을 한 줄씩 찍는 메소드예요.)

실행 결과

```
아버지
주소
손흥민
영국
김연아
한국
김연아
한국
```

#### 강의와 다른 점: "부모가 자식 모양으로 자기를 바꾼다"?

강사는 이 결과를 "부모는 자식의 모양으로 본인 스스로의 모습을 바꾼다"고 설명해요. 느낌을 전하려는 표현이지만, 그대로 믿으면 오해하기 쉬워요. 실제로 일어나는 일은 이래요.

1. `new Son("손흥민", "영국")` : **Son 객체**가 하나 만들어져요. Son 생성자가 `super(n, a)` 로 부모 생성자를 불러서 이 객체의 name 을 "손흥민", addr 을 "영국"으로 채워요.
2. `Father father = ...` : 그 Son 객체를 **Father 타입 변수로 가리킬** 뿐이에요. Father 클래스나 다른 Father 객체(`fa`)가 바뀌는 건 전혀 없어요. 위 결과에서도 `fa` 는 여전히 "아버지"예요.
3. `father.disp()` : 지금 가리키는 객체의 name, addr 이 손흥민, 영국이니 그게 찍혀요.

즉 **변하는 건 "변수가 가리키는 객체"이지, 부모 클래스가 아니에요.** 리모컨(변수)은 "Father용 리모컨"인데, 지금 연결된 기계(객체)가 Son 인 거예요. 강의에서 이름과 주소를 안 넘겼을 때(`new Son()`) "아버지/주소"가 그대로 나왔던 것도, Son 의 기본 생성자가 값을 바꾸지 않아서 물려받은 기본값이 남았기 때문이에요.

### 3-4. 다형성으로는 자식만의 멤버가 안 보여요

```java
class Daughter extends Father {
    String friend = "절친";        // Daughter 에만 새로 생긴 변수
    ...
}
```

```java
Father father = new Daughter("김연아", "한국");
System.out.println(father.friend);   // 컴파일 에러!
```

실제 javac 에러 (직접 확인)

```
error: cannot find symbol
  symbol:   variable friend
```

**왜 안 될까요?** 컴파일러는 **변수의 타입(Father)** 만 보고 "이 변수로 무엇을 쓸 수 있나"를 판단해요. Father 클래스에는 friend 가 없으니 쓸 수 없다고 막아요. "Father용 리모컨"에는 friend 버튼이 아예 없는 셈이에요. 부모에게 물려받은 멤버(name, addr, disp)만 쓸 수 있어요. 강의에서도 "자식이 부모 집에 들어간다고 무조건 다 되는 건 아니다"라고 정리해요.

### 3-5. 그럼 다형성은 왜 쓰나요? (참고: 강의 밖 내용)

강의는 "다형성이 클래스들 사이의 형변환 작업을 쉽게 해 준다"고만 짧게 말하고 넘어가요. 다형성이 진짜 빛나는 순간은 **자식이 메소드를 오버라이드했을 때**예요.

```java
class Animal { public void sound() { System.out.println("..."); } }
class Dog extends Animal { @Override public void sound() { System.out.println("멍멍"); } }
class Cat extends Animal { @Override public void sound() { System.out.println("야옹"); } }

Animal[] animals = { new Animal(), new Dog(), new Cat() };
for (Animal a : animals) {
    a.sound();
}
```

실행 결과

```
...
멍멍
야옹
```

변수 타입은 모두 `Animal` 인데, **실제 객체가 오버라이드한 메소드**가 실행돼요. 덕분에 동물이 몇 종류로 늘어나든 `a.sound()` 한 줄로 처리할 수 있어요. 정리하면:

- **무엇을 부를 수 있는지**는 변수 타입(Animal)이 정해요. → `a.fetch()` 처럼 Dog 에만 있는 메소드는 못 불러요.
- **실제로 어떤 코드가 실행되는지**는 객체(Dog, Cat)가 정해요. → 오버라이드한 메소드가 실행돼요.

자식만의 기능을 꼭 써야 하면, 진짜 그 자식일 때 **형변환**해서 써요.

```java
Animal pet = new Dog();
Dog dog = (Dog) pet;   // pet 이 진짜 Dog 라서 가능
dog.fetch();           // 공을 물어 와요
```

진짜가 아닌 타입으로 형변환하면 실행 중에 `ClassCastException` 이 나요(아래 표 참고). 이 부분은 19강(추상클래스, 인터페이스)에서 다형성을 계속 쓰게 되니 지금은 "이런 게 있구나" 정도로만 봐 두면 돼요. `code/PolyOverride.java` 에서 직접 돌려 볼 수 있어요.

---

## 자주 하는 실수

에러 문구는 모두 JDK 21 javac/java 로 직접 띄워서 확인했어요. 이클립스 문구는 다를 수 있어요.

| 증상 / 에러 메시지 | 원인 | 해결 |
|---|---|---|
| `cannot find symbol` ... `symbol: variable friend` | 부모 타입 변수로 **자식에게만 있는 멤버**를 썼어요 | 부모에 있는 멤버만 쓰거나, 자식 타입으로 형변환해서 써요 |
| `incompatible types: Father cannot be converted to Son` | 반대로 `자식 변수 = new 부모()` 를 했어요 | 다형성은 `부모 = 자식` 방향만 돼요 |
| `constructor Father in class Father cannot be applied to given types;` | 부모에 **기본 생성자가 없는데** 자식 생성자가 `super(...)` 를 안 썼어요. 자바가 몰래 넣은 `super();` 가 부모의 기본 생성자를 찾다가 실패해요 | 자식 생성자 첫 줄에 `super(값, 값);` 을 쓰거나, 부모에 기본 생성자를 만들어 둬요 (강사가 기본 생성자를 늘 만들어 두라고 권하는 이유) |
| `call to super must be first statement in constructor` | `super(...)` 를 생성자 첫 줄이 아닌 곳에 썼어요 | 생성자의 맨 첫 줄로 옮겨요 |
| `method does not override or implement a method from a supertype` | `@Override` 를 붙였는데 이름이 틀렸어요(예: `tostring`) | 대소문자까지 `toString` 으로 정확히 써요. `@Override` 가 이런 실수를 잡아 줘요 |
| `Exception in thread "main" java.lang.ClassCastException: class Cat cannot be cast to class Dog (Cat and Dog are in unnamed module of loader 'app')` (실행 중) | 진짜 Dog 가 아닌 객체를 `(Dog)` 로 형변환했어요 | 실제 객체 타입으로만 형변환해요 |
| 부모 메소드가 자식 변수 값 대신 부모 변수 값을 찍어요 (`busan.disp()` → `대한민국`) | 변수는 오버라이드되지 않아요. 부모 코드의 `this.name` 은 부모 쪽 name | 같은 이름 변수를 자식에 또 만들지 말고, 생성자나 setter 로 값을 바꿔요 |

---

## 시간대별 목차

- [00:00] 강의 목표: Object, super, 다형성
- [00:41] Object 클래스 = 자바의 최상위 부모, 자동 상속
- [01:31] super 와 super() 개념
- [02:06] 다형성 개념: 부모 = 자식, Calendar 예시
- [03:47] 실습 준비: Test01, Korea / Seoul / Busan 클래스
- [05:15] extends Object 는 생략 가능
- [06:30] Seoul 객체 생성, 물려받은 disp() 실행
- [07:19] Seoul 에서 disp() 오버라이드
- [07:58] Ctrl+Space 로 Object 에서 물려받은 toString() 발견
- [09:18] toString() 오버라이드와 실행
- [10:14] Busan: 이클립스로 생성자, getter/setter 자동 생성
- [12:04] Source 메뉴로 toString() 자동 생성, 디버깅 용도
- [13:48] super 실습: School / MiddleSchool / HighSchool
- [15:27] 부모 생성자가 먼저 호출되는 것 확인
- [16:00] super() 는 생략해도 자동으로 들어감
- [16:36] name / this.name / super.name 비교
- [18:10] HighSchool 로 생성자 호출 순서 재확인
- [19:00] 다형성 실습: Test03, Calendar = new GregorianCalendar()
- [20:38] Father 클래스와 Son 의 super(n, a)
- [22:42] Father father = new Son("손흥민", "영국")
- [24:52] Daughter 추가, 자식에만 있는 friend 는 에러
- [26:15] 강의 정리

---

## 용어 정리

| 용어 | 쉬운 뜻 |
|---|---|
| Object 클래스 | 모든 자바 클래스의 맨 꼭대기 조상. 부모를 안 정하면 자동으로 이 클래스를 물려받아요 |
| `toString()` | 객체를 문자열로 나타내 주는 메소드. Object 에게 물려받고, 보통 오버라이드해서 내부 값을 보여 주게 만들어요 |
| `super` | "내 부모". `super.name` 은 부모의 멤버 |
| `super()` | 자식 생성자 안에서 부모 생성자를 부르는 명령. 첫 줄에만 쓸 수 있고, 안 쓰면 자동으로 `super();` 가 들어가요 |
| 기본 생성자 | 매개변수가 없는 생성자 `클래스이름() {}` |
| 지역변수 | 메소드 안에서 만든 변수. 그 메소드 안에서만 살아요 |
| 멤버변수 | 클래스 안, 메소드 밖에 만든 변수. 객체가 가지고 다니는 값 |
| 다형성(Polymorphism) | "형태가 여러 가지". 부모 타입 변수에 여러 자식 객체를 넣을 수 있는 성질. 강의 파일명의 "다양성"은 잘못 적힌 것 |
| 형변환(캐스팅) | 타입을 바꿔 보는 것. `(Dog) pet` 처럼 부모 타입을 자식 타입으로 바꿀 땐 괄호로 직접 적어요 |
| `@Override` | "부모 메소드를 다시 쓴 거예요"라는 표시. 이름이 틀리면 컴파일러가 알려 줘요 |
| getter / setter | private 변수를 읽는(get) 메소드와 바꾸는(set) 메소드 |
| 디버깅 | 프로그램의 잘못된 곳(버그)을 찾아 고치는 일 |
