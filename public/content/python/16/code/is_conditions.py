# is, is not 을 조건으로 쓰기 (강의 16강-조건문.ipynb is를 활용한 조건 지정, ==와 is의 차이, is not 정리)

a = 123
b = 123
c = 234

if a is b:
    print("a와 b는 같다")

if b is c:
    print("b와 c는 같다")

# == 는 값만 비교해요. 1 과 1.0 은 값이 같아서 참이에요
x = 1
y = 1.0

# 조건을 참으로 인식함
if x == y:
    print("1) x와 y는 같다")

# 조건을 거짓으로 인식함
if x is y:
    print("2) x와 y는 같다")

# 두 값이 서로 다르다면 참인 is not
a = 123.0
b = 123

if a != b:
    print("1) a와 b는 다르다")

if a is not b:
    print("2) a와 b는 다르다")   # 강의 화면에는 "b와 c는 다르다" 라고 잘못 적혀 있었어요

# is 는 "같은 객체(같은 상자)인가" 를 봐요. 자료형과 값이 같아도 False 일 수 있어요 (python3 3.14 에서 확인)
p = [1, 2, 3]
q = [1, 2, 3]
print(p == q)              # 값은 같아요
print(type(p) == type(q))  # 자료형도 같아요
print(p is q)              # 그래도 따로 만든 리스트라서 False 예요
