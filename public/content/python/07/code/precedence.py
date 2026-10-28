# 연산자 우선순위: 괄호가 제일 먼저, and 가 or 보다 먼저 (강의 슬라이드 연산자 우선 순위 정리)

# 곱하기가 더하기보다 먼저예요. 괄호로 감싸면 괄호 안이 제일 먼저예요
print(2 + 3 * 4)
print((2 + 3) * 4)

# 음수 기호(-x) 로 부호를 바꿔요
x = 5
y = -x
print(y)

# and 가 or 보다 먼저 계산돼요. True and True 가 먼저 True 가 되고, True or False 로 True 예요
print(True and True or False)

# and 가 먼저라서 False or (True and False) 로 계산돼 False 가 나와요
print(False or True and False)
print((False or True) and False)
