# 21강. Java Collection Framework 및 제네릭

## 이 강의에서 배우는 것

- 여러 데이터를 한 곳에 모아 두는 도구 모음인 **컬렉션 프레임워크**가 무엇인지 알아봐요.
- 컬렉션의 세 가지 형태 **List / Set / Map** 의 차이(순서가 있나? 중복이 되나? 이름표가 있나?)를 익혀요.
- `add`, `get`, `size`, `remove`, `isEmpty`, `put` 같은 자주 쓰는 메소드를 직접 써 봐요.
- `ArrayList<String>` 처럼 꺾쇠 `< >` 를 붙이는 **제네릭**이 왜 필요한지(잘못된 자료형이 들어오는 걸 미리 막기) 이해해요.
- 우리가 직접 만든 클래스(`Mountain`)도 제네릭에 넣어 모을 수 있다는 걸 확인해요.

> 앞에서 배운 것 잠깐 떠올리기: 배열(9강)은 처음 만들 때 칸 수가 정해지고 한 가지 자료형만 담았어요. 클래스와 객체, `new`, 생성자, 인터페이스와 다형성(부모 타입 변수에 자식 객체 담기)은 앞 강의들에서 배웠어요. 이번 강의는 그 위에 올라가요.

---

## 1. 컬렉션 프레임워크란?

**컬렉션(collection)** 은 "모음"이라는 뜻이에요. **컬렉션 프레임워크(Collection Framework)** 는 여러 개의 데이터나 객체를 모아 두고 꺼내 쓰기 위해 자바가 미리 만들어 둔 **인터페이스와 클래스들을 통틀어 부르는 말**이에요.

배열도 여러 값을 모으지만 불편한 점이 있었죠.

- 배열은 만들 때 크기를 정해야 하고, 나중에 늘릴 수 없어요.
- 컬렉션은 `add` 할 때마다 **알아서 늘어나요.** 지울 때도 메소드 하나면 돼요.

비유하자면 배열은 **칸 수가 정해진 달걀판**, 컬렉션은 **넣는 만큼 늘어나는 장바구니**예요.

컬렉션에는 세 가지 큰 형태가 있어요. 각각 **인터페이스**(규칙)가 있고, 그 규칙을 실제로 구현한 **클래스**가 있어요.

| 인터페이스 | 강의에 나온 구현 클래스 | 특징 |
|---|---|---|
| `List` | `Vector`, `ArrayList` | 넣은 **순서**대로 보관. 0번, 1번… 번호로 접근 |
| `Set` | `HashSet`, `TreeSet`, `EnumSet` | **같은 요소는 한 번만** 들어감 |
| `Map` | `HashMap`, `Hashtable`, `Properties` | **Key(이름표) + Value(값)** 한 쌍으로 보관 |

이 클래스들은 모두 `java.util` 패키지에 들어 있어서, 쓰려면 파일 맨 위에 `import java.util.ArrayList;` 처럼 **import** 를 꼭 써야 해요. (Eclipse 에서는 클래스 이름을 쓰고 Ctrl+Space 를 누르면 자동으로 넣어 줘요.)

> **강의와 다른 점**: 강의에서는 "List 를 **상속**받아 구현한 클래스"라고 말해요. 정확히는 클래스가 인터페이스를 **구현(implements)** 한다고 해요. 또 `Map` 은 `List`, `Set` 과 같은 `Collection` 인터페이스 가족이 아니라 따로 떨어진 인터페이스예요. 다만 보통 셋을 묶어서 "컬렉션 프레임워크"라고 불러요.

---

## 2. List 계열: 순서가 있는 모음

### 2-1. Vector 로 연습하기

`List` 는 **넣은 순서가 그대로 유지**되고, 그 순서를 **0번부터 시작하는 번호(인덱스)** 로 꺼낼 수 있어요. 배열과 거의 같은 느낌으로 쓸 수 있죠.

강의는 처음에 제네릭(`< >`) 없이 연습해요. 제네릭 없이 만들면 **아무 자료형이나** 섞어서 넣을 수 있어요.

```java
Vector vec = new Vector();
vec.add(3);         // 정수
vec.add(2.4);       // 실수
vec.add('R');       // 문자
vec.add("KOREA");   // 문자열
vec.add(5);
vec.add(6.7);

System.out.println(vec.size());   // 요소의 개수
System.out.println(vec.get(0));   // 0번째 요소
```

