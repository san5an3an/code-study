# 2차원 리스트의 원소에 접근하기: 앞 번호는 행, 뒤 번호는 열 (강의 슬라이드 2차원 리스트 활용, 13강-리스트.ipynb 2차원 리스트의 각 원소에 접근하기 정리)

my_list = [[1, 2, 3], [10, 20, 30], [100, 200, 300]]

# 1차원 접근: 번호 하나면 행 하나(안쪽 리스트 통째)가 나와요
print(my_list[0])   # 0번째 행
print(my_list[1])   # 1번째 행
print(my_list[2])   # 2번째 행

# 2차원 접근: [행][열] 순서로 번호 두 개를 써요
print(my_list[0][0])
print(my_list[1][2])

student_group2 = [
    ["민식", 64, 172.3],
    ["호영", 100, 175.8],
    ["철민", 89, 168.7]
]

print(student_group2[0])      # 0번째 행
print(student_group2[1])      # 1번째 행
print(student_group2[2])      # 2번째 행
print(student_group2[0][0])   # 0번째 행의 0번째 원소
print(student_group2[1][1])   # 1번째 행의 1번째 원소
print(student_group2[2][2])   # 2번째 행의 2번째 원소
