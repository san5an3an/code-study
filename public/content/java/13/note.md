# 13강. String 클래스와 Wrapper 클래스

## 이 강의에서 배우는 것

- 문자열(`String`)이 사실은 **클래스**라서, 점(`.`)을 찍으면 자바가 미리 만들어 둔 메소드를 골라 쓸 수 있다는 걸 알아봐요.
- 글자 수 세기(`length`), 한 글자 꺼내기(`charAt`), 위치 찾기(`indexOf`), 대소문자·글자 바꾸기, 자르기(`substring`), 나누기(`split`), 앞뒤 공백 지우기(`trim`), 내용 비교(`equals`)를 직접 써 봐요.
- 메소드 설명에 나오는 **매개변수 자료형**과 **리턴형**을 읽는 법을 익혀요. (11강에서 배운 리턴형이 여기서 바로 쓰여요.)
- 기본 자료형(`int`, `char` 등)을 클래스로 포장한 **래퍼(Wrapper) 클래스**가 무엇인지, 이름이 특이한 `Integer` 와 `Character` 를 조심해야 한다는 걸 배워요.

---

## 1. String 은 클래스예요

지금까지 `String name = "KOREA";` 처럼 문자열을 아무렇지 않게 써 왔어요. 그런데 `int`, `double` 같은 **기본 자료형**은 전부 소문자로 시작하는데 `String` 만 대문자 S 로 시작했죠. 이유는 `String` 이 기본 자료형이 아니라 **클래스**이기 때문이에요. (클래스는 12강에서 배운 "붕어빵 틀"이에요.)

클래스로 만든 값에는 **점(`.`) 연산자**를 붙여서 그 클래스가 가진 메소드를 부를 수 있어요.

```java
String name = "KOREA";
System.out.println(name.length());
```

- `name.length()` : "name 이 가진 `length` 메소드를 실행해 줘" 라는 뜻이에요. 글자 수를 돌려줘요.

실행 결과

```
5
```

### 점을 찍으면 목록이 뜨는 이유

이클립스에서 `name.` 까지 치면 메소드 목록이 쫙 나와요. 강사는 이걸 "좋은 것"이라고 말해요. 글자 수 세기 같은 기능을 우리가 반복문으로 직접 만들지 않아도, 자바를 만든 쪽에서 이미 만들어 두었으니 **골라서 쓰기만 하면** 된다는 뜻이거든요. 목록에서 골라 엔터를 치면 되니 메소드 이름을 손으로 다 칠 필요도 없어요.

비유하면 `String` 은 **기능이 잔뜩 달린 만능 칼**이에요. 칼(문자열)을 하나 들고 있으면 가위, 병따개, 줄(메소드)을 꺼내 쓸 수 있어요. 반면 `int` 같은 기본형은 그냥 **숫자가 적힌 쪽지**라서 점을 찍어도 꺼낼 게 없어요.

### 문자열을 만드는 두 가지 방법

```java
String str1 = "Gone With The Wind";              // 지금까지 써 온 방법
String str2 = new String("Gone With The Wind");  // 클래스 방식 (new + 생성자)
```

강의 화면에서는 두 번째 방식을 썼어요. 12강에서 배운 것처럼 `new` 는 메모리를 잡아 객체를 만드는 연산자이고, `String(...)` 은 클래스 이름과 같은 **생성자 함수**예요. 둘 다 틀린 문법이 아니고, 출력해 보면 똑같이 `Gone With The Wind` 가 나와요. 실제로는 첫 번째(따옴표로 바로 쓰기)를 훨씬 많이 써요.

> 강의에서는 이 문장을 "바람과 함께 사라지다" 라고 부르는데, 코드에 들어간 실제 문자열은 영어 `"Gone With The Wind"` 예요. 공백까지 포함해서 **18글자**예요.

---

## 2. 메소드 설명 읽는 법 (매개변수 자료형과 리턴형)

이클립스 목록에 `charAt(int index) : char` 처럼 표시돼요. 이걸 읽을 줄 알아야 처음 보는 메소드도 쓸 수 있어요.

```
charAt ( int index )  :  char
  │         │              │
메소드 이름  넘겨줄 값의 자료형   돌려받는 값의 자료형(리턴형)
```

