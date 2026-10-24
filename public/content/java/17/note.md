# 17강. this와 this() 및 Getter와 Setter 함수

## 이 강의에서 배우는 것

- `this` 가 "지금 이 객체 자신"을 가리키는 참조 변수라는 것, 그리고 멤버 변수와 지역 변수(매개변수)의 이름이 같을 때 둘을 구분하는 데 쓴다는 걸 배워요.
- 생성자를 하나라도 직접 만들면 **기본 생성자가 자동으로 안 생긴다**는 함정과, 그래서 기본 생성자를 직접 적어 두는 습관을 익혀요.
- `this()` 로 같은 클래스 안의 **다른 생성자를 부르는 방법**과 지켜야 할 규칙 3가지를 알아봐요.
- `private` 으로 막아 둔 멤버 변수를 **getter / setter 메소드**로 다루는 방법과 이름 짓는 규칙, 이클립스 자동 생성 메뉴를 배워요.

> 복습: 클래스, 객체(`new`), 멤버 변수(필드), 생성자, 생성자 오버로드, `private`/`public` 접근 제한자는 앞 강의(11~15강)에서 배웠어요. 이번 강의는 그 위에 쌓이는 내용이에요.

---

## 1. this: "나 자신"을 가리키는 말

### 먼저 문제 상황부터

클래스 안에는 두 종류의 변수가 섞여 있어요.

| 종류 | 어디에 선언? | 어디서 쓸 수 있나? |
|---|---|---|
| **멤버 변수(필드)** | 클래스 바로 안 (메소드 바깥) | 클래스 안 어디서든 |
| **지역 변수 / 매개변수** | 메소드나 생성자 안, 또는 괄호 `( )` 안 | 그 메소드(생성자) 안에서만 |

그런데 둘의 **이름이 같으면** 어떻게 될까요? 자바 규칙은 이래요.

> 이름이 겹치면 **가까운 쪽(지역 변수, 매개변수)이 이겨요.**

비유하자면, 집 안에서 "엄마!" 하고 부르면 동네 모든 엄마가 아니라 **우리 집 엄마**가 대답하는 것과 같아요. 가까운 쪽이 먼저예요.

### 강의 예제: 같은 이름 name 이 두 개

```java
class Score {
    private String name = "무궁화";   // 멤버 변수

    public void disp() {
        String name = "오필승";           // 지역 변수 (이름이 같아요!)
        System.out.println(name);        // 1
        System.out.println(this.name);   // 2
    }
}
```

- `private String name = "무궁화";` : 클래스 전체에서 쓰는 멤버 변수예요.
- `String name = "오필승";` : `disp()` 안에서만 사는 지역 변수예요. 이름이 같아도 **문법 에러가 아니에요.**
- 1번 줄 `name` : 아무것도 안 붙였으니 가까운 쪽, 즉 지역 변수 → `오필승`
- 2번 줄 `this.name` : `this.` 를 붙이면 "**이 객체의** name", 즉 멤버 변수 → `무궁화`

실행 결과

```
오필승
무궁화
```

### this 의 정체

`this` 는 **지금 이 메소드를 실행하고 있는 객체 자신**을 가리키는 참조 변수예요. `this.멤버변수` 라고 쓰면 "내(객체) 것인 그 변수"라는 뜻이 돼요.

> **강의와 다른 점**: 강의 슬라이드와 화면 주석에는 "this 는 **클래스** 자신을 가리킨다"라고 되어 있어요. 정확히는 클래스(설계도)가 아니라 **`new` 로 만들어진 객체 하나**를 가리켜요. 예를 들어 `Score a = new Score(); Score b = new Score();` 라면, `a.disp()` 안의 `this` 는 a 객체이고 `b.disp()` 안의 `this` 는 b 객체예요. 같은 코드라도 누가 불렀느냐에 따라 `this` 가 달라져요.

### this 는 꼭 써야 하나요?

아니에요. 이름이 안 겹치면 그냥 `name` 이라고 써도 멤버 변수를 가리켜요. `this` 는 **이름이 겹쳐서 구분이 필요할 때** 꼭 필요하고, 그 외에는 "이건 멤버 변수예요" 하고 읽기 좋게 표시하는 용도로 써도 돼요.

