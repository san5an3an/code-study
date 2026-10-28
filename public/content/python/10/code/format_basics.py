# 형식문자 %d, %s 기본 사용법 (강의 10강-형식문자를_활용한_문자열_포메팅.ipynb 정수값과 문자열을 표현하는 형식문자 %d, %s 사용하기 정리)

# "%" 연산자 뒤의 값이 %d 자리를 치환해요
str1 = "나는 %d원을 갖고 있다." % 10000
print(str1)

# 치환할 값을 변수에 담아 넘겨도 돼요. %s 자리에는 문자열이 들어가요
lang = "Python"
str2 = "Hello %s" % lang
print(str2)

# result 변수에 담지 않고 print 안에서 바로 써도 돼요 (슬라이드 예제)
print("나는 %s을 먹었다" % "점심")

# 형식문자가 두 개 이상이면 값들을 괄호로 묶고 콤마로 구분해요. 앞에서부터 순서대로 치환돼요
print("나는 %d개의 %s을 갖고 있다." % (10, "사과"))

# 형식문자를 포함한 문장만 별도의 변수로 정해 두면 틀(템플릿)처럼 계속 재사용할 수 있어요
str3 = "%s 날짜는 %d년 %d월 %d일 입니다."
msg1 = str3 % ("정모", 2023, 1, 1)
print(msg1)
msg2 = str3 % ("약속", 2023, 3, 5)
print(msg2)

# 값 개수가 형식문자 개수와 안 맞으면 에러가 나요(주석으로만 남김)
# print("%d년 %d월" % (2023,))   # TypeError: not enough arguments for format string
# print("%d년" % (2023, 1))      # TypeError: not all arguments converted during string formatting

# %d 자리에 문자열을 넣어도 에러가 나요(주석으로만 남김)
# print("%d원" % "10000")        # TypeError: %d format: a real number is required, not str
