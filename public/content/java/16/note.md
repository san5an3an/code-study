# 16강. Math와 Calendar 클래스

## 이 강의에서 배우는 것

- 자바가 미리 만들어 둔 **Math 클래스**로 절댓값, 큰 값/작은 값, 올림/버림/반올림 같은 수학 계산을 해요.
- `Math.random()` 으로 **난수(무작위 수)** 를 만들고, 주사위(1~6)나 로또 번호(1~45)처럼 원하는 범위로 바꾸는 공식을 익혀요.
- **Calendar 클래스**로 컴퓨터의 현재 년, 월, 일, 시, 분, 초, 요일을 알아내요. 특히 **월이 0부터 시작하는 함정**을 꼭 기억해요.
- **GregorianCalendar 클래스**의 `isLeapYear()` 로 윤년인지 평년인지 판별해요.
- 마지막으로 주민번호 앞자리와 성별코드로 출생연도, 나이, 성별을 구하는 작은 프로젝트를 생각해 봐요.

---

## 0. 들어가기 전에: static 복습

15강까지 `static` 을 배웠어요. 한 줄로 다시 떠올려 보면,

> `static` 이 붙은 변수와 메소드는 **객체를 만들지 않고 `클래스이름.이름` 으로 바로** 쓸 수 있어요.

이번 강의의 Math 클래스는 이 성질을 그대로 이용해요. 이클립스에서 `Math.` 까지 치면 자동완성 목록이 뜨는데, 항목 옆에 **빨간 S 표시**가 붙어 있어요. 이 S가 static 이라는 표시예요.

비유하면 Math 클래스는 **동네 공용 계산기**예요. 집집마다 계산기를 새로 사(new) 올 필요 없이, 누구나 "Math 계산기야, -3의 절댓값 알려줘" 하고 바로 쓰면 돼요.

---

## 1. Math 클래스란?

**Math 클래스**는 자바가 기본으로 제공하는, 수학 계산용 메소드를 모아 둔 클래스예요.

- `java.lang` 패키지에 들어 있어요. **패키지(package)** 는 클래스를 담아 두는 폴더 같은 거예요. `java.lang` 은 자바가 자동으로 불러오는 특별한 폴더라서, `String` 처럼 **import 없이** 바로 쓸 수 있어요.
- 안에 있는 메소드는 **모두 static** 이에요. 그래서 `new Math()` 로 객체를 만들지 않고 `Math.abs(-3)` 처럼 써요.

강의 슬라이드에 나온 주요 기능을 표로 정리하면 이래요.

| 변수 / 메소드 | 하는 일 | 예시 결과 |
|---|---|---|
| `Math.E` | 자연상수 e | 2.718281828459045 |
| `Math.PI` | 원주율 파이 | 3.141592653589793 |
| `Math.abs(-3)` | 절댓값 | 3 |
| `Math.max(1, 3)` | 둘 중 큰 값 | 3 |
| `Math.min(2, 4)` | 둘 중 작은 값 | 2 |
| `Math.ceil(1.3)` | 소수점 올림 | 2.0 |
| `Math.floor(2.7)` | 소수점 버림 | 2.0 |
| `Math.round(3.8)` | 소수점 반올림 | 4 |
| `Math.random()` | 0.0 이상 1.0 미만 난수 | (매번 다름) |

> 강의와 다른 점: 슬라이드에 `Math.floor(2,7)` 이라고 쉼표로 적혀 있는데 오타예요. `Math.floor(2.7)` (소수점) 이 맞아요. 쉼표로 쓰면 값을 두 개 넘기는 뜻이 되어 컴파일 에러가 나요.

---

## 2. 상수 E, PI 와 절댓값 abs

```java
System.out.println(Math.E);         // 자연상수 e
System.out.println(Math.PI);        // 원주율
System.out.println(Math.abs(-3));   // -3의 절댓값
System.out.println(Math.abs(5));
System.out.println(Math.abs(2.4));
System.out.println(Math.abs(-6.7));
```

