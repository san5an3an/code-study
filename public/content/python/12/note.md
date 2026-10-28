# 12. 문자열 관련 함수

## 이 강의에서 배우는 것

- 함수, 내장함수, 객체, 메서드가 무엇인지 다시 짚어 보기
- 내장함수 `len()`으로 문자열 길이(글자 수) 구하기
- 문자열 메서드 `count()`, `find()`, `rfind()`로 개수 세기와 위치 찾기
- `startswith()`, `endswith()`로 시작과 끝 검사하기
- 대소문자 바꾸기: `upper()`, `lower()`, `swapcase()`, `capitalize()`, `title()`
- `replace()`로 바꾸기, `strip()`, `lstrip()`, `rstrip()`으로 공백 지우기
- 프로젝트: 리뷰 문장에 "추천"이라는 단어가 들어 있는지 `find()`로 검사하기

> 복습: 지난 강의들에서 문자열을 만들고, 인덱싱과 슬라이싱, 형식 문자, `format()`으로 다루는 법을 배웠어요. 이번엔 문자열에 딸려 있는 "기능"들을 하나씩 실험해 봐요. 강사님은 함수 이름, 파라미터, 리턴, 설명을 표로 외우는 방식은 딱딱하니까, 직접 코드를 돌려 보고 눈으로 확인하면서 익히자고 해요.

---

## 1. 함수, 내장함수, 객체, 메서드 다시 보기

### 함수

**함수**는 다시 쓰려고(재사용) 여러 명령어를 하나로 묶어 놓은 단위예요. 강사님은 수학의 `y = f(x)`로 설명해요. `f(2)`가 5가 됐다고만 하면 2가 어떻게 5가 됐는지 알 수 없죠. 미리 `f(x) = 2 × x + 1`처럼 **기능이 정의돼 있어야** 결과를 만들 수 있어요. 프로그램 함수도 똑같이 어딘가에 정의가 돼 있어야 쓸 수 있어요.

파이썬에서 함수를 정의할 때는 `def`라는 예약어를 써요(강의 슬라이드 예).

```python
def say():
    print("Hello World")
    print("안녕하세요. 파이썬")

say()   # 호출할 때마다 두 줄이 한 세트로 실행돼요
```

- 괄호 안에 넣는 값을 받는 변수를 **매개변수**, 영어로 **파라미터**라고 해요.
- 함수를 쓰는 것을 **호출한다**고 해요. 호출할 때마다 묶인 명령이 한 세트씩 다시 실행되니까 재사용이 돼요.
- 함수를 직접 만드는 법은 뒤 강의에서 자세히 배워요. 지금은 "함수는 미리 정의된 묶음"이라는 것만 알면 돼요.

### 내장함수

**내장함수**는 파이썬 안에 **미리 정의되어** 있어서 바로 호출만 하면 되는 함수예요. 지금까지 쓴 `print()`, `input()`이 대표적이고, 오늘 배우는 `len()`도 내장함수예요.

### 객체와 메서드

- **객체**는 필요에 따라 다른 변수와 함수를 안에 품고 있는 특수한 변수예요. 파이썬에서는 **모든 변수가 객체**예요.
- 그래서 `s = "Hello"`처럼 문자열 변수를 만들기만 하면, 그 안에 파이썬이 준비해 둔 함수들이 자동으로 들어가요.
- 객체 안에 들어 있는 함수를 특별히 **메서드**라고 불러요. 이름만 다르게 부르는 거라 함수와 크게 구별하지 않고 섞어 써도 돼요.
- 메서드는 `객체이름.메서드이름()` 형식으로 호출해요. 강사님 말로는, 코드에서 **점(`.`)이 나오면 왼쪽은 객체, 오른쪽은 그 객체가 가진 기능**이라고 보면 돼요.
- 메서드도 괄호 안에 값을 넘길 수 있고, 결과 값을 돌려받을(반환) 수 있어요.

