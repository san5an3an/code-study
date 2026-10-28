# find(), rfind() 메서드로 글자나 단어의 위치 찾기 (강의 12강-문자열_함수.ipynb 특정 글자나 단어가 처음/마지막으로 등장하는 위치 조회 정리)

text = "Life is too short, You need Python"

# find: 처음 등장하는 위치(인덱스)를 돌려줘요. 위치는 0부터 세요
print(text.find("t"))        # too 의 t
print(text.find("short"))    # 단어를 찾으면 그 단어 첫 글자의 위치예요
print(text.find("g"))        # 못 찾으면 -1
print(text.find("nice"))     # 단어를 못 찾아도 -1

# rfind: 마지막으로 등장하는 위치를 돌려줘요. 위치는 여전히 왼쪽에서 0부터 세요
print(text.rfind("t"))       # Python 의 t
print(text.rfind("short"))   # short 는 한 번만 나와서 find 와 같아요
print(text.rfind("g"))
print(text.rfind("nice"))

# 인덱스는 0부터 (길이 - 1)까지 있어요. 이 문장은 34글자라 마지막 인덱스는 33이에요
print(len(text) - 1)
print(text.rfind("n"))       # 마지막 글자 n 의 위치
