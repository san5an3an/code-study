# 리스트의 원소를 format()의 값으로 쓰기 (강의 13강-리스트.ipynb 리스트의 원소를 활용한 문자열 포메팅 정리)

stud1 = ["철수", 98]
stud2 = ["영희", 82]
stud3 = ["나영", 73]

# 강의에서는 바로 앞 블록에서 stud1 을 철호, 100 으로 바꾼 상태였어요
stud1[0] = "철호"
stud1[1] = 100

# 출력 틀을 하나 만들어 두고 {0}, {1} 자리에 리스트 원소를 넣어요
msg = "{0}(이)의 점수는 {1}점 입니다."
print(msg.format(stud1[0], stud1[1]))
print(msg.format(stud2[0], stud2[1]))
print(msg.format(stud3[0], stud3[1]))
