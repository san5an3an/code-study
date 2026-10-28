# replace() 메서드로 문자열 바꾸기(치환) (강의 12강-문자열_함수.ipynb 문자열 바꾸기 정리)

text = "Life is too short, You need Python"

# 변수.replace(A, B): 변수에서 A 를 찾아 B 로 바꾼 결과를 돌려줘요
print(text.replace("Life", "Your height"))

# replace 도 원본은 그대로 두고 복사본을 돌려줘요
print(text)

# 찾는 값이 여러 번 나오면 전부 바꿔요
print("a-b-c".replace("-", "/"))

# 찾는 값이 없으면 바뀌는 게 없어서 원래 문장 그대로 나와요
print(text.replace("nice", "good"))
