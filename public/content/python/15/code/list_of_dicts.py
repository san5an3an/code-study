# 딕셔너리를 원소로 갖는 리스트(목록 구조, 표 자료형) (강의 15강-딕셔너리.ipynb 딕셔너리를 원소로 갖는 리스트 정리)

# 슬라이드의 목록 구조 예: 리스트 안의 딕셔너리들은 키가 모두 같아요
review = {
    "items": [
        {"email": "user1@python.com", "comment": "Good~!!"},
        {"email": "user2@python.com", "comment": "Nice~!!"},
        {"email": "user3@python.com", "comment": "Not Bad"}
    ]
}
print(review)

# 실습 예: 바깥이 대괄호라서 전체는 리스트예요
grade = [
    {"name": "철수", "kor": 95, "eng": 88},
    {"name": "영희", "kor": 92, "eng": 90},
    {"name": "철민", "kor": 88, "eng": 76}
]
print(type(grade))

# 리스트니까 번호로 꺼내면 딕셔너리가 하나씩 나와요
print("0번째 원소", grade[0])
print("1번째 원소", grade[1])
print("2번째 원소", grade[2])

# 번호로 딕셔너리를 꺼낸 다음, 이름으로 값을 꺼내요
tpl = "{0}의 국어점수:{1}, 영어점수: {2}"
print(tpl.format(grade[0]["name"], grade[0]["kor"], grade[0]["eng"]))
print(tpl.format(grade[1]["name"], grade[1]["kor"], grade[1]["eng"]))
print(tpl.format(grade[2]["name"], grade[2]["kor"], grade[2]["eng"]))
