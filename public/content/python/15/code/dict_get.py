# get() 메서드로 값 꺼내기 (강의 15강-딕셔너리.ipynb 딕셔너리의 값을 반환하는 메서드 정리)

dic = {"name": "철수", "phone": "010-1234-5678", "birth": "0115"}

# 특정 key 에 대응하는 값 얻기. dic["name"] 과 같은 결과예요
print(dic.get("name"))

# 대괄호로 없는 key 에 접근하면 에러가 나요(주석으로만 남김)
# print(dic["gender"])
# KeyError: 'gender'

# get() 은 없는 key 에 접근해도 에러가 아니라 None 을 돌려줘요
print(dic.get("gender"))

# key 가 없을 때 대신 돌려줄 기본값을 함께 정할 수 있어요
print(dic.get("gender", "남자"))