---

## 2. 생성자에서 this 를 쓰는 대표적인 경우

실무에서 `this` 를 가장 많이 보는 곳이 바로 이거예요. 매개변수 이름을 멤버 변수와 **똑같이** 짓는 거죠.

```java
public Score(String name, int kor, int eng, int mat) {
    this.name = name;
    this.kor = kor;
    this.eng = eng;
    this.mat = mat;
}
```

- 생성자 입장에서 `name` 은 두 개예요. 멤버 변수 `name` 과 매개변수 `name`.
- `this.name = name;` 을 읽는 법: "**이 객체의 name**(왼쪽) 에 **전달받은 name**(오른쪽) 을 넣어라."

### 왜 굳이 이름을 똑같이 짓나요?

`n`, `k`, `e`, `m` 처럼 다른 이름을 지어도 되지만, 그러면 매개변수가 무슨 값인지 알아보기 어려워요. 이름을 같게 하면 "이 매개변수는 저 멤버 변수에 들어갈 값"이라는 게 한눈에 보여요. 그래서 자바 개발자들은 대부분 이렇게 써요.

### this 를 빼먹으면? (초보 단골 실수)

```java
class Box {
    int size;
    Box(int size) {
        size = size;   // this 빠짐!
    }
}
// new Box(10).size 를 출력하면?
```

실행 결과

```
0
```

`size = size;` 는 양쪽 다 가까운 쪽인 **매개변수**를 가리켜요. 매개변수에 자기 자신을 넣은 것뿐이라 멤버 변수 `size` 는 그대로 0 이에요. 에러가 안 나서 더 찾기 어려운 실수예요. `this.size = size;` 로 고쳐야 해요.

---

## 3. 기본 생성자가 사라지는 함정

**기본 생성자(default constructor)** 는 매개변수가 없는 생성자 `Score()` 예요.

- 클래스에 생성자를 **하나도 안 만들면**, 자바가 보이지 않는 기본 생성자를 **자동으로** 넣어 줘요.
- 하지만 매개변수가 있는 생성자를 **하나라도 직접 만들면**, 자동으로 넣어 주지 않아요.

```java
class Q {
    Q(String n) {}         // 매개변수 있는 생성자만 있음
}
// main 에서
Q q = new Q();             // 에러!
```

javac 에러 (직접 컴파일해서 확인)

```
error: constructor Q in class Q cannot be applied to given types;
  required: String
  found:    no arguments
```

"String 을 받아야 하는데 아무것도 안 줬다"는 뜻이에요. 기본 생성자가 없으니까요.

그래서 강사는 이렇게 권해요. "언제 자동으로 생기고 언제 안 생기는지 외우기 어려우니, **기본 생성자는 그냥 직접 적어 두자.**"

```java
public Score() {}   // 내용이 비어 있어도 OK
```

비유: 가게에 "기본 메뉴"가 있다고 생각하고 손님이 그냥 "주세요" 했는데, 사장님이 특별 메뉴를 하나 추가하는 순간 기본 메뉴판을 치워 버리는 셈이에요. 그러니 기본 메뉴판을 처음부터 벽에 못 박아 두는 거죠.

---

## 4. this(): 다른 생성자를 부르기

### 왜 필요한가요?

생성자를 여러 개 만들면(오버로드), 하는 일이 겹치는 경우가 많아요. 같은 코드를 생성자마다 복사하는 대신, **한 생성자가 다른 생성자에게 일을 맡기면** 깔끔해요. 그때 쓰는 게 `this(...)` 예요.

- `this.` (점) → 내 멤버 변수/메소드
- `this(...)` (괄호) → 내 **다른 생성자** 호출

### 생성자 이름으로는 못 불러요

```java
public Sungjuk() {
    // Sungjuk("무궁화");   // 에러
    this("무궁화");          // OK
}
```

생성자 이름을 그대로 쓰면 자바는 그걸 "Sungjuk 이라는 **일반 메소드**를 찾는 것"으로 이해해요. javac 로 확인해 보면 이렇게 나와요.

```
error: cannot find symbol
  symbol:   method C(String)
```

