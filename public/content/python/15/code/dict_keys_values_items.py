# keys(), values(), items() 로 이름과 값 분리하기 (강의 15강-딕셔너리.ipynb key를 분리하기, value를 분리하기, key와 value의 쌍으로 분리하기 정리)

dic = {"name": "철수", "phone": "010-1234-5678", "birth": "0115"}

# key 만 모아서 dict_keys 라는 객체로 돌려줘요
keys = dic.keys()
print(keys)

# list() 로 리스트로 바꿔요
key_list = list(keys)
print(key_list)

# 보통은 두 과정을 한 줄로 한꺼번에 써요
keyList = list(dic.keys())
print(keyList)

# value 만 모아서 dict_values 객체로 돌려줘요
values = dic.values()
print(values)
value_list = list(values)
print(value_list)
valueList = list(dic.values())
print(valueList)

# key 와 value 를 튜플 한 쌍으로 묶어서 dict_items 객체로 돌려줘요
items = dic.items()
print(items)
lists = list(items)
print(lists)
print(list(dic.items()))

# 이렇게 이름과 값을 나눈 리스트는 그래프의 x축, y축 재료로 쓸 수 있어요
point = {"korean": 98, "math": 77, "english": 82}
print(list(point.keys()))
print(list(point.values()))