- `Math.E`, `Math.PI` : 괄호가 없죠? 메소드가 아니라 **변수(상수)** 라서 그래요. 값이 정해져 있어 바꿀 수 없어요.
- `Math.abs(값)` : **절댓값(absolute value)** 은 "0에서 얼마나 떨어져 있나"예요. 부호를 떼어 낸다고 생각하면 쉬워요.

실행 결과

```
2.718281828459045
3.141592653589793
3
5
2.4
6.7
```

`abs(-3)` 은 `3`, `abs(2.4)` 는 `2.4` 로 나왔어요. **정수를 넣으면 정수, 실수를 넣으면 실수**로 돌려줘요. 같은 이름의 메소드가 자료형별로 여러 개 준비되어 있기 때문이에요(이걸 오버로딩이라고 해요).

> 참고(강의 밖 내용): 강사는 절댓값이 "무조건 양수"라고 했는데, 정확히는 `abs(0)` 은 `0` 이라서 "음수가 아닌 값"이라고 하는 게 맞아요.

---

## 3. max, min 과 세 수 중 최댓값

```java
System.out.println(Math.max(8, 9)); // 9
System.out.println(Math.min(8, 9)); // 8
```

`max` 는 둘 중 큰 수를, `min` 은 둘 중 작은 수를 **돌려줘요(반환해요)**.

그런데 `max` 는 값을 **딱 두 개만** 받아요. 세 수 중 가장 큰 값은 어떻게 구할까요? **max 안에 max 를 또 넣으면** 돼요.

```java
int a = 10, b = 20, c = 30;
System.out.println(Math.max(a, Math.max(b, c)));
```

한 단계씩 풀어 볼게요.

1. 괄호 안쪽부터 계산해요. `Math.max(b, c)` → `Math.max(20, 30)` → `30`
2. 바깥은 `Math.max(a, 30)` → `Math.max(10, 30)` → `30`

실행 결과

```
30
```

이게 가능한 이유는, 메소드가 돌려준 값을 **다른 메소드의 전달값 자리에 바로 넣을 수 있기** 때문이에요. 같은 방식으로 네 개, 다섯 개 수 중 최댓값이나 최솟값도 구할 수 있어요.

> 참고: 강의 중 [06:54] 쯤 강사가 "20이 반환된다"고 했다가 바로 "30"으로 정정해요. 30이 맞아요.

---

## 4. 난수 Math.random()

### 난수란?

**난수(random number)** 는 어떤 값이 나올지 미리 알 수 없는 **무작위 수**예요. 게임에서 주사위 굴리기, 아이템 뽑기, 적의 위치 정하기 같은 데 아주 많이 써요.

### Math.random() 의 범위

```java
System.out.println(Math.random());
```

- 돌려주는 자료형은 **double(실수)** 이에요.
- 범위는 **0.0 이상, 1.0 미만** 이에요. 0.0 은 나올 수 있지만 **1.0 은 절대 안 나와요.**

```
0.0 <= Math.random() < 1.0
```

실행 결과 (실행할 때마다 달라짐)

```
0.8392487558548918
```

### 원하는 범위로 바꾸는 3단계

0.0~1.0 사이 실수는 그대로 쓰기 불편해요. 그래서 **곱하고, 정수로 자르고, 더하는** 세 단계를 거쳐요. 강의에서도 "여기서부터는 개발자의 몫"이라며 직접 공식을 만들어 써요.

**① 곱하기: 범위 넓히기**

```java
Math.random() * 2   // 0.0 이상 2.0 미만
```

**② (int) 형변환: 소수점 버리기**

```java
(int) (Math.random() * 2)   // 0 또는 1
(int) (Math.random() * 4)   // 0, 1, 2, 3 중 하나
(int) (Math.random() * 6)   // 0 ~ 5 중 하나
```