---

## 2. 내장함수 len(): 문자열의 길이

실습에서 쓸 문장은 `"Life is too short, You need Python"`이에요.

> **강의와 다른 점**: 강의 화면에서는 이 문장을 `str = "Life is too short, You need Python"`처럼 **`str`이라는 이름의 변수**에 넣었어요. 실행은 되지만 `str`은 파이썬이 문자열로 바꿀 때 쓰는 `str()` 함수의 이름이라서, 이렇게 덮어쓰면 그 뒤로 `str(100)`을 쓸 때 `TypeError: 'str' object is not callable` 에러가 나요(python3 3.14로 확인). 이 노트의 예제는 `text`라는 이름으로 바꿔 썼어요. 변수 이름으로 `str`, `print`, `len`, `input` 같은 내장 이름은 쓰지 마세요.

`len()`은 문자열을 넘겨받아서 **글자 수**를 돌려줘요. `len`은 length(길이)를 줄인 말이에요.

- **공백과 쉼표도 한 글자**로 세요. 강사님이 학습 정리에서 별표를 치며 강조한 부분이에요.
- 한글, 영문 구분 없이 한 글자씩 세요.
- 반환값이 있는 함수는 그 자체를 **하나의 값처럼** 쓸 수 있어요. 변수에 담지 않고 `print(len(text))`처럼 바로 출력하거나 `100 - len(text)`처럼 계산식에 넣어도 돼요.
- 함수 안에 함수가 들어 있으면 **안쪽 함수 결과를 먼저** 생각하세요. 그다음 바깥 함수가 동작해요.

### 예제 (code/len_function.py)

```python
text = "Life is too short, You need Python"
print(text)

a = len(text)
print(a)

print(len(text))

k = 100 - len(text)
print(k)

print(len("안녕 파이썬"))
```

실행 결과:

```
Life is too short, You need Python
34
34
66
6
```

`"안녕 파이썬"`은 한글 5글자에 공백 1개라서 6이에요.

---

## 3. count(): 개수 세기

`문자열.count(찾을 값)`은 찾을 값이 문자열 안에 **몇 번** 나오는지 세서 돌려줘요. 글자뿐 아니라 단어도 셀 수 있고, 한 번도 없으면 0이에요.

### 예제 (code/count_method.py)

```python
text = "Life is too short, You need Python"

print(text.count("i"))
print(text.count("a"))
print(text.count("short"))
print(text.count("nice"))

print(text.count("L"))
print(text.count("l"))
```

실행 결과:

```
2
0
1
0
1
0
```

- `i`는 `Life`에 한 번, `is`에 한 번 나와서 2예요.
- 대소문자를 구별해요. 대문자 `L`은 1번이지만 소문자 `l`은 한 번도 없어서 0이에요.

---

## 4. find()와 rfind(): 위치 찾기

### find(): 처음 나오는 위치

`문자열.find(찾을 값)`은 찾을 값이 **처음 나오는 위치(인덱스)** 를 돌려줘요. **못 찾으면 -1**을 돌려줘요.

- 위치는 0부터 세요. `L`이 0, `i`가 1, `f`가 2, `e`가 3, 공백이 4 … 이렇게 가면 `too`의 `t`가 8이에요.
- 단어를 찾으면 **그 단어 첫 글자의 위치**를 돌려줘요. `short`는 `s`의 위치인 12예요.

> **강의와 다른 점**: 강의에서 "t가 여덟 번째 위치에서 등장했다"고 말했는데, 정확히는 **인덱스 8**, 즉 0부터 세서 8번 자리예요. 1부터 세는 "몇 번째"로 말하면 아홉 번째 글자예요(`text[8]`이 `t`인 걸 python3로 확인). 인덱스와 "몇 번째"를 섞지 않도록 조심하세요.