- 괄호 안의 `int` : 이 메소드를 부를 때 **정수**를 하나 넘겨야 해요.
- 콜론 뒤의 `char` : 실행이 끝나면 **문자 하나(char)** 를 돌려줘요. 그래서 결과를 변수에 담으려면 `char` 변수를 써야 해요.

강사가 반복해서 강조하는 점: 화면에 `G` 라고 찍혀도 그게 **char 인지 String 인지**는 눈으로 구분이 안 돼요. 리턴형을 보고 "이건 char 구나" 하고 머릿속으로 구분할 수 있어야 해요.

---

## 3. 한 글자 꺼내기: charAt

문자열의 글자에는 **번호(인덱스, index)** 가 붙어 있어요. 배열(09강)처럼 **0번부터** 세요.

```
G  o  n  e     W  i  t  h     T  h  e     W  i  n  d
0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17
```

(4, 9, 13번은 공백이에요. 공백도 한 글자로 세요.)

```java
String str = new String("Gone With The Wind");
char ch = str.charAt(0);              // 0번째 글자
System.out.println(ch);
System.out.println(str.charAt(10));   // 10번째 글자
System.out.println(str.charAt(17));   // 17번째 글자 (마지막)
```

- `char ch = str.charAt(0);` : str 의 0번째 글자를 char 로 가져와서 ch 에 담아요. 리턴형이 char 이니까 변수도 char 로 만들었어요.

실행 결과

```
G
T
d
```

### 마지막 글자는 length() - 1 로

맨 앞 글자는 문자열이 뭐든 항상 0번이에요. 그런데 맨 마지막 글자 번호는 문자열 길이에 따라 달라져요. 그래서 마지막 글자는 **`length()` 를 이용**하는 게 좋아요.

```java
System.out.println(str.length());                  // 18
System.out.println(str.charAt(str.length() - 1));  // 18 - 1 = 17번째
```

실행 결과

```
18
d
```

왜 1을 빼냐면, 번호가 0부터 시작하기 때문이에요. 18글자면 번호는 0~17 이라서 마지막 번호는 "글자 수 - 1" 이에요. 이렇게 써 두면 문자열 내용이 바뀌어도 코드를 고칠 필요가 없어요.

---

## 4. 위치 찾기: indexOf, lastIndexOf

`charAt` 이 "몇 번째 글자가 뭐야?" 라면, `indexOf` 는 반대로 "이 글자가 몇 번째에 있어?" 를 물어요. 리턴형은 `int`(번호)예요.

```java
System.out.println(str.indexOf("G"));      // G 는 어디?
System.out.println(str.indexOf("i"));      // i 는 어디?
System.out.println(str.indexOf("B"));      // B 는 어디?
System.out.println(str.lastIndexOf("i"));  // 뒤에서부터 찾은 i 는 어디?
```

실행 결과

```
0
6
-1
15
```

- `indexOf("i")` : i 는 6번과 15번 두 군데 있어요. 앞에서부터 찾다가 **처음 만난 위치(6)** 만 돌려줘요.
- `indexOf("B")` : 없는 글자를 찾으면 **-1** 이 나와요. 번호는 0 이상이니까 -1 은 "못 찾았다"는 신호예요. 그래서 `if (str.indexOf("B") == -1)` 처럼 조건문에 자주 써요.
- `lastIndexOf("i")` : **뒤에서부터** 찾아서 처음 만난 i 의 위치예요. 찾는 방향만 뒤에서부터일 뿐, 돌려주는 번호는 여전히 **앞에서 센 번호(15)** 예요.

---

## 5. 바꾸기: toUpperCase, toLowerCase, replace

```java
System.out.println(str.toUpperCase());      // 전부 대문자로
System.out.println(str.toLowerCase());      // 전부 소문자로
System.out.println(str.replace('n', 'N'));  // n 을 찾아 N 으로
System.out.println(str);                    // 원래 str 은?
```

실행 결과

```
GONE WITH THE WIND
gone with the wind
GoNe With The WiNd
Gone With The Wind
```