`(int)` 는 4강에서 배운 **형변환**이에요. 실수를 정수로 바꾸면서 소수점 아래를 그냥 버려요. 예를 들어 `5.99` 는 `5` 가 돼요. 그래서 `* 6` 을 하면 0.0~5.999... 가 되고, 소수점을 버리면 **0, 1, 2, 3, 4, 5** 여섯 개 중 하나가 나와요. 곱한 숫자 = 나올 수 있는 경우의 수예요.

**③ 더하기: 시작값 옮기기**

주사위는 1~6 이에요. 0~5 에 1 을 더하면 1~6 이 되죠.

```java
int dice = (int) (Math.random() * 6) + 1;    // 1 ~ 6
int lotto = (int) (Math.random() * 45) + 1;  // 1 ~ 45
```

정리하면 이 공식 하나만 기억하면 돼요.

```
(int) (Math.random() * 개수) + 시작값
```

| 원하는 범위 | 개수 | 시작값 | 코드 |
|---|---|---|---|
| 0, 1 | 2 | 0 | `(int)(Math.random()*2)` |
| 주사위 1~6 | 6 | 1 | `(int)(Math.random()*6)+1` |
| 로또 1~45 | 45 | 1 | `(int)(Math.random()*45)+1` |
| 10~20 (강의 밖 예) | 11 | 10 | `(int)(Math.random()*11)+10` |

실행 결과 예시 (실행할 때마다 달라짐) — `code/RandomExample.java`

```
주사위: 1
로또 번호: 24
주사위 10번: 4 6 5 1 1 1 1 6 3 5 
```

### 괄호 위치가 정말 중요해요

`(int)` 는 **바로 뒤에 붙은 것 하나만** 정수로 바꿔요.

```java
(int) (Math.random() * 6)   // 올바름: 곱한 결과(0.0~5.99)를 정수로
(int) Math.random() * 6     // 틀림: Math.random()(0.0~0.99)을 먼저 정수로 -> 항상 0, 그다음 *6 -> 항상 0
```

실제로 아래쪽 식을 5번 돌려 보면 `0 0 0 0 0` 만 나와요. 에러가 안 나서 더 찾기 어려운 실수예요.

---

## 5. 소수점 처리: ceil, floor, round

```java
System.out.println(Math.ceil(1.3));  // 올림
System.out.println(Math.floor(2.7)); // 버림
System.out.println(Math.round(3.8)); // 반올림
```

실행 결과

```
2.0
2.0
4
```

- `ceil` (천장, ceiling) : 위로 올려요. 1.3 → 2.0
- `floor` (바닥) : 아래로 내려요. 2.7 → 2.0
- `round` (둥글게) : 반올림해요. 3.8 → 4

이름을 "천장으로 올라간다 / 바닥으로 내려간다"로 외우면 안 헷갈려요.

왜 `ceil`, `floor` 는 `2.0` 처럼 소수점이 붙고 `round` 는 `4` 로 나올까요? **돌려주는 자료형이 달라서**예요. `ceil`, `floor` 는 double 을, `round` 는 double 을 넣으면 **long(큰 정수)** 을 돌려줘요. 그래서 `int r = Math.round(3.8);` 처럼 int 에 바로 담으면 에러가 나요(자주 하는 실수 참고).

> 참고(강의 밖 내용): 음수에서는 방향을 조심해요. `Math.ceil(-1.5)` 는 `-1.0`, `Math.floor(-1.5)` 는 `-2.0` 이에요. "올림 = 더 큰 쪽(오른쪽)", "버림 = 더 작은 쪽(왼쪽)"이에요. 또 `Math.round(2.5)` 는 `3`, `Math.round(-2.5)` 는 `-2` 예요(정확히 .5 일 때는 더 큰 쪽으로 가요).

---

## 6. Calendar 클래스: 오늘 날짜와 시간 알아내기

### import 가 필요해요

