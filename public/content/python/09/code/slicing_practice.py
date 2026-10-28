# 슬라이싱 실습: 긴 문장에서 원하는 부분 잘라 내기 (강의 09강-문자열의_인덱싱과_슬라이싱.ipynb 문자열 슬라이싱 정리)

# 강의에서는 변수 이름을 str 로 썼지만 str() 함수가 가려져서 text 로 바꿨어요
text = "Life is too short, You need Python"

# 인덱스 0부터 4 전까지 => Life
print(text[0:4])

# 인덱스 5부터 7 전까지 => is
print(text[5:7])

# 인덱스 19(Y 자리)부터 끝까지 => You need Python
print(text[19:])

# 처음부터 인덱스 17(쉼표 자리) 전까지 => Life is too short
print(text[:17])

# 처음부터 끝까지 => 문장 전체
print(text[:])

# 인덱스 19부터 -7 전까지 => You need (-7 자리는 need 뒤의 띄어쓰기예요)
print(text[19:-7])