(위는 클래스 이름을 `C` 로 해서 띄워 본 메시지예요.) 강사의 비유처럼 "자기가 자기 이름을 부르면 어색하니까" 생성자끼리는 `this` 라고 불러요. "나는요~" 하고 부르는 느낌이에요.

### 예제

```java
class Sungjuk {
    private String name;
    private int aver;

    public Sungjuk() {
        this("무궁화");                 // 아래 Sungjuk(String) 을 부름
        System.out.println("기본 생성자 실행");
    }

    public Sungjuk(String name) {
        this.name = name;
        System.out.println("이름 생성자 실행: " + name);
    }

    public Sungjuk(int k, int e, int m) {
        this("코리아");                 // 첫 줄에서 다른 생성자 호출
        this.aver = (k + e + m) / 3;
    }
}
```

`new Sungjuk()` 를 하면 실행 순서는 이래요.

```
Sungjuk()  ──this("무궁화")──▶  Sungjuk(String): "이름 생성자 실행: 무궁화" 출력
Sungjuk()  ◀── 돌아옴, "기본 생성자 실행" 출력
```

> 참고: 강의 화면의 `Sungjuk(String name)` 은 몸통이 비어 있었어요(문법만 보여 주는 예제라 실행은 안 했어요). 이 노트와 `code/ThisConstructor.java` 에서는 실제로 이름이 저장되도록 `this.name = name;` 을 채워 넣었어요.

### this() 의 규칙 3가지 (강의 슬라이드)

1. **자기 생성자를 부를 때는 첫 줄에서 불러야 해요.**
2. **생성자는 일반 메소드를 부를 수 있어요.**
3. **일반 메소드에서는 생성자를 부를 수 없어요.** (`this()` 를 일반 메소드 안에 못 써요)

1번 위반 (javac 로 확인)

```java
public Sungjuk(int k, int e, int m) {
    this.aver = (k + e + m) / 3;
    this("코리아");     // 첫 줄이 아님
}
```

```
error: call to this must be first statement in constructor
```

2번 예시: 생성자 안에서 `calc();` 처럼 일반 메소드를 부르는 건 문제없어요.

3번 위반 (javac 로 확인)

```java
public void calc() {
    this();   // 일반 메소드 안
}
```

```
error: call to this must be first statement in constructor
```

일반 메소드에서 써도 같은 메시지가 나와요. "this() 는 생성자의 첫 줄에서만 쓸 수 있다"는 뜻으로 이해하면 돼요.

왜 이런 규칙이 있을까요? 생성자는 객체가 **태어날 때 딱 한 번** 실행되는 준비 작업이에요. 이미 만들어진 객체에서 일반 메소드가 생성자를 다시 부르면 "다시 태어나라"는 말이 되어 이상하죠. 그리고 첫 줄 규칙은 "준비 작업(다른 생성자)을 먼저 끝낸 다음에 내 일을 한다"는 순서를 보장하기 위한 거예요.

> 참고(강의 밖 내용): 아주 최신 자바(Java 25)에서는 `this()` 앞에 일부 문장을 쓸 수 있도록 규칙이 조금 풀렸어요. 하지만 강의(Java 11)와 이 노트에서 확인한 Java 21 기준으로는 "첫 줄" 규칙이 그대로예요. 지금은 첫 줄 규칙대로 익혀 두면 돼요.

> 참고(강의 밖 내용): 생성자 A 가 B 를 부르고 B 가 다시 A 를 부르면 끝없이 돌게 되니 자바가 미리 막아요. `error: recursive constructor invocation` (javac 로 확인).

---

## 5. Getter 와 Setter

### 왜 private 으로 막아 둘까요?

멤버 변수를 `public` 으로 열어 두면 아무 데서나 `bbs.price = -5000;` 처럼 엉뚱한 값을 넣을 수 있어요. 객체의 데이터가 망가지지 않게 지키는 걸 **무결성**이라고 하는데, 그래서 멤버 변수는 `private` 으로 막아 둬요.

막았다고 "쓰지 말라"는 게 아니에요. **메소드라는 창구**를 통해서만 들어오고 나가게 하는 거예요.

