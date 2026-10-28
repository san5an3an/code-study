# 리스트 원소 삭제(del)와 추출(pop) (강의 14강-리스트의_활용.ipynb 리스트 원소 삭제, 리스트의 원소 추출 정리)

# del: 지정한 위치의 원소를 지워요
mylist = [1, 2, 3]
del mylist[1]
print(mylist)

# pop(): 맨 마지막 원소를 꺼내서 돌려주고, 원본에서는 지워요
mylist = [1, 2, 3]
k = mylist.pop()
print(k)
print(mylist)

# pop(0): 맨 앞 원소를 꺼내요 (강의 밖 내용)
mylist = [1, 2, 3]
first = mylist.pop(0)
print(first)
print(mylist)
