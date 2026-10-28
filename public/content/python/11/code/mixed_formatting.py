# 숫자 형식과 이름 형식의 치환 문자 함께 쓰기 (강의 슬라이드 "치환문자를 활용한 문자열 포메팅 (3)"과 11강 ipynb 혼합사용 정리)

# 슬라이드 예제: "책"이 0번째, "좋은"이 1번째, 마지막 값에만 name 이라는 이름을 붙였어요
text = "이 {0}(은)는 {1} {name}입니다."
print(text.format("책", "좋은", name="교과서"))

# 문자열 안에서는 치환 문자 순서를 마음대로 섞어도 돼요
print("{1} {0}은 {name}입니다.".format("책", "좋은", name="교과서"))
print("{name}는 {1} {0}입니다.".format("책", "좋은", name="교과서"))

# 혼합사용 -> 숫자 형식의 치환자가 format() 메서드 안에서 먼저 위치해야 해요
msg4 = "{0}은 {yy}년 {mm}월 {dd}일 입니다."
print(msg4.format("생일", yy=2023, mm=1, dd=31))

# 이름=값 을 먼저 쓰고 그 뒤에 이름 없는 값을 쓰면 실행하기 전에 에러가 나요(주석으로만 남김)
# print(text.format(name="교과서", "책", "좋은"))
# SyntaxError: positional argument follows keyword argument
