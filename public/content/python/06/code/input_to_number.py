# input() 결과를 숫자로 바꾸기 (강의 06강-함수와_객체의_이해.ipynb 입력받기 정리)
# 강의에서는 input() 으로 키보드 입력을 받았어요
# 이 파일은 바로 실행되도록 input() 대신, input() 이 돌려줬을 문자열을 직접 넣어 뒀어요
#   msg1 = input("메시지를 입력하세요")  -> Hello Python 입력
#   msg2 = input("정수를 입력하세요")    -> 123 입력
#   msg3 = input("소수점을 포함하는 실수를 입력하세요") -> 3.14 입력

# 문자열 입력받기: 무엇을 입력해도 input() 의 결과는 문자열(str)이에요
msg1 = "Hello Python"
print(msg1)
t = type(msg1)
print(t)

# 숫자를 입력해도 결과는 문자열이에요
msg2 = "123"
print(msg2)
t1 = type(msg2)
print(t1)

# int() 에 넘기면 정수로 바꿔서 돌려줘요
num = int(msg2)
print(num)
t2 = type(num)
print(t2)

# 실수가 필요하면 int() 대신 float() 를 써요
msg3 = "3.14"
print(msg3)
t3 = type(msg3)
print(t3)
fnum = float(msg3)
print(fnum)
t4 = type(fnum)
print(t4)

# 문자열인 채로 더하면 숫자 덧셈이 아니라 이어 붙이기가 돼요
print(msg2 + msg2)            # 123123
print(int(msg2) + int(msg2))  # 246

# 소수점이 있는 문자열을 int() 에 바로 넘기면 에러가 나요(주석으로만 남김)
# int("3.14")   # ValueError: invalid literal for int() with base 10: '3.14'