강사님은 `find()`를 위치를 알려고도 쓰지만 **어떤 단어가 문장에 들어 있는지 검사**하는 데도 많이 쓴다고 강조해요. -1이면 없는 거고, 0 이상이면 있는 거예요. 활용도가 아주 높으니 꼭 기억하라고 해요.

### rfind(): 마지막으로 나오는 위치

`rfind`는 reverse find(거꾸로 찾기)예요. 찾을 값이 **마지막으로 나오는 위치**를 돌려주고, 못 찾으면 역시 -1이에요.

- 뒤에서부터 찾지만, 돌려주는 위치는 **똑같이 왼쪽에서 0부터 센 인덱스**예요.
- 이 문장은 34글자라 인덱스는 0부터 33까지 있어요. **마지막 인덱스는 항상 길이 - 1**이에요. 마지막 `n`이 33, `o`가 32, `h`가 31, `t`가 30이라 `rfind("t")`는 30이에요.
- 단어를 찾을 때는 `rfind`도 **단어의 첫 글자 위치**를 돌려줘요. 뒤에서 찾는다고 단어의 마지막 글자 위치를 주는 게 아니에요. `short`는 한 번만 나오니까 `find`와 `rfind` 결과가 똑같이 12예요.

강사님은 `find`와 `rfind`를 **쌍으로 묶어서** 정리해 두라고 해요.

### 예제 (code/find_rfind.py)

```python
text = "Life is too short, You need Python"

print(text.find("t"))
print(text.find("short"))
print(text.find("g"))
print(text.find("nice"))

print(text.rfind("t"))
print(text.rfind("short"))
print(text.rfind("g"))
print(text.rfind("nice"))

print(len(text) - 1)
print(text.rfind("n"))
```

실행 결과:

```
8
12
-1
-1
30
12
-1
-1
33
33
```

> **참고(강의 밖 내용)**: 들어 있는지만 알고 싶으면 `in` 연산자가 더 간단해요. `"short" in text`는 `True`, `"nice" in text`는 `False`예요. 또 `find()`와 비슷한 `index()`도 있는데, 이건 못 찾으면 -1 대신 `ValueError: substring not found` 에러를 내요(둘 다 python3로 확인).

---

## 5. startswith()와 endswith(): 시작과 끝 검사

- `문자열.startswith(값)`: 그 값으로 **시작하면 `True`**, 아니면 `False`
- `문자열.endswith(값)`: 그 값으로 **끝나면 `True`**, 아니면 `False`
- 글자도, 단어도 검사할 수 있어요.
- 프로그래밍은 **대소문자를 엄격하게 구별**해요. `"Life"`는 맞지만 `"life"`는 틀려요.

강사님 말로는 앞에서 본 `len`, `count`, `find`, `rfind`는 꼭 외워야 하고, 이 두 개는 중요도가 조금 떨어져요. 이름은 `start with`(~로 시작한다), `end with`(~로 끝난다)에 `s`를 붙인 거라 짝으로 기억하면 쉬워요.

### 예제 (code/startswith_endswith.py)

```python
text = "Life is too short, You need Python"

print(text.startswith("L"))
print(text.startswith("l"))
print(text.startswith("Life"))
print(text.startswith("life"))
print(text.startswith("H"))
print(text.startswith("Hello"))

print(text.endswith("N"))
print(text.endswith("n"))
print(text.endswith("Python"))
print(text.endswith("python"))
```

실행 결과:

```
True
False
True
False
False
False
False
True
True
False
```

---

## 6. 대소문자 바꾸기

이 메서드들의 공통점은 **원본은 그대로 두고, 바뀐 결과가 담긴 복사본을 돌려준다**는 거예요. 강사님이 "꼭 기억하라"고 한 부분이에요. 바뀐 걸 계속 쓰고 싶으면 변수에 담아야 해요.

