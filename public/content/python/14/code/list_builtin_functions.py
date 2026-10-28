# 리스트와 함께 쓰는 파이썬 내장 함수 len, sorted (강의 14강-리스트의_활용.ipynb 리스트 관련 파이썬 내장함수 정리)

# 리스트의 길이(원소 개수)를 조회해요
mylist = [1, 2, 3]
print(len(mylist))

# 원본 리스트예요
mylist = [4, 2, 5, 3, 1]
print(mylist)

# 순차 정렬(오름차순): 원본은 그대로 두고, 정렬된 복사본을 돌려줘요
asc = sorted(mylist)
print(asc)

# 역순 정렬(내림차순): reverse=True 를 넣어요. 이때도 원본은 그대로예요
desc = sorted(mylist, reverse=True)
print(desc)

# 원본을 다시 출력해 보면 그대로 유지돼요
print(mylist)
