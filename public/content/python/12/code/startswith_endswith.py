# startswith(), endswith() 메서드로 시작과 끝 검사하기 (강의 12강-문자열_함수.ipynb 특정 단어나 글자로 시작하는지/끝나는지 여부 검사 정리)

text = "Life is too short, You need Python"

# startswith: 그 글자나 단어로 시작하면 True, 아니면 False 를 돌려줘요
print(text.startswith("L"))      # 대문자 L 로 시작해요
print(text.startswith("l"))      # 대소문자를 구별해서 소문자 l 은 False
print(text.startswith("Life"))
print(text.startswith("life"))
print(text.startswith("H"))
print(text.startswith("Hello"))

# endswith: 그 글자나 단어로 끝나면 True, 아니면 False 를 돌려줘요
print(text.endswith("N"))        # 마지막 글자는 소문자 n 이라서 False
print(text.endswith("n"))
print(text.endswith("Python"))
print(text.endswith("python"))   # p 가 소문자라서 False