Math 와 달리 Calendar 는 `java.util` 패키지에 있어요. `java.lang` 이 아니니까 **파일 맨 위에 import 를 꼭 써야** 해요. **import** 는 "다른 폴더(패키지)에 있는 이 클래스를 가져다 쓸게요"라는 선언이에요. 이클립스에서는 `Calendar` 를 치고 Ctrl+Space 로 자동완성하면 import 줄이 저절로 생겨요.

```java
import java.util.Calendar;
```

### Calendar 객체 받기: getInstance()

```java
Calendar cal = Calendar.getInstance();
```

- `Calendar.getInstance()` : 지금 이 순간 **컴퓨터(시스템)의 날짜와 시간 정보를 통째로 담은 Calendar** 를 만들어 돌려줘요. `getInstance` 가 static 메소드라서 클래스 이름으로 바로 불러요.
- 그걸 `cal` 이라는 변수에 담아 둬요. 비유하면 **"지금 이 순간을 찍은 달력 사진"** 을 한 장 받아 둔 거예요.

Calendar 는 `new Calendar()` 로 만들 수 없어요. 직접 new 하면 `Calendar is abstract; cannot be instantiated` 에러가 나요. (abstract, 즉 추상 클래스는 19강에서 배워요. 지금은 "Calendar 는 getInstance 로 받는다"만 기억하면 돼요.)

### get(항목) 으로 하나씩 꺼내기

사진(cal)에서 원하는 정보 하나를 꺼낼 때는 `cal.get(Calendar.항목)` 을 써요. 괄호 안의 `Calendar.YEAR` 같은 건 "어떤 항목을 꺼낼지" 알려 주는 **static 상수(이름표)** 예요.

```java
System.out.println(cal.get(Calendar.YEAR));         // 년
System.out.println(cal.get(Calendar.MONTH));        // 월 (0부터!)
System.out.println(cal.get(Calendar.MONTH) + 1);    // 사람이 쓰는 월
System.out.println(cal.get(Calendar.DATE));         // 일
System.out.println(cal.get(Calendar.HOUR));         // 시 (12시간 기준)
System.out.println(cal.get(Calendar.HOUR_OF_DAY));  // 시 (24시간 기준)
System.out.println(cal.get(Calendar.MINUTE));       // 분
System.out.println(cal.get(Calendar.SECOND));       // 초
System.out.println(cal.get(Calendar.DAY_OF_WEEK));  // 요일 (1=일 ~ 7=토)
```

강의 화면의 실행 결과 (강의 녹화 시점: 2023년 1월 21일 토요일 오후 2시쯤)

```
2023
0
1
21
2
14
0
52
7
```

한 줄씩 해석하면 이래요.

| 출력 | 항목 | 뜻 |
|---|---|---|
| 2023 | YEAR | 2023년 |
| 0 | MONTH | **1월인데 0** 이 나왔어요 |
| 1 | MONTH + 1 | 1을 더해야 1월 |
| 21 | DATE | 21일 |
| 2 | HOUR | 12시간 기준 2시 |
| 14 | HOUR_OF_DAY | 24시간 기준 14시 (= 오후 2시) |
| 0 / 52 | MINUTE / SECOND | 0분 52초 |
| 7 | DAY_OF_WEEK | 7 = 토요일 |

이 값은 **실행 시점에 따라 달라져요.** 여러분이 돌리면 그날의 날짜와 시각이 나와요.

### 가장 중요한 함정: MONTH 는 0부터 시작해요

| 실제 월 | 1월 | 2월 | 3월 | ... | 6월 | ... | 12월 |
|---|---|---|---|---|---|---|---|
| `get(Calendar.MONTH)` | **0** | 1 | 2 | ... | 5 | ... | **11** |

배열 인덱스가 0부터 시작했던 것처럼, Calendar 의 월도 0부터 세요. 그래서 3월에 돌리면 2, 12월에 돌리면 11 이 나와요.