- `replace('n', 'N')` : 문자열 안의 소문자 n 을 **전부** 대문자 N 으로 바꿔요. (Gone, Wind 의 n 두 개)
- 마지막 줄을 보세요. 원래 `str` 은 **그대로**예요. 이 메소드들은 str 자체를 고치는 게 아니라, 바뀐 **새 문자열을 만들어 돌려줄 뿐**이에요. 바뀐 걸 계속 쓰려면 `str = str.toUpperCase();` 처럼 다시 담아야 해요. (이 줄은 원리를 보여 주려고 덧붙였어요.)

---

## 6. 비어 있는지 묻기: isEmpty

```java
if (str.isEmpty()) {
    System.out.println("비어 있다");
} else {
    System.out.println("비어 있지 않다");
}
```

- `isEmpty()` 는 "글자 수가 0개야?" 를 물어요. 리턴형이 `boolean`(true/false)이에요.
- 리턴형이 boolean 이니까 **if 의 괄호 안에 바로** 넣을 수 있어요. (06강의 if 는 괄호 안이 true 냐 false 냐로 갈렸죠.)

str 에는 18글자가 있으니 실행 결과는

```
비어 있지 않다
```

---

## 7. 문자열 자르기: substring (강사가 "아주 중요"로 꼽은 메소드)

`substring` 은 문자열의 **일부분만 잘라서** 가져와요. 두 가지 형태가 있어요.

```java
System.out.println(str.substring(5));      // 5번째부터 끝까지
System.out.println(str.substring(5, 11));  // 5번째부터 11번째 "전"까지
```

실행 결과

```
With The Wind
With T
```

- `substring(5)` : 숫자 하나면 그 번호부터 **끝까지** 잘라요. 5번은 W 이니까 `With The Wind`.
- `substring(5, 11)` : 숫자 두 개면 **앞 번호부터 뒤 번호 바로 전까지**예요. 즉 5번부터 10번까지. 11번(h) 은 **포함되지 않아요.** 10번이 T 라서 `With T` 가 나와요.

뒤 번호가 "포함 안 됨"이라는 게 가장 헷갈리는 부분이에요. 이렇게 외우면 쉬워요.

- 원하는 마지막 글자 번호에 **1을 더해서** 적는다.
- `substring(시작, 끝)` 으로 잘린 글자 수는 **끝 - 시작** 개다. (11 - 5 = 6글자: W, i, t, h, 공백, T)

비유하면 줄자로 5cm 부터 11cm 눈금까지 재는 것과 같아요. 눈금 사이 칸은 5~6, 6~7, ... 10~11 해서 여섯 칸이죠.

---

## 8. 문자열 나누기: split

`split` 은 **기준 글자를 정해서** 문자열을 여러 조각으로 나눠요. 결과는 조각이 여러 개라서 **String 배열(`String[]`)** 로 돌려줘요. (이클립스 목록에 `split(String regex) : String[]` 이라고 나와요. 리턴형 그대로 변수를 만들면 돼요.)

```java
String[] word = str.split("n");          // 소문자 n 을 기준으로 나누기
for (int i = 0; i < word.length; i++) {  // 조각 개수만큼 반복
    System.out.println(word[i]);
}
```

- `String[] word` : 조각들을 담을 배열 변수예요. 리턴형이 `String[]` 이니까 똑같이 맞췄어요.
- 기준 글자 `n` 자체는 결과에서 **사라져요.**
- `word.length` 는 배열의 칸 수예요(09강 복습). 문자열의 `length()` 와 달리 **괄호가 없어요.**

`Go|n|e With The Wi|n|d` 처럼 n 자리에서 끊기니까 실행 결과는

```
Go
e With The Wi
d
```

강의에서는 기준을 바꿔 가며 해 봐요. 소문자 `h` 로 나누면 `Gone Wit` / ` T` / `e Wind` 로 나뉘고, **공백 `" "`** 으로 나누면 단어별로 깔끔하게 나뉘어요.

```java
word = str.split(" ");   // 공백 기준
```

```
Gone
With
The
Wind
```

공백 기준 split 은 문장을 단어로 쪼갤 때 정말 많이 써요.

> 강의와 다른 점: 강사는 말로 "H 자로 분리"라고 하지만 화면에 친 건 **소문자 `"h"`** 예요. 자바는 대소문자를 구분하기 때문에 대문자 `"H"` 로 나누면 이 문자열에는 H 가 없어서 나뉘지 않고 통째로 한 조각만 나와요.

