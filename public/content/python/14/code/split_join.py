# 문자열을 잘라 리스트로(split), 리스트를 문자열로(join) (강의 14강-리스트의_활용.ipynb 문자열을 잘라서 리스트로 변환하기, 리스트를 문자열로 결합하기 정리)

# split: 문자열을 주어진 글자 기준으로 잘라 리스트로 돌려줘요
text = "Hello,Python,World,Good"
mylist = text.split(",")
print(mylist)

# join: 앞에 쓴 문자열(여기선 "/")을 리스트 원소 사이사이에 넣어 문자열 하나로 이어요
slash = "/"
mylist = ['Hello', 'Python', 'World', 'Good']
text = slash.join(mylist)
print(text)

# 빈 문자열로 join 하면 기호 없이 딱 붙어요
space = ""
text = space.join(mylist)
print(text)

# 띄어쓰기 하나로 join 하면 공백으로 구분돼요
space2 = " "
text = space2.join(mylist)
print(text)

# 다른 기호도 돼요
print("$".join(mylist))
print("~".join(mylist))