개발자는 이 규칙을 알지만, 프로그램을 쓰는 사람은 5월인데 화면에 "4월"이 나오면 당황하겠죠. 그래서 화면에 보여 줄 때는 **`+ 1` 을 해 주는 게 보통**이에요. 강사는 "+1 은 선택사항"이라고 했지만, 사람에게 보여 주는 월이라면 사실상 꼭 해야 해요.

반대로 Calendar 에 월을 **넣을 때도** 0부터예요. (참고, 강의 밖) `cal.set(2024, 2, 1)` 은 2024년 **3월** 1일이에요.

### HOUR 와 HOUR_OF_DAY

- `HOUR` : 12시간 기준 (0~11). 오후 2시면 `2`.
- `HOUR_OF_DAY` : 24시간 기준 (0~23). 오후 2시면 `14`.

`HOUR` 만 보면 오전 2시인지 오후 2시인지 알 수 없으니, 보통은 `HOUR_OF_DAY` 를 많이 써요.

### DAY_OF_WEEK: 요일은 숫자로 나와요

| 숫자 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|---|---|---|---|---|---|---|---|
| 요일 | 일 | 월 | 화 | 수 | 목 | 금 | 토 |

일요일이 1 이에요(월요일이 아니에요). 강사 말처럼 이 숫자로 조건문을 만들면 "토요일" 같은 글자로 바꿔 보여 줄 수 있어요. `code/CalendarExample.java` 에서는 배열로 바꿔 봤어요.

```java
String[] names = {"", "일", "월", "화", "수", "목", "금", "토"};
System.out.println(names[cal.get(Calendar.DAY_OF_WEEK)] + "요일");
```

배열 0번 칸을 빈 문자열로 비워 둔 이유는, 요일 숫자가 1부터 시작해서 `names[1]` 이 "일" 이 되게 맞추려는 거예요.

> 참고(강의 밖 내용): Calendar 는 아주 오래된(자바 1.1 시절) 기능이에요. 월이 0부터 시작하는 것처럼 헷갈리는 점이 많아서, 요즘 자바(8 이상)에서는 `java.time` 패키지의 `LocalDate`, `LocalDateTime` 을 주로 써요. 예를 들어 `LocalDate.now().getMonthValue()` 는 1월이면 **1** 을 돌려줘요. 강의 내용은 Calendar 로 익히고, 나중에 실무 코드를 보면 이쪽도 있다는 것만 알아 두세요.

---

## 7. GregorianCalendar 와 윤년 판별

**GregorianCalendar** 는 우리가 지금 쓰는 달력(그레고리력)을 다루는 클래스예요. Calendar 의 기능을 이어받았고(15강의 상속), Calendar 와 달리 **new 로 객체를 만들어서** 써요. 이것도 `java.util` 에 있어서 import 가 필요해요.

```java
import java.util.GregorianCalendar;
```

```java
GregorianCalendar now = new GregorianCalendar();
if (now.isLeapYear(2023)) {
    System.out.println("2023: 윤년");
} else {
    System.out.println("2023: 평년");
}
```

- `new GregorianCalendar()` : 현재 날짜 정보를 가진 객체를 만들어 `now` 에 담아요.
- `isLeapYear(연도)` : 매개변수는 int(연도), 리턴형은 **boolean** 이에요. 윤년이면 `true`, 아니면 `false`.
- 결과가 boolean 이니까 **if 문 조건에 그대로** 넣을 수 있어요. 그래서 강사도 if 와 같이 썼어요.

**윤년**은 2월이 29일까지 있는 해(1년이 366일), **평년**은 2월이 28일까지인 보통 해예요.

실행 결과 — `code/LeapYearExample.java`

```
2023: 평년
2020: 윤년
1900: 평년
2000: 윤년
2024: 윤년
```

