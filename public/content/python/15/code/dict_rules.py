# 딕셔너리를 쓸 때 지켜야 할 규칙 (강의 15강-딕셔너리.ipynb 리스트 사용 제약 정리)

mydic = {"name": "호영", "phone": "010-1234-5678"}

# 존재하지 않는 키의 값을 꺼내면 에러가 나요. 실행하면 멈추니까 주석으로만 남겨요
# print(mydic["weight"])
# KeyError: 'weight'

# 존재하지 않는 키에 값을 넣으면 그 자리에서 새 항목이 추가돼요(확장)
mydic["height"] = 175
print(mydic)

# 키가 중복되면 하나만 남아요. 나중에 적은 값이 앞의 값을 덮어써요
data = {"msg": "hello", "msg": "world", "msg": "python"}
print(data["msg"])
print(data)