- `Vector vec = new Vector();` : Vector 객체를 하나 만들어요. 아직 아무것도 안 들어 있어요.
- `vec.add(3);` : 맨 뒤에 3을 넣어요. 이렇게 하나하나 들어간 값을 **요소(element)** 라고 불러요.
- `vec.size()` : 지금 들어 있는 요소의 개수를 돌려줘요. 배열의 `length` 와 비슷해요.
- `vec.get(0)` : 0번째 요소를 꺼내요.

실행 결과:

```
6
3
```

강사는 "변수명 쓰고 **점(.)을 눌러서** 어떤 메소드가 있는지 이름과 설명을 보고 골라 쓰라"고 강조해요. 메소드를 다 외우는 게 아니라, 이름을 보고 뜻을 짐작해서 쓰는 습관을 들이라는 뜻이에요.

> **강의와 다른 점**: 강의 화면은 `vec.add(new Integer(5));`, `vec.add(new Double(6.7));` 처럼 썼어요. 이 방식은 지금 자바에서 **없어질 예정(deprecated)** 이라, JDK 21 로 컴파일하면 아래 경고가 나와요(직접 확인).
> ```
> warning: [removal] Integer(int) in Integer has been deprecated and marked for removal
> ```
> 그냥 `vec.add(5);` 라고 쓰면 자바가 알아서 `Integer` 로 바꿔 넣어 줘요. 그래서 code 폴더 예제는 이렇게 고쳤어요.

### 2-2. 반복문으로 전부 꺼내기

번호가 0부터 `size() - 1` 까지 있으니 `for` 문으로 처음부터 끝까지 꺼낼 수 있어요.

```java
for (int i = 0; i < vec.size(); i++) {
    System.out.println(vec.get(i));
}
```

- `i` 는 0부터 시작해서 `size()` **직전**까지 1씩 늘어나요. 요소가 6개면 0~5번까지 돌아요.

실행 결과:

```
3
2.4
R
KOREA
5
6.7
```

### 2-3. 지우기와 비었는지 확인하기

```java
vec.remove(0);                  // 0번째 요소 삭제
System.out.println(vec.size()); // 6개 -> 5개

vec.removeAllElements();        // 요소 전부 삭제

if (vec.isEmpty()) {
    System.out.println("비어있다");
} else {
    System.out.println("비어 있지 않다");
}
```

- `remove(0)` : 0번째 요소를 지워요. 뒤에 있던 요소들이 한 칸씩 앞으로 당겨져요.
- `removeAllElements()` : Vector 의 요소를 전부 지워요.
- `isEmpty()` : 비어 있으면 `true`, 아니면 `false` 를 돌려줘요. `true/false` 를 돌려주니까 `if` 조건에 바로 쓸 수 있어요.

실행 결과:

```
5
비어있다
```

> 참고(강의 밖 내용): `removeAllElements()` 는 Vector 에만 있는 옛 메소드예요. 모든 List 에서 공통으로 쓰는 이름은 `clear()` 예요.

### 2-4. 다형성으로 만들기: `List list = new ArrayList();`

```java
List list = new ArrayList();
list.add(2);
list.add(4.6);
list.add('r');
list.add("SEOUL");
list.add(7L);       // long 형 7
System.out.println(list.size());
```

- `List` 는 인터페이스(규칙), `ArrayList` 는 그 규칙을 구현한 클래스예요. **부모 타입 변수에 자식 객체를 담는 다형성**을 쓴 거예요.
- 이렇게 써 두면 나중에 `new ArrayList()` 를 `new Vector()` 로 바꿔도 나머지 코드는 그대로 둘 수 있어요. 그래서 실무에서도 이 모양을 많이 써요.
- `ArrayList` 도 같은 List 가족이라 `add`, `size`, `get` 같은 메소드 이름이 똑같아요.

실행 결과:

```
5
```

주의: `List` 를 import 할 때는 꼭 **`java.util.List`** 를 골라야 해요. Ctrl+Space 를 누르면 `java.awt.List` 같은 이름이 같은 다른 것도 뜨는데, 그걸 고르면 엉뚱하게 동작해요.

> 참고(강의 밖 내용): `Vector` 와 `ArrayList` 는 쓰는 법이 거의 같아요. 요즘은 보통 `ArrayList` 를 써요. (Vector 는 여러 작업이 동시에 접근할 때를 대비한 장치가 들어 있어 조금 느려요.)

전체 코드: `code/ListTest.java`

---

## 3. Set 계열: 중복 없는 주머니

