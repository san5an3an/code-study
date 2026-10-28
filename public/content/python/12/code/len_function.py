# 내장함수 len()으로 문자열의 길이(=글자 수) 구하기 (강의 12강-문자열_함수.ipynb 내장함수 len()을 사용한 문자열의 길이 조회 정리)

# 강의에서는 변수 이름을 str 로 썼지만, str 은 파이썬이 이미 쓰는 이름이라 text 로 바꿔 썼어요
text = "Life is too short, You need Python"
print(text)

# 전체 글자 수 세기: 공백과 쉼표도 한 글자로 세요
a = len(text)
print(a)

# 반환되는 값을 변수에 저장하지 않고 바로 출력해도 돼요
# 안쪽 len(text) 가 먼저 계산되고, 그 결과를 바깥 print 가 출력해요
print(len(text))

# 반환값은 하나의 값처럼 다른 계산식에 그대로 쓸 수 있어요
k = 100 - len(text)
print(k)

# 한글도 영문과 똑같이 한 글자씩 세요
print(len("안녕 파이썬"))