> 참고(강의 밖 내용): 강의에서는 "4년마다 한 번 윤년"이라고 했는데, 정확한 규칙에는 예외가 있어요. 4로 나누어떨어지면 윤년, 단 100으로 나누어떨어지면 평년, 그래도 400으로 나누어떨어지면 윤년이에요. 그래서 1900년은 평년, 2000년은 윤년이에요. `isLeapYear()` 는 이 규칙을 알아서 지켜 줘요. 직접 계산하지 말고 이 메소드를 쓰는 게 안전한 이유예요.

---

## 8. 프로젝트: 주민번호로 출생연도, 나이, 성별 구하기

강의 끝에 강사가 과제 아이디어를 줘요. 조건은 이래요.

- 주민번호 앞 두 자리 `19`, 성별코드(뒷자리 첫 숫자) `3`
- 성별코드 1, 2 → 1900년대생 / 3, 4 → 2000년대생
- 나이 = 올해 연도 − 태어난 연도
- 성별: 1 또는 3 → 남자, 2 또는 4 → 여자

여기서 포인트는 **"올해 연도"를 코드에 숫자로 박지 말고 Calendar 로 가져오는 것**이에요. 나이는 해마다 바뀌니까, `2023` 처럼 직접 적으면 내년에는 틀린 프로그램이 돼요.

```java
int thisYear = Calendar.getInstance().get(Calendar.YEAR);
```

`Calendar.getInstance()` 가 돌려준 Calendar 에 바로 `.get(...)` 을 이어 붙였어요. 변수에 담지 않고 한 번만 쓸 때 이렇게 줄여 쓸 수 있어요.

성별은 강사 힌트처럼 `||`(또는) 로 `code == 1 || code == 3` 이라고 써도 되고, "1, 3 은 홀수, 2, 4 는 짝수"라는 점을 이용해 `code % 2 == 1` 로 써도 돼요.

`code/AgeProject.java` 실행 결과 (2026년에 실행, **실행하는 해에 따라 나이가 달라짐**)

```
태어난 연도: 2019
나이: 7살 (올해 2026년 기준)
성별: 남자
```

> 참고(강의 밖 내용): "올해 − 태어난 해"는 생일을 따지지 않는 **연 나이**예요. 생일이 지났는지까지 따지는 만 나이를 구하려면 월과 일도 비교해야 해요.

---

## 자주 하는 실수

| 증상 / 에러 메시지 (javac 실제 출력) | 원인 | 해결 |
|---|---|---|
| `cannot find symbol` / `symbol: class Calendar` | `import java.util.Calendar;` 를 안 썼어요 | 파일 맨 위에 import 를 써요. GregorianCalendar 도 마찬가지 |
| `Calendar is abstract; cannot be instantiated` | `new Calendar()` 로 만들려고 했어요 | `Calendar.getInstance()` 로 받아요 |
| `Math() has private access in Math` | `new Math()` 로 객체를 만들려고 했어요 | Math 는 객체 없이 `Math.abs(...)` 처럼 바로 써요 |
| `incompatible types: possible lossy conversion from long to int` | `int r = Math.round(3.8);` — round 는 long 을 돌려줘요 | `long r = ...` 로 받거나 `(int) Math.round(3.8)` 로 형변환해요 |
| 에러는 없는데 난수가 항상 0 (주사위면 항상 1) | `(int) Math.random() * 6` 처럼 괄호를 빠뜨렸어요 | `(int) (Math.random() * 6)` 처럼 곱셈 전체를 괄호로 묶어요 |
| 1월인데 월이 0 으로 나와요 | `Calendar.MONTH` 는 0부터 시작해요 | 화면에 보여 줄 때 `+ 1` 해요 |
| 주사위에 0 이 나오거나 6 이 안 나와요 | `+ 1` 을 빼먹었거나 곱하는 수를 5 로 썼어요 | `(int)(Math.random() * 개수) + 시작값` 공식대로 써요 |
| 오후 2시인데 시가 2 로 나와요 | `HOUR` 는 12시간 기준이에요 | 24시간 기준은 `HOUR_OF_DAY` 를 써요 |

---

## 시간대별 목차

