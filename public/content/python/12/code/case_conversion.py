# 대소문자 변환 메서드 upper, lower, swapcase, capitalize, title (강의 12강-문자열_함수.ipynb 대소문자 변환하기 정리)

text = "Life is too short, You need Python"

# upper: 모든 글자를 대문자로 바꾼 결과를 돌려줘요
upchar = text.upper()
print(upchar)

# 원본은 변하지 않아요. 바뀐 건 돌려받은 복사본이에요
print(text)

# lower: 모든 글자를 소문자로 바꾼 결과를 돌려줘요
lowchar = text.lower()
print(lowchar)

# swapcase: 대문자는 소문자로, 소문자는 대문자로 서로 바꿔요
print(text.swapcase())

# capitalize: 문장 맨 첫 글자만 대문자, 나머지는 전부 소문자로 바꿔요 (You 가 you 가 돼요)
print(text.capitalize())

# title: 단어마다 첫 글자를 대문자로 바꿔요
print(text.title())

# 여러 번 바꿔도 원본은 처음 그대로예요
print(text)