| 메서드 | 하는 일 |
|---|---|
| `upper()` | 모든 글자를 대문자로 |
| `lower()` | 모든 글자를 소문자로 |
| `swapcase()` | 대문자는 소문자로, 소문자는 대문자로 서로 바꿈 |
| `capitalize()` | 문장 맨 첫 글자만 대문자, **나머지는 전부 소문자** |
| `title()` | 단어(띄어쓰기 단위)마다 첫 글자를 대문자로 |

강사님은 개인적으로 `capitalize()`와 `title()`이 꽤 유용했다고 해요.

### 예제 (code/case_conversion.py)

```python
text = "Life is too short, You need Python"

upchar = text.upper()
print(upchar)
print(text)

lowchar = text.lower()
print(lowchar)

print(text.swapcase())
print(text.capitalize())
print(text.title())
print(text)
```

실행 결과:

```
LIFE IS TOO SHORT, YOU NEED PYTHON
Life is too short, You need Python
life is too short, you need python
lIFE IS TOO SHORT, yOU NEED pYTHON
Life is too short, you need python
Life Is Too Short, You Need Python
Life is too short, You need Python
```

`capitalize()` 결과를 잘 보면 원래 대문자였던 `You`와 `Python`이 `you`, `python`으로 바뀌었어요. 첫 글자 말고는 전부 소문자로 만들기 때문이에요.

---

## 7. replace(): 문자열 바꾸기(치환)

`변수.replace(A, B)`는 변수에서 **A를 찾아 B로 바꾼** 결과를 돌려줘요. 바꾸는 걸 "치환한다"고도 해요. 강사님이 "엄청 많이 쓴다, 꼭 기억하라"고 한 메서드예요. 이것도 원본은 그대로예요.

강의에서는 `Life`를 `Your height`로 바꿨어요. 강사님은 만들 땐 농담이라고 생각했는데 지금 보니 별로라고 해요.

### 예제 (code/replace_method.py)

```python
text = "Life is too short, You need Python"

print(text.replace("Life", "Your height"))
print(text)

print("a-b-c".replace("-", "/"))
print(text.replace("nice", "good"))
```

실행 결과:

```
Your height is too short, You need Python
Life is too short, You need Python
a/b/c
Life is too short, You need Python
```

- 찾는 값이 여러 번 나오면 **전부** 바꿔요.
- 찾는 값이 없으면 에러 없이 원래 문장이 그대로 나와요.

---

## 8. strip(), lstrip(), rstrip(): 공백 지우기

실습용으로 앞뒤에 공백이 있는 문자열 `k = "     python     "`을 만들어요. 그냥 출력하면 공백이 눈에 안 보이니까, 강사님은 앞뒤에 대괄호를 이어 붙여 `"[" + k + "]"`로 출력해서 공백 자리를 보여 줘요.

| 메서드 | 하는 일 |
|---|---|
| `strip()` | 앞뒤 공백을 모두 지움 |
| `lstrip()` | 왼쪽(left) 공백만 지움 |
| `rstrip()` | 오른쪽(right) 공백만 지움 |

이것도 원본을 바꾸는 게 아니라 **지운 결과를 돌려준다**고 말하는 게 맞다고 강사님이 짚어요. 가운데 공백은 지우지 않아요.

### 예제 (code/strip_methods.py)

```python
k = "     python     "
print("[" + k + "]")

x = k.strip()
print("[" + x + "]")

y = k.lstrip()
print("[" + y + "]")

z = k.rstrip()
print("[" + z + "]")

print("[" + "  you need  python  ".strip() + "]")
```

실행 결과:

```
[     python     ]
[python]
[python     ]
[     python]
[you need  python]
```

### 강사님이 강조한 쓰임새: 외부에서 들어온 값은 strip

