# 리스트 재배치 reverse, sort (강의 14강-리스트의_활용.ipynb 리스트의 역순 배치, 리스트의 정렬 정리)

# reverse: 원본의 순서를 거꾸로 뒤집어요 (크기 순 정렬이 아니에요)
mylist = [1, 7, 5, 3, 9]
mylist.reverse()
print(mylist)

# sort: 순차 정렬(오름차순). 원본이 직접 바뀌어요
mylist = [2, 5, 1, 4, 3]
mylist.sort()
print(mylist)

# sort(reverse=True): 역순 정렬(내림차순). 이것도 원본이 바뀌어요
mylist = [2, 5, 1, 4, 3]
mylist.sort(reverse=True)
print(mylist)

# sort 는 정렬된 리스트를 돌려주지 않고 None 을 돌려줘요 (강의 밖 내용)
mylist = [2, 5, 1, 4, 3]
result = mylist.sort()
print(result)
