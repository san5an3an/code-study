# 인덱스 번호로 리스트의 원소 꺼내고 바꾸기 (강의 슬라이드 리스트 원소 활용, 13강-리스트.ipynb 인덱스 번호를 통해 리스트의 각 원소 사용하기 정리)

# 리스트 정의하기
grade = [92, 83, 96]
print(grade)

# 0번째 원소를 출력해요
print(grade[0])

# 1번째 원소를 다른 변수에 복사해요
eng = grade[1]
print(eng)

# 2번째 원소의 값을 바꿔요
grade[2] = 88
print(grade)

# 서로 다른 자료형이 섞인 리스트도 똑같이 인덱스로 꺼내요
stud1 = ["철수", 98]
name = stud1[0]
point = stud1[1]
print(name)
print(point)

# 값의 변경
stud1[0] = "철호"
stud1[1] = 100
print(stud1)

# 없는 칸에 접근하면 에러가 나요. 실행하면 멈추니까 주석으로만 남겨요
# print(stud1[3])            # IndexError: list index out of range
# stud1[3] = "min@gmail.com" # IndexError: list assignment index out of range