셋 중에서는 `strip()`을 가장 많이 써요. 파이썬으로 많이 하는 일 중에 웹페이지 내용을 모아 오는 **크롤링**이 있어요(규모가 작은 건 정확히는 **스크래핑**이지만 보통 크롤링이라고 퉁쳐 불러요). 이렇게 **바깥에서 들어온 값에는 의도하지 않은 공백이 붙어 있는 경우가 아주 많아서**, 분석 결과가 틀어질 수 있어요. 그래서 강사님은 외부에서 들어온 값은 거의 무조건 `strip()`을 한 번씩 한다고, 공식처럼 기억하라고 해요.

---

## 9. 프로젝트: 문장 속 단어 찾기

강의 슬라이드에 나온 과제예요.

- 상황: 상품 한 줄 리뷰를 입력하는 프로그램에서, 고객들이 추천에 대해 어떻게 생각하는지 알고 싶어요. 리뷰에 **"추천"이라는 단어가 들어 있는지** 검사하면 돼요.
- 요구사항
  1. 사용자에게 문자열을 입력받아 `review` 변수에 저장해요.
  2. `review`에서 "추천"이 **처음 나오는 위치**를 정수형 변수 `p`에 저장해요.
  3. `p`를 출력해요. -1이면 단어가 없는 경우, 0 이상이면 들어 있는 경우예요.
- 제출: 주피터 노트북 파일로 작성해서 공지된 페이지에 내요.

오늘 배운 것 중 "처음 나오는 위치, 못 찾으면 -1"인 메서드는 `find()`예요.

### 예제 (code/review_search.py)

실제 과제는 `review = input("리뷰를 입력하세요: ")`처럼 입력을 받지만, 이 예제는 실행할 때마다 같은 결과가 나오도록 리뷰 문장을 코드에 직접 넣었어요.

```python
review = "배송도 빠르고 품질이 좋아서 추천합니다"
p = review.find("추천")
print(p)

review = "포장이 조금 아쉬웠어요"
p = review.find("추천")
print(p)

review = "추천! 가격 대비 최고예요"
p = review.find("추천")
print(p)
```

실행 결과:

```
16
-1
0
```

세 번째처럼 문장 맨 앞에 "추천"이 있으면 위치가 0이에요. 그래서 "0보다 크면 있다"가 아니라 "**0 이상이면** 있다"로 판단해야 해요.

---

## 자주 하는 실수

### 1) 변수 이름을 str로 지음

```python
str = "Hello"
print(str(100))    # TypeError: 'str' object is not callable
```

내장 이름을 덮어쓰면 원래 기능을 못 써요. `text`, `msg` 같은 이름을 쓰세요.

### 2) 메서드가 원본을 바꾼다고 생각함

```python
text = "hello"
text.upper()
print(text)          # hello  (그대로예요)
text = text.upper()  # 바뀐 결과를 다시 담아야 해요
print(text)          # HELLO
```

`upper`, `lower`, `replace`, `strip` 모두 복사본을 돌려줘요.

### 3) 대소문자를 신경 쓰지 않음

```python
text = "Life is too short, You need Python"
print(text.startswith("life"))   # False
print(text.count("l"))           # 0
```

### 4) find 결과를 "0보다 크다"로 검사함

```python
"추천합니다".find("추천")   # 0  (맨 앞이라 0. 그래도 들어 있어요)
```

없는 경우는 -1뿐이니 "0 이상이면 있다" 또는 "-1이면 없다"로 판단해요.

### 5) 인덱스를 1부터 셈

`find`, `rfind`가 돌려주는 위치는 0부터 세요. 마지막 글자의 인덱스는 길이가 아니라 **길이 - 1**이에요.

### 6) 메서드 이름 뒤 괄호를 빼먹음

```python
print(text.upper)     # <built-in method upper of str object at 0x...>
print(text.upper())   # LIFE IS TOO SHORT, YOU NEED PYTHON
```

괄호가 없으면 실행이 아니라 메서드 자체를 가리키는 거라, 이상한 글자가 나와요.

---

## 시간대별 목차

