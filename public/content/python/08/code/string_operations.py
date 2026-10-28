# 문자열 연산: 덧셈은 연결, 정수와 곱셈은 반복 (강의 08강-문자열.ipynb 문자열 연산 규칙 정리)

msg1 = "Life is too short"
msg2 = "You need Python"

# 문자열 + 문자열 = 이어 붙이기
print(msg1 + ", " + msg2)

# 문자열 * 정수 = 그 수만큼 반복
name = "Python"
print(name * 5)

# 따옴표로 감싼 숫자는 문자열이라서 더하면 숫자 덧셈이 아니라 이어 붙이기가 돼요
pay = "20000"
bonus = "100"
print(pay + bonus)            # 20100 이 아니라 20000100

# 숫자로 계산하려면 int() 로 정수로 바꾼 다음 더해요
print(int(pay) + int(bonus))  # 20100

# print 에 쉼표로 여러 값을 넘기면 사이에 공백 하나를 넣어서 출력해요
m1 = "Hello"
m2 = "World"
print(m1, m2)                 # Hello World
print(m1 + m2)                # HelloWorld

# 에러가 나는 경우(주석으로만 남김)
# print("Hello" + 100)        # TypeError: can only concatenate str (not "int") to str
# print("Hello" * "World")    # TypeError: can't multiply sequence by non-int of type 'str'