> 참고(강의 밖 내용): `split` 의 괄호 안은 사실 "정규 표현식"이라는 특수한 패턴이라서 `.` 이나 `|` 같은 기호로 나누려면 `split("\\.")` 처럼 써야 해요. 지금은 글자나 공백으로만 나눈다고 생각하면 충분해요.

---

## 9. 앞뒤 공백 지우기: trim

`trim` 은 문자열의 **맨 앞과 맨 뒤에 붙은 공백만** 지워요. 가운데 공백은 건드리지 않아요.

```java
System.out.println("#" + "   HA   P P  Y    " + "#");
System.out.println("#" + "   HA   P P  Y    ".trim() + "#");
```

- 앞뒤의 `#` 은 의미 없는 표시예요. 공백이 지워졌는지 눈으로 확인하려고 붙였어요.
- `"...".trim()` 처럼 따옴표 문자열에 바로 점을 찍어도 돼요. 따옴표 문자열도 String 객체니까요.

실행 결과

```
#   HA   P P  Y    #
#HA   P P  Y#
```

(첫 줄은 비교용으로 덧붙인 거예요.) 사용자가 입력할 때 실수로 앞뒤에 스페이스를 넣는 경우가 많아서, 입력값을 정리할 때 자주 써요.

---

## 10. 내용 비교: equals

두 문자열의 **내용이 같은지** 비교할 때는 `equals` 를 써요. 리턴형이 boolean 이라 if 와 함께 써요.

```java
String a = "HAPPY";
String b = "HAPPYddd";
if (a.equals(b)) {
    System.out.println("서로 같다");
} else {
    System.out.println("서로 다르다");
}
```

실행 결과

```
서로 다르다
```

강의에서는 처음에 둘 다 `"HAPPY"` 로 해서 "서로 같다"를 보고, 일부러 b 를 `"HAPPYddd"` 로 바꿔 "서로 다르다"를 확인해요.

> 참고(강의 밖 내용): 숫자는 `==` 로 비교했는데, 문자열은 왜 `equals` 를 쓸까요? 문자열은 객체라서 `==` 는 "내용이 같냐"가 아니라 "**같은 객체(같은 메모리 위치)냐**"를 묻기 때문이에요.
>
> ```java
> String x = "HAPPY";
> String y = new String("HAPPY");
> System.out.println(x == y);       // false  (서로 다른 객체)
> System.out.println(x.equals(y));  // true   (내용은 같음)
> ```
>
> 실제로 돌려 보면 `false`, `true` 가 나와요. 내용이 같은데 `==` 가 false 라니 초보가 정말 많이 걸리는 함정이에요. **문자열 비교는 무조건 equals** 로 기억하세요.

---

## 11. 래퍼(Wrapper) 클래스

### 래퍼 클래스가 뭐예요?

"wrap" 은 **포장하다**라는 뜻이에요. 래퍼 클래스는 `int`, `double` 같은 **기본 자료형을 클래스로 포장해 놓은 것**이에요. 그래서 "포장 클래스"라고도 불러요. 주의할 점은 "Wrapper" 라는 이름의 클래스가 따로 있는 게 아니라, 아래 8개 클래스를 **묶어서 부르는 별명**이라는 거예요. 모두 `java.lang` 이라는 기본 패키지에 있어서 import 없이 바로 쓸 수 있어요.

| 기본 자료형 | 래퍼 클래스 |
|---|---|
| boolean | Boolean |
| byte | Byte |
| short | Short |
| int | **Integer** |
| long | Long |
| float | Float |
| double | Double |
| char | **Character** |

대부분 **첫 글자만 대문자로** 바꾸면 돼요. 예외 두 개만 조심하세요.

- `int` → `Int` 가 아니라 **`Integer`**
- `char` → `Char` 가 아니라 **`Character`**

비유하면 기본 자료형은 **맨손에 든 사탕**, 래퍼 클래스는 **포장지에 싼 사탕**이에요. 사탕(값)은 똑같지만, 포장지에는 "유통기한 보기", "다른 모양으로 바꾸기" 같은 기능(메소드)이 붙어 있어요.