- [00:00] 강의 소개: 문자열 관련 함수, 문자열은 그 자체가 객체
- [00:49] 학습 내용: 내장함수와 메서드 실습, 프로젝트(표로 외우지 않고 실습으로)
- [02:03] 복습: 함수는 재사용을 위해 명령어를 묶은 단위, y = f(x) 예
- [03:39] 내장함수: 파이썬에 미리 정의된 함수(print, input)
- [04:05] def로 함수 정의, 매개변수(파라미터), 호출
- [05:21] 객체: 변수와 함수를 품은 특수 변수, 파이썬은 모든 변수가 객체
- [06:09] 메서드: 객체에 포함된 함수, 객체이름.메서드이름
- [07:28] 실습 시작: 12강-문자열_함수.ipynb, 실습용 문장 준비
- [08:04] len(): 글자 수, 공백 포함 34글자
- [09:17] 반환값을 바로 print, 안쪽 함수부터 계산
- [09:43] 반환값을 계산식에 사용: k = 100 - len(str) = 66
- [10:11] count(): 글자와 단어 개수 세기, 없으면 0
- [11:42] find(): 처음 나오는 위치, 못 찾으면 -1
- [13:29] find()는 단어 포함 여부 검사에도 씀
- [13:59] rfind(): 마지막으로 나오는 위치, 위치는 왼쪽에서 0부터
- [14:46] 인덱스는 0부터 길이 - 1까지
- [15:39] rfind로 단어 찾기: 단어 첫 글자 위치, find와 쌍으로 정리
- [17:07] startswith(): 시작 여부 검사, 대소문자 구별
- [18:50] endswith(): 끝 여부 검사
- [20:08] 대소문자 변환: upper(), 원본은 그대로 복사본 반환
- [21:03] lower()
- [21:20] swapcase()
- [21:38] capitalize(), title()
- [22:15] replace(): 문자열 바꾸기(치환), 아주 많이 씀
- [23:08] 공백 지우기: 실습용 문자열과 대괄호로 공백 확인
- [23:53] strip(): 앞뒤 공백 제거
- [24:24] lstrip(): 왼쪽 공백 제거
- [24:58] rstrip(): 오른쪽 공백 제거
- [25:30] 크롤링, 외부에서 들어온 값은 무조건 strip
- [27:00] 프로젝트: 문장 속 단어 찾기(리뷰에 "추천" 포함 여부)
- [28:56] 학습 정리: len은 공백 포함, 메서드로 문자열 파싱

---

## 용어 정리

| 용어 | 쉬운 뜻 |
|---|---|
| 함수 | 다시 쓰려고 여러 명령어를 하나로 묶어 놓은 단위 |
| 내장함수 | 파이썬에 미리 정의되어 있어 바로 쓰는 함수. 예: `print()`, `len()` |
| 매개변수(파라미터) | 함수에 넘기는 값을 받는 변수. 괄호 안에 적음 |
| 호출 | 함수나 메서드를 실행시키는 것 |
| 반환값(리턴값) | 함수나 메서드가 일을 마치고 돌려주는 결과 값 |
| 객체 | 변수와 함수를 안에 품은 특수한 변수. 파이썬은 모든 변수가 객체 |
| 메서드 | 객체 안에 들어 있는 함수. `객체.메서드()`로 호출 |
| 인덱스 | 문자열 안 글자의 위치 번호. 0부터 시작해서 길이 - 1까지 |
| 치환 | 문자열의 일부를 다른 값으로 바꾸는 것 |
| 공백 | 띄어쓰기 같은 빈칸 글자. 글자 수를 셀 때 한 글자로 침 |
| 크롤링(스크래핑) | 웹페이지의 내용을 프로그램으로 모아 오는 것 |
| 문자열 파싱 | 메서드 등을 써서 문자열에서 원하는 부분을 찾거나 뽑거나 바꾸며 처리하는 것 |
| True / False | 참과 거짓을 나타내는 값. 검사 결과로 돌려받음 |