- [00:00] 강의 목표: Math 로 수학 기능, Calendar 로 날짜 정보
- [00:30] 이론 요약 1: Math 클래스는 java.lang, 메소드가 모두 static
- [01:09] 이론 요약 2: Calendar 는 getInstance(), GregorianCalendar 는 new 로 생성
- [02:11] 실습 준비 (oop17 패키지, Test01_Math 클래스)
- [02:26] 자동완성의 빨간 S = static, Math.E 와 Math.PI 출력
- [03:32] 절댓값 Math.abs()
- [04:34] Math.max(), Math.min()
- [05:17] 세 수 중 최댓값: max 안에 max 넣기
- [08:04] 난수의 뜻과 범위 (0.0 이상 1.0 미만)
- [09:13] Math.random() 출력, 실행할 때마다 다른 값
- [10:39] 곱하기로 범위 넓히기
- [11:48] (int) 형변환으로 정수만 취하기 (0, 1)
- [12:31] 곱하기 4, 곱하기 6 일 때 나오는 범위
- [13:43] 주사위 1~6: 곱하기 6 더하기 1
- [14:57] 로또 번호 1~45
- [15:54] Math.ceil(), Math.floor(), Math.round()
- [16:46] Calendar 실습 시작, import java.util.Calendar
- [17:34] Calendar.getInstance() 로 현재 날짜 정보 가져오기
- [18:18] 연도 YEAR
- [18:57] 월 MONTH, 0부터 시작하는 주의사항과 +1
- [20:59] 일 DATE
- [21:13] 시 HOUR, HOUR_OF_DAY(24시간 기준)
- [22:11] 분 MINUTE, 초 SECOND
- [22:39] 요일 DAY_OF_WEEK (토요일 = 7)
- [23:28] GregorianCalendar 와 import
- [24:27] isLeapYear() 로 윤년/평년 판별 (2023, 2020)
- [25:58] 프로젝트 설명: 주민번호로 출생연도, 나이, 성별
- [27:05] 강의 정리

---

## 용어 정리

| 용어 | 쉬운 뜻 |
|---|---|
| Math 클래스 | 수학 계산 메소드를 모아 둔 자바 기본 클래스. 객체 없이 `Math.이름` 으로 써요 |
| java.lang | import 없이 자동으로 쓸 수 있는 기본 패키지 (String, Math 등) |
| java.util | 날짜, 컬렉션 같은 유용한 도구가 든 패키지. import 가 필요해요 |
| import | "다른 패키지의 이 클래스를 가져다 쓸게요"라는 선언 |
| 상수 | 값이 정해져 있어 바꿀 수 없는 변수 (`Math.PI`, `Calendar.YEAR` 등) |
| 절댓값 (abs) | 0에서 떨어진 거리. 부호를 뗀 값 |
| 난수 (random) | 미리 알 수 없는 무작위 수 |
| 형변환 `(int)` | 실수를 정수로 바꾸기. 소수점 아래는 버려요 |
| ceil / floor / round | 올림 / 버림 / 반올림 |
| long | int 보다 훨씬 큰 범위의 정수 자료형. `Math.round()` 의 결과형 |
| Calendar | 날짜와 시간 정보를 다루는 클래스. `getInstance()` 로 받아요 |
| getInstance() | 현재 날짜·시간이 담긴 Calendar 를 만들어 돌려주는 static 메소드 |
| get(항목) | Calendar 에서 년, 월 같은 항목 하나를 꺼내는 메소드 |
| GregorianCalendar | 그레고리력(지금 쓰는 달력)을 다루는 클래스. new 로 만들어요 |
| isLeapYear() | 윤년이면 true, 평년이면 false 를 돌려주는 메소드 |
| 윤년 / 평년 | 2월이 29일까지 있는 해 / 2월이 28일까지인 보통 해 |
| java.time (강의 밖) | Calendar 를 대신하는 요즘 날짜 API. LocalDate 등 |