### 왜 클래스로 포장하나요?

강의에서 말하는 가장 큰 이유는 **점(`.`) 연산자를 쓸 수 있다**는 거예요. 기본형 `int` 에는 메소드가 없지만, `Integer` 에는 다른 자료형으로 바꾸기, 문자열로 바꾸기 같은 메소드가 들어 있어요.

> 참고(강의 밖 내용): 실무에서 래퍼 클래스를 쓰는 대표적인 경우는 (1) 문자열 `"123"` 을 숫자 123 으로 바꿀 때(`Integer.parseInt`), (2) 21강에서 배울 컬렉션(ArrayList 등)처럼 **객체만 담을 수 있는 곳**에 숫자를 담을 때예요.

### 만드는 방법: 옛날 방식과 요즘 방식

```java
boolean boo1 = true;                  // 기본형
Boolean boo2 = new Boolean(false);    // 옛날 방식 (생성자로 만들기)
Boolean boo4 = false;                 // 요즘 방식 (값을 바로 넣기)
```

이클립스에서 옛날 방식을 쓰면 `Boolean` 글자에 **가운데 줄(취소선)** 이 그어져요. 강사 설명대로, 이건 "쓸 수는 있지만 더 나은 방법이 있으니 쓰지 말라"는 표시(**deprecated**, 사용 비권장)예요. 그래서 이 노트의 예제 코드는 요즘 방식으로 썼어요.

`Boolean boo4 = false;` 처럼 기본형 값을 그냥 넣어도 되는 이유는, 자바가 알아서 포장해 주기 때문이에요. 이걸 **오토박싱(auto-boxing, 자동 포장)** 이라고 해요. 반대로 클래스 값을 기본형 변수에 넣으면 자동으로 포장을 풀어 줘요(**언박싱**).

> 강의와 다른 점: 강사는 옛날 방식도 "쓰셔도 된다"고 하는데, 강의에서 쓴 Java 11 에서는 경고(노란 표시)만 떴지만 지금 쓰는 Java 21 에서는 이 생성자들이 **"앞으로 삭제될 예정"(marked for removal)** 으로 바뀌었어요. javac 로 컴파일하면 이런 경고가 실제로 나와요.
>
> ```
> warning: [removal] Integer(int) in Integer has been deprecated and marked for removal
> ```
>
> 경고라서 실행은 되지만, 새로 쓰는 코드에서는 `Integer x = 4;` 나 `Integer.valueOf(4)` 를 쓰세요. 문자열로 만들던 `new Integer("6")` 은 `Integer.valueOf("6")` 으로 바꾸면 돼요.

### Boolean, Byte

```java
Boolean boo4 = false;
Boolean boo5 = true;
System.out.println(boo4.toString());
System.out.println(boo5.toString());

byte by1 = 3;
Byte by2 = 5;
Byte by3 = 7;
System.out.println(by1);
System.out.println(by2.doubleValue());
System.out.println(by3.toString());
```

- `toString()` : 값을 **문자열(String)** 로 바꿔서 돌려줘요. 화면에는 `false` 로 보이지만 자료형은 boolean 이 아니라 String 이에요. (강사가 "여기까지 해석하셔야 한다"고 강조한 부분)
- `doubleValue()` : 값을 double 로 바꿔서 돌려줘요. 5 가 `5.0` 이 돼요.

실행 결과

```
false
true
3
5.0
7
```

### Integer

```java
int in1 = 2;
Integer in2 = 4;
Integer in3 = Integer.valueOf("6");   // 강의: new Integer("6")
Integer in4 = 8;
System.out.println(in1);
System.out.println(in2.doubleValue());
System.out.println(in3.longValue());
System.out.println(in4.toString());
System.out.println(in2 + in3);
```

- `longValue()` : long 으로 바꿔 돌려줘요. 화면에는 그냥 `6` 이에요.
- `in2 + in3` : 클래스끼리인데도 기본형처럼 **더하기가 돼요.** 자동으로 포장을 풀어서(언박싱) 4 + 6 을 계산하기 때문이에요.

실행 결과

```
2
4.0
6
8
10
```

### Double

```java
double dou1 = 2.3;
Double dou2 = 4.5;
Double dou3 = 6.7;
System.out.println(dou1);
System.out.println(dou2.isNaN());
System.out.println(dou1 + dou3);
```

