# == 와 is 의 차이 (강의 07강-연산자.ipynb is 연산자 정리)

# 비교를 위한 변수값 정의
x = 100
y = 100.0

# == 와 != 는 값만 비교해요. 100 과 100.0 은 값이 같아서 True 예요
print(x == y)
print(x != y)

# is 와 is not 은 두 변수가 "같은 객체(같은 상자)" 인지 봐요
print(x is y)
print(x is not y)

# 자료형이 같고 값도 같은데 is 가 False 일 수도 있어요 (CPython 3.14 에서 확인)
p = 1000
q = int("1000")       # 문자열을 바꿔서 새로 만든 정수예요
print(p == q)         # 값은 같아요
print(type(p) == type(q))  # 자료형도 같아요
print(p is q)         # 그래도 다른 객체라서 False 예요