비유: 은행 금고(멤버 변수)에 손님이 직접 들어가지 못하게 하고, **창구 직원(getter/setter)** 을 통해서만 입금·출금하게 하는 것과 같아요. 창구 직원은 "마이너스 금액은 입금 안 돼요" 같은 검사도 할 수 있어요.

### 이름 짓는 규칙

| 종류 | 하는 일 | 이름 규칙 | 예 (필드 `bbsno`) |
|---|---|---|---|
| getter | 값을 **꺼내서 돌려줌** | `get` + 필드 첫 글자 대문자 | `getBbsno()` |
| setter | 값을 **받아서 넣음** | `set` + 필드 첫 글자 대문자 | `setBbsno(int bbsno)` |

이건 문법이 강제하는 게 아니라 자바 개발자들 사이의 **약속(관례)** 이에요. 그래도 거의 모든 도구와 라이브러리가 이 이름을 기준으로 동작하니 꼭 지키는 게 좋아요.

### 강의 예제: 게시판 글 클래스

```java
class Bbs {
    private int bbsno;       // 글번호
    private String writer;   // 글작성자
    private String subject;  // 글제목

    public Bbs() {}

    public int getBbsno() {
        return this.bbsno;
    }

    public void setBbsno(int bbsno) {
        this.bbsno = bbsno;
    }
    // writer, subject 도 같은 모양으로...
}
```

- `public int getBbsno()` : 밖에서 불러야 하니 `public`, 정수를 돌려주니 리턴형 `int`, 받을 값은 없으니 괄호가 비었어요.
- `return this.bbsno;` : 내 글번호를 돌려줘요.
- `public void setBbsno(int bbsno)` : 값을 넣기만 하고 돌려줄 건 없으니 `void`. 넣을 값을 매개변수로 받아요.
- `this.bbsno = bbsno;` : 2장에서 본 그 패턴이에요.

사용하는 쪽

```java
Bbs bbs = new Bbs();
bbs.setBbsno(3);
bbs.setWriter("코리아");
bbs.setSubject("무궁화 꽃이 피었습니다");

System.out.println(bbs.getBbsno());
System.out.println(bbs.getWriter());
System.out.println(bbs.getSubject());
```

실행 결과

```
3
코리아
무궁화 꽃이 피었습니다
```

`bbs.bbsno = 3;` 처럼 직접 넣으려 하면 에러가 나요 (javac 로 확인, 필드 이름이 `no` 인 예로 띄움).

```
error: no has private access in P
```

### setter 에서 검사하기 (참고, 강의 밖 내용)

setter 가 진짜 쓸모 있는 순간은 값을 **검사**할 때예요.

```java
public void setPrice(int price) {
    if (price < 0) {
        System.out.println("가격은 0 이상이어야 해요");
        return;              // 넣지 않고 돌아감
    }
    this.price = price;
}
```

이렇게 하면 잘못된 값이 객체 안으로 들어오는 걸 한 곳에서 막을 수 있어요.

### 이클립스 자동 생성

getter/setter 는 모양이 늘 똑같아서 손으로 치기 귀찮아요. 이클립스는 메뉴로 자동으로 만들어 줘요.

1. 클래스 안, 코드를 넣고 싶은 위치(예: 기본 생성자 아래)에 커서를 둬요.
2. 메뉴 **Source → Generate Getters and Setters...**
3. 만들 필드를 체크하고, 접근 제한자(access modifier)는 `public` 으로 두고 **Generate**.

강의에서는 회원 클래스 `Member`(회원번호, 아이디, 비밀번호, 이름, 주소)로 시연했고, 손으로 만든 `Bbs` 와 같은 모양의 코드가 생겨요. 자동 생성 코드는 `return memberno;` 처럼 getter 에 `this` 를 빼고 만드는데, 이름이 안 겹치니 결과는 같아요.

---

## 자주 하는 실수