`Set` 은 **같은 값을 두 번 넣어도 하나만 남는** 모음이에요. 그리고 `HashSet` 은 **넣은 순서를 기억하지 않아요.** 그래서 `get(0)` 처럼 번호로 꺼내는 메소드가 없어요.

비유: 출석부 도장. 같은 사람이 두 번 와도 "출석"은 한 번만 찍혀요.

```java
HashSet set = new HashSet();
set.add(3);
set.add(2.4);
set.add("KOREA");
set.add('R');
set.add(7);
System.out.println(set.size());
```

실행 결과:

```
5
```

강의는 중복을 직접 넣어 보지는 않았어요. 그래서 확인용으로 한 줄 더 해 봤어요.

> 참고(강의 밖 내용): 이미 들어 있는 값을 또 `add` 하면 들어가지 않고 `false` 를 돌려줘요.
> ```java
> boolean added = set.add(3);   // 3은 이미 있음
> System.out.println("3을 또 넣었나? " + added);
> System.out.println("개수: " + set.size());
> ```
> ```
> 3을 또 넣었나? false
> 개수: 5
> ```

> **강의와 다른 점**: 강의는 "Set 계열은 순서가 없다"고 정리해요. `HashSet` 은 맞아요. 하지만 Set 가족 중 `TreeSet` 은 값을 **크기 순으로 정렬**해서 보관하고, `LinkedHashSet` 은 **넣은 순서**를 기억해요. 그래서 "Set 의 핵심 특징은 **중복이 없다**는 것, HashSet 은 순서를 보장하지 않는다"로 기억하는 게 정확해요.

`HashSet` 을 `System.out.println(set);` 으로 통째로 찍으면 순서가 넣은 순서와 다르게 나올 수 있어요. 그 순서는 **보장되지 않으니** 결과를 외우지 마세요.

---

## 4. Map 계열: 이름표를 붙여 보관하기

`Map` 은 값마다 **이름표(Key)** 를 붙여서 보관해요. 꺼낼 때는 번호가 아니라 **이름표로** 꺼내요.

비유: 사물함. 사물함 번호표(Key)를 알면 그 안의 물건(Value)을 바로 꺼낼 수 있어요. 같은 번호표가 두 개 있으면 안 되겠죠? 그래서 **Key 는 중복되면 안 돼요.**

```java
HashMap map = new HashMap();
map.put("one", 3);
map.put("two", 2.4);
map.put("three", "SEOUL");

System.out.println(map.size());
System.out.println(map.get("three"));
```

- `map.put("one", 3);` : 앞이 Key(이름표), 뒤가 Value(값)예요. 3이라는 값에 "one" 이라는 이름표를 붙여 넣는다는 뜻이에요. Map 은 `add` 가 아니라 **`put`** 으로 넣어요.
- `map.size()` : 몇 쌍이 들어 있는지 알려 줘요.
- `map.get("three")` : "three" 이름표가 붙은 값을 꺼내요.

실행 결과:

```
3
SEOUL
```

> 참고(강의 밖 내용): 이미 있는 Key 로 또 `put` 하면 새 쌍이 생기는 게 아니라 **값이 덮어써져요.** 없는 Key 로 `get` 하면 `null`(아무것도 없음)이 나와요. 아래는 직접 돌려 본 결과예요.
> ```java
> map2.put("one", "A");
> map2.put("one", "B");          // 같은 Key -> 덮어쓰기
> System.out.println(map2.get("one") + " " + map2.size() + " " + map2.get("zzz"));
> ```
> ```
> B 1 null
> ```

> **강의와 다른 점**: 받아쓰기에는 Key 를 "1, 2, 3" 으로 준다고 나오지만, 실제 화면 코드는 `"one"`, `"two"`, `"three"` 문자열이었어요. 노트는 화면을 따랐어요. 또 강의는 "Map 도 순서가 없다"고 하는데 `HashMap` 은 맞고, `TreeMap`(Key 정렬)이나 `LinkedHashMap`(넣은 순서 유지)은 순서가 있어요.

전체 코드: `code/SetMapTest.java`

---

## 5. List / Set / Map 한눈에 비교

| 구분 | List | Set | Map |
|---|---|---|---|
| 대표 클래스 | `ArrayList`, `Vector` | `HashSet` | `HashMap` |
| 순서 | 넣은 순서 유지 | HashSet 은 보장 안 됨 | HashMap 은 보장 안 됨 |
| 중복 | 허용 | 허용 안 함 | Key 는 허용 안 함, Value 는 허용 |
| 넣기 | `add(값)` | `add(값)` | `put(키, 값)` |
| 꺼내기 | `get(번호)` | 번호로 꺼내는 메소드 없음 | `get(키)` |
| 개수 | `size()` | `size()` | `size()` |
| 비유 | 번호 매긴 줄 서기 | 출석 도장 | 사물함과 번호표 |

