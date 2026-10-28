# 논리형 변수와 내용이 없는 변수 None (강의 05강-변수의_이해.ipynb 뒷부분 정리)

# 참은 True, 거짓은 False. 첫 글자가 꼭 대문자여야 해요
a = True         # 참을 의미하는 키워드 True 를 a 에 할당
print(a)
b = False        # 거짓을 의미하는 키워드 False 를 b 에 할당
print(b)

# 소문자로 쓰면 에러가 나요(주석으로만 남김)
# a = true
# NameError: name 'true' is not defined. Did you mean: 'True'?

# 내용이 없는 변수: 나중에 값을 넣으려고 일단 비워 둘 때 None 을 넣어요
hello = None
print(hello)     # print 로 출력하면 None 이라고 나와요

# 나중에 값을 넣으면 돼요
hello = "Hello"
print(hello)