| 증상 / 에러 메시지 | 원인 | 해결 |
|---|---|---|
| 에러는 없는데 값이 0 이나 null 로 나와요 | 생성자/setter 에서 `name = name;` 처럼 `this.` 를 빼먹었어요 | `this.name = name;` |
| `constructor Q in class Q cannot be applied to given types;` (javac 확인) | 매개변수 있는 생성자만 만들어서 기본 생성자가 사라졌는데 `new Q()` 를 했어요 | 기본 생성자 `Q() {}` 를 직접 적어 둬요 |
| `cannot find symbol ... symbol: method C(String)` (javac 확인) | 생성자를 `C("x");` 처럼 이름으로 불렀어요 | `this("x");` |
| `call to this must be first statement in constructor` (javac 확인) | `this()` 를 생성자의 첫 줄이 아닌 곳, 또는 일반 메소드 안에서 썼어요 | 생성자 첫 줄로 옮겨요. 일반 메소드에서는 쓸 수 없어요 |
| `recursive constructor invocation` (javac 확인) | 생성자끼리 서로를 `this()` 로 부르고 있어요 | 호출이 한 방향으로 끝나게 바꿔요 |
| `xxx has private access in ...` (javac 확인) | 밖에서 private 멤버 변수에 직접 접근했어요 | getter/setter 를 통해 접근해요 |
| `getbbsno()` 처럼 소문자로 지었어요 | 에러는 아니지만 관례 위반 | `get` + 필드 첫 글자 **대문자**: `getBbsno()` |

이클립스의 에러 문구(빨간 밑줄에 마우스를 올렸을 때 나오는 말)는 위 javac 문구와 다를 수 있어요. 이클립스 문구는 강의 화면에서 확인하지 못했어요.

---

## 시간대별 목차

- [00:00] 강의 소개와 목표
- [00:36] 슬라이드: this 란 (멤버 변수와 지역 변수 구분)
- [01:14] 슬라이드: this() 와 주의사항 3가지
- [02:34] 슬라이드: getter / setter 와 이름 규칙
- [05:01] 실습 준비: Test01_this, Score 클래스
- [06:39] 기본 생성자(default constructor)와 자동 생성되지 않는 경우
- [07:57] 기본 생성자를 직접 적어 두자는 권장
- [08:47] disp() 로 멤버 변수 name 출력 (무궁화)
- [09:54] 같은 이름의 지역 변수 선언: 지역 변수가 우선 (오필승)
- [11:47] this.name 으로 멤버 변수 가리키기
- [12:29] 매개변수 이름이 멤버 변수와 같은 생성자와 this
- [13:49] this() 실습: Sungjuk 클래스
- [14:57] 생성자 이름으로 직접 호출하면 에러, this() 로 호출
- [16:41] this() 가 첫 줄이 아니면 에러
- [17:35] 생성자에서 일반 메소드 calc() 호출은 가능
- [17:52] 일반 메소드에서 this() 호출은 불가
- [19:00] getter/setter 실습: Bbs(게시판) 클래스
- [23:05] setter 로 넣고 getter 로 꺼내기 실행
- [23:58] Member 클래스와 이클립스 Generate Getters and Setters
- [25:47] 강의 정리

---

## 용어 정리

| 용어 | 쉬운 뜻 |
|---|---|
| this | 지금 이 메소드를 실행 중인 객체 자신을 가리키는 참조 변수 |
| this.변수 | "내 것인" 멤버 변수. 지역 변수와 이름이 겹칠 때 구분용 |
| this() | 같은 클래스의 다른 생성자를 부르는 문장. 생성자 첫 줄에서만 |
| 멤버 변수(필드) | 클래스 바로 안에 선언된 변수. 객체가 가진 데이터 |
| 지역 변수 | 메소드 안에서 선언된 변수. 그 메소드 안에서만 존재 |
| 매개변수 | 메소드/생성자 괄호 안에서 전달값을 받는 변수 |
| 기본 생성자 | 매개변수가 없는 생성자. 생성자를 하나라도 만들면 자동으로 안 생김 |
| 생성자 오버로드 | 매개변수 모양이 다른 생성자를 여러 개 만드는 것 |
| 무결성 | 객체의 데이터가 엉뚱한 값으로 망가지지 않은 상태 |
| getter | private 필드 값을 꺼내 돌려주는 메소드 (`getXxx()`) |
| setter | 값을 받아 private 필드에 넣는 메소드 (`setXxx(값)`) |
| 접근 제한자 | `public`, `private` 처럼 어디서 접근할 수 있는지 정하는 키워드 |