같은 값 "사과, 바나나, 사과" 를 각각 넣어 봤어요(참고, 강의 밖 확인용 코드).

```java
HashSet<String> s = new HashSet<>();
s.add("사과"); s.add("바나나"); s.add("사과");
System.out.println(s.size());

List<String> l = new ArrayList<>();
l.add("사과"); l.add("바나나"); l.add("사과");
System.out.println(l.size() + " " + l);
```

실행 결과:

```
2
3 [사과, 바나나, 사과]
```

Set 은 "사과"가 한 번만 들어가서 2개, List 는 넣은 그대로 3개예요.

---

## 6. 제네릭(Generic): 이 상자엔 이것만!

### 6-1. 왜 필요할까?

지금까지는 `< >` 없이 써서 정수, 실수, 문자열이 한 상자에 섞여 들어갔어요. 편해 보이지만 문제가 있어요.

- 꺼낼 때 무엇이 나올지 몰라요. 그래서 자바는 꺼낸 값을 그냥 `Object`(모든 것의 부모)로 돌려줘요.
- 문자열만 넣으려 했는데 실수로 숫자를 넣어도 **컴파일할 때 아무도 안 알려 줘요.** 나중에 실행 중에 문제가 터져요.

실제로 제네릭 없이 만든 리스트에서 꺼낸 값을 `String` 변수에 바로 담으면 컴파일 에러가 나요(직접 확인).

```java
ArrayList raw = new ArrayList();
raw.add("hi");
String s = raw.get(0);   // 에러
```
```
error: incompatible types: Object cannot be converted to String
```

**제네릭**은 상자에 **"이 상자엔 String 만"** 하고 라벨을 붙이는 거예요. 비유하자면 **분리수거함**이에요. "캔" 이라고 써 붙인 통에 플라스틱을 넣으려 하면 바로 막아 주는 거죠. 잘못된 자료형이 들어오는 걸 **실행하기 전, 코드를 쓰는 순간** 잡아 줘서 이걸 **타입 안전(type safety)** 이라고 해요.

### 6-2. 기호 읽는 법

| 기호 | 뜻 | 예 |
|---|---|---|
| `<E>` | Element(요소)의 자료형 | `Vector<String>`, `ArrayList<Integer>`, `HashSet<Double>`, `ArrayList<Mountain>` |
| `<K, V>` | Key 의 자료형, Value 의 자료형 | `HashMap<String, String>` |

Eclipse 에서 `ArrayList` 를 자동 완성하면 `ArrayList<E>` 처럼 뜨는데, 그 `E` 자리에 원하는 **클래스 이름**을 써 넣으면 돼요.

### 6-3. 써 보기

```java
Vector<String> vec = new Vector<String>();
vec.add("KOREA");
vec.add("대한민국");
vec.add(new String("SEOUL"));
// vec.add(3);     에러: String 이 아님
// vec.add(2.4);   에러
System.out.println(vec);
```

- `Vector<String>` : "이 Vector 에는 String 만 담는다"는 선언이에요.
- `vec.add(3);` 을 쓰면 Eclipse 가 바로 빨간 줄을 그어요. 실제 컴파일 에러 문구(직접 확인):

```
error: incompatible types: int cannot be converted to String
```

실행 결과:

```
[KOREA, 대한민국, SEOUL]
```

(`System.out.println(리스트)` 처럼 통째로 찍으면 `[ ]` 안에 쉼표로 나열돼요.)

나머지 세 가지도 똑같은 원리예요.

```java
ArrayList<Integer> list = new ArrayList<>();
list.add(2);
list.add(4);
// list.add("");    에러
// list.add(1.3);   에러

HashSet<Double> set = new HashSet<>();
set.add(6.7);
set.add(8.9);
// set.add(5);      에러: 5는 정수라 Double 이 아님

HashMap<String, String> map = new HashMap<>();
map.put("one", "오필승");
map.put("two", "코리아");
// map.put("", 3);    에러: Value 가 String 이 아님
// map.put("", 4.5);  에러
```

