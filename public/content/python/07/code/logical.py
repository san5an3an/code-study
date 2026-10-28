# 논리 연산자 and, or 와 비교 연산의 결합 (강의 07강-연산자.ipynb 논리 연산자 정리)

# and => 전체가 True 인 경우만 결과가 True 예요
print(True and True)
print(True and False)
print(False and True)
print(False and False)

# or => 하나라도 True 가 있으면 결과가 True 예요
print(True or True)
print(True or False)
print(False or True)
print(False or False)

# 비교 연산의 결과도 True/False 라서 논리 연산을 할 수 있어요
a = 100 > 50
b = 20 > 10
print(a and b)

# 변수에 따로 담지 않고 식에 바로 써도 돼요
c = 100 >= 100 and 50 == 10
print(c)
print(100 != 200 and 100 == 100)
