# 딕셔너리 만들기와 원소 접근, 변경, 삭제 (강의 15강-딕셔너리.ipynb 딕셔너리 정의하기 정리)

# 딕셔너리는 중괄호 { } 안에 "이름(key): 값(value)" 쌍을 쉼표로 나열해요
mydic = {"name": "철수", "phone": "010-1234-5678", "birth": "0115"}
print(mydic)

# 특정 원소에 접근할 때는 대괄호 안에 이름(key)을 넣어요
print(mydic["name"])

# 꺼낸 값을 다른 변수에 복사해도 돼요
phone = mydic["phone"]
print(phone)

# 이름을 써서 값을 바꿀 수도 있어요
mydic["name"] = "호영"
print(mydic)

# del 로 key 가 birth 인 데이터를 지워요 (강의처럼 괄호를 써도 되고, 빼도 돼요)
del mydic["birth"]
print(mydic)