- `new ArrayList<>()` : 오른쪽 꺾쇠를 비워 두면 왼쪽을 보고 자바가 알아서 채워요. 이 빈 꺾쇠를 **다이아몬드(<>)** 라고 불러요.
- `set.add(5);` 가 에러인 이유: `5` 는 정수(int)라서 `Double` 상자에 못 들어가요. `5.0` 이라고 써야 해요. 에러 문구(직접 확인): `error: incompatible types: int cannot be converted to Double`

실행 결과 (예제 파일 기준):

```
[2, 4]
2
오필승코리아
```

> **강의와 다른 점**: 강의에서 "앞에 제네릭을 써 주면 **뒤에는 써도 되고 안 써도 상관없다**"고 해요. 오른쪽에 `<>` 를 **아예 빼고** `new HashSet()` 이라고 쓰면 컴파일은 되지만 "제네릭 없는 옛날 방식(raw type)"이 섞여서 경고 안내가 나와요. 오른쪽은 **`new HashSet<>()` 처럼 빈 꺾쇠라도 꼭 붙이세요.**

### 6-4. 기본형은 못 써요: `int` 대신 `Integer`

제네릭 자리에는 **클래스(참조형)만** 올 수 있어요. `int`, `double`, `char` 같은 **기본형은 안 돼요.** 대신 기본형을 감싼 클래스(**래퍼 클래스**)를 써요.

| 기본형 | 제네릭에 쓸 클래스 |
|---|---|
| `int` | `Integer` |
| `double` | `Double` |
| `char` | `Character` |
| `long` | `Long` |
| `boolean` | `Boolean` |

`ArrayList<int>` 라고 쓰면 나오는 에러(직접 확인):

```
error: unexpected type
  required: reference
  found:    int
```

"참조형(reference)이 필요한데 int 가 왔다"는 뜻이에요. 그래도 `list.add(2);` 처럼 그냥 숫자를 넣는 건 괜찮아요. 자바가 2를 `Integer` 로 자동으로 감싸 주거든요.

### 6-5. 내가 만든 클래스도 제네릭에

```java
public class Mountain {
    String name;    // 산 이름
    int height;     // 산 높이

    public Mountain() {}
    public Mountain(String name, int height) {
        this.name = name;
        this.height = height;
    }
}
```

```java
Mountain m1 = new Mountain("한라산", 1950);
Mountain m2 = new Mountain("북한산", 1200);
Mountain m3 = new Mountain("설악산", 1300);

ArrayList<Mountain> item = new ArrayList<Mountain>();
item.add(m1);
item.add(m2);
item.add(m3);
// item.add("");   에러: Mountain 이 아님
// item.add(3);    에러
```

- `ArrayList<Mountain>` : 산 객체만 담는 리스트예요. 문자열이나 숫자는 못 들어가요.

강의는 여기서 담기까지만 해요. 꺼내 보는 부분을 붙여 볼게요.

> 참고(강의 밖 내용): 제네릭 덕분에 `get` 으로 꺼낸 값이 처음부터 `Mountain` 이라, 형변환 없이 `.name` 을 바로 쓸 수 있어요.
> ```java
> for (int i = 0; i < item.size(); i++) {
>     Mountain m = item.get(i);
>     System.out.println(m.name + " " + m.height + "m");
> }
> ```
> ```
> 한라산 1950m
> 북한산 1200m
> 설악산 1300m
> ```

전체 코드: `code/GenericTest.java`, `code/Mountain.java`

---

## 7. 제네릭 없이 쓴 코드를 컴파일하면 나오는 안내

`ListTest.java`, `SetMapTest.java` 는 강의 흐름대로 제네릭 없이 썼어요. 그래서 컴파일하면 아래 안내가 떠요(직접 확인).

```
Note: Some input files use unchecked or unsafe operations.
Note: Recompile with -Xlint:unchecked for details.
```

이건 **에러가 아니라 안내(Note)** 예요. 클래스 파일은 정상으로 만들어지고 실행도 돼요. "자료형 검사를 못 하는 위험한 방식을 쓰고 있다"는 뜻이니, 실제로 코드를 짤 때는 제네릭을 붙이는 게 좋아요. 강사도 제네릭 없는 방식은 "쓰지 말라고 하는 옛날 방식"이라고 말해요.

---

## 자주 하는 실수

