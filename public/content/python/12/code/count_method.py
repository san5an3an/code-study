# count() 메서드로 특정 글자나 단어의 개수 세기 (강의 12강-문자열_함수.ipynb 문자열 안에 포함된 특정 단어나 글자의 개수 세기 정리)

text = "Life is too short, You need Python"

# 글자 i 가 몇 번 나오는지 세요 (Life 의 i, is 의 i)
print(text.count("i"))

# 한 번도 안 나오는 글자는 0 이 돼요
print(text.count("a"))

# 단어도 셀 수 있어요
print(text.count("short"))

# 한 번도 안 나오는 단어도 0 이에요
print(text.count("nice"))

# 대소문자를 구별해서 세요. 대문자 L 은 1번, 소문자 l 은 0번이에요
print(text.count("L"))
print(text.count("l"))