- `isNaN()` : NaN 은 **Not a Number(숫자가 아님)** 의 줄임말이에요. "숫자가 아닌 값이야?" 를 묻고 boolean 을 돌려줘요. 4.5 는 숫자니까 `false`.
- `dou1 + dou3` : 기본형 + 클래스형도 그냥 계산돼요.

실행 결과

```
2.3
false
9.0
```

> 참고(강의 밖 내용): NaN 은 `0.0 / 0.0` 처럼 수학적으로 답이 없는 계산을 하면 생기는 특별한 double 값이에요.

### Character

```java
char ch1 = 'R';
Character ch2 = 'B';
Character ch3 = 'T';
System.out.println(ch1);
System.out.println(ch2.toString());
System.out.println(ch3.toString());
```

- char 와 마찬가지로 **작은따옴표** 한 글자를 넣어요. 큰따옴표 `"B"` 를 넣으면 에러예요(아래 "자주 하는 실수" 참고).

실행 결과

```
R
B
T
```

### 참고(강의 밖 내용): 문자열을 숫자로 바꾸기

래퍼 클래스의 가장 실용적인 쓰임이라 짧게 보충해요. (code 폴더의 `WrapperParse.java`)

```java
String text = "123";
System.out.println(text + 1);          // 1231  (문자열 이어 붙이기)
int num = Integer.parseInt(text);      // "123" -> 123
System.out.println(num + 1);           // 124   (진짜 덧셈)
```

`"123"` 은 숫자처럼 보여도 **글자**예요. 계산하려면 `Integer.parseInt` 로 진짜 int 로 바꿔야 해요. double 은 `Double.parseDouble("3.5")` 를 써요.

---

## 자주 하는 실수

아래 javac 에러/실행 에러 문구는 Java 21 에서 실제로 컴파일·실행해서 확인한 거예요. 이클립스는 문구가 다를 수 있어요.

| 증상 / 에러 메시지 | 원인 | 해결 |
|---|---|---|
| `error: cannot find symbol` / `symbol: class Int` | `int` 의 래퍼 클래스를 `Int` 로 씀 | **`Integer`** 로 써요 |
| `error: cannot find symbol` / `symbol: class Char` | `char` 의 래퍼 클래스를 `Char` 로 씀 | **`Character`** 로 써요 |
| `java.lang.StringIndexOutOfBoundsException: Index 18 out of bounds for length 18` (실행 중 에러) | 18글자 문자열에 `charAt(18)` 을 함. 번호는 0~17 까지만 있어요 | 마지막 글자는 `charAt(str.length() - 1)` |
| `error: cannot find symbol` / `symbol: variable length` | 문자열에 `str.length` 처럼 괄호를 빼먹음 | 문자열은 메소드라서 **`str.length()`** |
| `error: cannot find symbol` / `symbol: method length()` / `variable w of type String[]` | 배열에 `w.length()` 처럼 괄호를 붙임 | 배열은 **`w.length`** (괄호 없음). 문자열과 반대라서 헷갈려요 |
| `error: incompatible types: String cannot be converted to char` | `char c = str.substring(0, 1);` 처럼 리턴형이 String 인 결과를 char 에 담음 | 한 글자를 char 로 원하면 `charAt`, 아니면 `String` 변수에 담아요. 리턴형을 확인하세요 |
| `error: incompatible types: String cannot be converted to Character` | `Character c = "B";` 처럼 큰따옴표를 씀 | 문자 하나는 작은따옴표 `'B'` |
| `error: incompatible types: char cannot be converted to String` | `str.split(' ')` 처럼 split 에 작은따옴표를 씀 | split 은 String 을 받아요. `str.split(" ")` |
| `warning: [removal] Integer(int) in Integer has been deprecated and marked for removal` (경고, 실행은 됨) | `new Integer(4)` 같은 옛날 생성자 사용 | `Integer x = 4;` 또는 `Integer.valueOf(4)` |
| `java.lang.NumberFormatException: For input string: "12a"` (실행 중 에러) | 숫자가 아닌 글자가 섞인 문자열을 `Integer.parseInt` 함 | 숫자만 있는 문자열인지 확인해요 |
| 에러는 없는데 `toUpperCase()` 를 했는데도 그대로예요 | `str.toUpperCase();` 만 쓰고 결과를 안 담음. String 은 원본을 바꾸지 않아요 | `str = str.toUpperCase();` 처럼 다시 담아요 |
| 에러는 없는데 내용이 같은 문자열 비교가 false 예요 | 문자열을 `==` 로 비교함 | `a.equals(b)` 로 비교해요 |
| `substring(5, 11)` 결과가 한 글자 모자라요 | 끝 번호 글자는 포함되지 않아요 | 원하는 마지막 번호 + 1 을 적어요 |