| 실수 | 결과 | 고치는 법 |
|---|---|---|
| `import java.util.ArrayList;` 를 빼먹음 | `error: cannot find symbol` / `symbol: class ArrayList` (직접 확인) | 맨 위에 import 추가. Eclipse 는 Ctrl+Space |
| `List` 를 import 할 때 `java.awt.List` 를 고름 | 엉뚱한 클래스라 `add` 등이 기대대로 안 됨 (에러 문구는 확인 안 함) | 반드시 `java.util.List` |
| `ArrayList<int>` 처럼 기본형을 씀 | `error: unexpected type` / `required: reference` / `found: int` (직접 확인) | `ArrayList<Integer>` |
| `HashSet<Double>` 에 `5` 를 넣음 | `error: incompatible types: int cannot be converted to Double` (직접 확인) | `5.0` 으로 쓰기 |
| 없는 번호를 `get` 함 (요소 1개인데 `get(1)`) | 실행 중 `java.lang.IndexOutOfBoundsException: Index 1 out of bounds for length 1` (직접 확인) | 번호는 0 ~ `size()-1` |
| `for` 조건을 `i <= list.size()` 로 씀 | 마지막에 위와 같은 예외 | `i < list.size()` |
| Map 에 같은 Key 로 두 번 `put` | 에러는 없지만 앞의 값이 사라짐 | Key 는 겹치지 않게 |
| `HashSet` 출력 순서를 믿음 | 환경에 따라 순서가 달라질 수 있음 | 순서가 필요하면 List 를 쓰기 |

---

## 시간대별 목차

- [00:00] 강의 소개와 목표
- [00:34] 컬렉션 프레임워크: List, Set, Map 개요
- [00:58] List 계열: 순서가 있고 배열처럼 접근
- [01:48] Set 계열: 같은 요소를 가질 수 없음
- [02:20] Map 계열: Key 와 Value 한 쌍
- [03:12] 제네릭 이론: `<E>`, `<K, V>`, 적용 예
- [05:17] 주의: 제네릭에는 클래스만 가능
- [05:33] 실습 시작(패키지 oop22, Test01): Vector 만들기와 `add`
- [07:35] `size()` 로 요소 개수 확인
- [08:39] `get(0)` 으로 요소 꺼내기
- [10:00] `for` 문으로 전체 요소 꺼내기
- [10:48] `remove(0)`, `removeAllElements()`, `isEmpty()`
- [12:25] 다형성: `List list = new ArrayList();`
- [14:28] Test02: `HashSet` 에 모으고 `size()`
- [15:57] `HashMap` 의 `put`, `size`, `get`
- [18:02] Test03: `Vector<String>` 제네릭과 에러 확인
- [19:52] `ArrayList<Integer>` 와 에러 확인
- [20:54] `HashSet<Double>` 와 에러 확인
- [21:43] `HashMap<String, String>` 와 에러 확인
- [22:32] 사용자 정의 클래스 `Mountain` 을 `ArrayList<Mountain>` 에 모으기
- [24:52] 강의 내용 정리

---

## 용어 정리

| 용어 | 쉬운 뜻 |
|---|---|
| 컬렉션 프레임워크 | 여러 데이터를 모아 두고 꺼내 쓰도록 자바가 준비해 둔 인터페이스·클래스 모음 |
| 요소(element) | 컬렉션 안에 들어 있는 값 하나하나 |
| 인덱스 | List 에서 요소의 위치 번호. 0부터 시작 |
| List | 순서가 있고 중복을 허용하는 모음 |
| Set | 같은 값을 한 번만 담는 모음 |
| Map | Key(이름표)와 Value(값)를 한 쌍으로 담는 모음 |
| Key / Value | 이름표 / 그 이름표가 붙은 값 |
| `Vector`, `ArrayList` | List 를 구현한 클래스. 요즘은 주로 ArrayList |
| `HashSet` | Set 을 구현한 클래스. 순서를 보장하지 않음 |
| `HashMap` | Map 을 구현한 클래스. 순서를 보장하지 않음 |
| `java.util` | 컬렉션 클래스들이 들어 있는 패키지 |
| 제네릭(Generic) | `< >` 안에 자료형을 정해 그 자료형만 담게 하는 문법 |
| 타입 안전 | 잘못된 자료형이 들어오는 걸 컴파일 단계에서 막아 주는 것 |
| 다이아몬드 `<>` | 오른쪽 꺾쇠를 비워 두면 왼쪽을 보고 자동으로 채워 주는 문법 |
| 래퍼 클래스 | 기본형을 감싼 클래스. `int` → `Integer`, `double` → `Double` 등 |
| raw type | 제네릭을 붙이지 않고 쓴 옛 방식. 컴파일 시 unchecked 안내가 나옴 |
| deprecated | "곧 없어질 예정이니 쓰지 말라"고 표시된 기능 |
