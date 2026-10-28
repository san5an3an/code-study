# 튜플: 소괄호로 만드는 읽기 전용 리스트 (강의 14강-리스트의_활용.ipynb 튜플 정리)

# 5명의 학생에 대한 성적을 나열해요
grade = (98, 82, 73, 64, 100)
print(grade)

# 각 학생의 이름을 나열해요
names = ("철수", "영희", "나영", "민식", "호영")
print(names)

# 자료형을 섞어서 만들 수도 있어요
stud1 = ("철수", 98)
print(stud1)

# 인덱싱으로 값을 읽어요
print(stud1[0])
print(stud1[1])

# 슬라이싱도 돼요. 결과는 새 튜플이에요
print(grade[1:3])

# 값은 바꿀 수 없어요. 실행하면 멈추니까 주석으로만 남겨요
# stud1[0] = "철호"    # TypeError: 'tuple' object does not support item assignment