---

## 시간대별 목차

- [00:00] 강의 소개와 목표 (String 으로 문자열 가공, 래퍼 클래스 다루기)
- [00:39] 이론: String 클래스의 다양한 함수 (추출, 비교, 분리)
- [01:10] 이론: 래퍼 클래스 표, Integer 와 Character 주의
- [02:30] 실습 시작 (oop14 패키지, Test01_String)
- [02:46] 점 연산자를 찍으면 메소드 목록이 뜬다
- [03:16] length(): 글자 수 5
- [03:50] new String("Gone With The Wind") 으로 문자열 만들기
- [04:51] charAt 의 매개변수 자료형(int)과 리턴형(char) 읽기
- [06:06] charAt(0) = G, charAt(10) = T
- [07:54] 마지막 글자 charAt(17), length() 활용 추천
- [10:04] indexOf: 0, 6, -1 (중복이면 첫 위치, 없으면 -1)
- [12:42] lastIndexOf("i") = 15
- [13:26] toUpperCase, toLowerCase, replace
- [13:56] isEmpty() 와 if, 리턴형 boolean
- [14:48] substring (5) / (5, 11), 끝 번호는 포함 안 됨
- [16:32] split: n, h, 공백 기준으로 나누기, 리턴형 String[]
- [18:51] trim: 앞뒤 공백만 제거
- [19:38] equals: 문자열 내용 비교
- [20:31] 래퍼 클래스 실습 시작 (Test02_wrapper), Boolean 과 옛날 방식(취소선)
- [21:45] 클래스로 쓰면 점 연산자 사용 가능, toString()
- [22:45] Byte: doubleValue(), toString()
- [23:50] Integer: doubleValue(), longValue(), toString(), 덧셈
- [25:37] Double: isNaN(), 덧셈
- [26:41] Character
- [27:30] 강의 정리

---

## 용어 정리

| 용어 | 쉬운 뜻 |
|---|---|
| String 클래스 | 문자열을 다루는 클래스. 점을 찍으면 문자열용 메소드를 쓸 수 있어요 |
| 점(.) 연산자 | "이 객체가 가진 ~를 쓰겠다"는 표시. `str.length()` |
| 인덱스 (index) | 글자나 배열 칸의 번호. 0부터 시작 |
| 리턴형 | 메소드가 돌려주는 값의 자료형. 설명의 콜론(:) 뒤에 표시돼요 |
| length() | 문자열의 글자 수 |
| charAt(n) | n번째 글자 하나를 char 로 |
| indexOf / lastIndexOf | 글자의 위치(번호). 없으면 -1 |
| substring | 문자열 일부분 잘라 오기. 끝 번호는 포함 안 됨 |
| split | 기준 글자로 나눠 String 배열로 |
| trim | 맨 앞·맨 뒤 공백 지우기 |
| equals | 두 문자열의 내용이 같은지 비교 (true/false) |
| 래퍼 클래스 (Wrapper) | 기본 자료형을 클래스로 포장한 것. Integer, Character 등 8개 |
| deprecated | "쓰지 말 것을 권함" 표시. 이클립스에서 취소선으로 보여요 |
| 오토박싱 / 언박싱 | 기본형을 래퍼 클래스로 자동 포장 / 자동으로 포장 풀기 |
| toString() | 값을 문자열로 바꿔 돌려주는 메소드 |
| NaN | Not a Number. 숫자가 아닌 특별한 double 값 |
| parseInt | 문자열 "123" 을 int 123 으로 바꾸는 Integer 의 메소드 (강의 밖) |
