# 정보의 계층적 표현: 딕셔너리 안에 리스트나 딕셔너리 넣기 (강의 15강-딕셔너리.ipynb 정보의 계층적 표현 정리)

# 슬라이드 예: 따로 만든 딕셔너리 두 개를 다른 딕셔너리의 값으로 넣어요
addressData = {"addr1": "서울특별시 ...", "addr2": "123-4"}
bodyData = {"height": 175, "weight": 80}
student = {"address": addressData, "body": bodyData}
print(student)

# 실습 예: 서로 다른 종류의 데이터를 한 딕셔너리에 담을 수 있어요
addr = ["서울", "서초구", "강남대로"]
grade = {"korean": 98, "math": 77, "english": 82}
member = {
    "userid": "python",   # 문자열 데이터
    "age": 20,            # 정수형 데이터
    "addr": addr,         # 리스트 데이터
    "grade": grade        # 딕셔너리 데이터
}
print(member)

# 계층화된 값은 바깥부터 한 단계씩 들어가요
# 리스트면 번호(인덱스)로, 딕셔너리면 이름(key)으로 꺼내요
print(member["addr"][0])
print(member["grade"]["korean"])

# 보통은 변수를 따로 만들지 않고 처음부터 한 번에 계층화해서 써요
mydic = {
    "total": 1962,
    "city": ["서울", "대전", "광주"],
    "population": [987, 654, 321],
    "date": {"yy": 2023, "mm": 9, "dd": 10}   # 강의에서 2018 을 2023 으로 고쳐서 다시 실행했어요
}
print(mydic)
print(mydic["city"][0])
print(mydic["population"][0])
print(mydic["date"]["yy"])
