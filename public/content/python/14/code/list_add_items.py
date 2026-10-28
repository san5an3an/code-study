# 리스트에 원소 추가하기 append, insert, extend (강의 14강-리스트의_활용.ipynb 리스트 원소 추가, 리스트 확장 정리)

# append: 맨 뒤에 하나 추가해요. 원본이 직접 바뀌어요
mylist = [1, 2, 3]
mylist.append(4)
print(mylist)

# 리스트를 append 하면 리스트 통째로 원소 하나가 돼요(2차 리스트)
mylist = [1, 2, 3]
mylist.append([5, 6])
print(mylist)

# insert(위치, 값): 그 위치에 넣고 기존 원소는 뒤로 한 칸씩 밀려요
mylist = [1, 2, 3]
mylist.insert(1, 10)
print(mylist)

# 맨 앞에 넣으려면 위치를 0으로 줘요
mylist = [1, 2, 3]
mylist.insert(0, 10)
print(mylist)

# 위치를 len(mylist) - 1 로 주면 맨 끝이 아니라 마지막 원소 앞에 들어가요
mylist = [1, 2, 3]
mylist.insert(len(mylist) - 1, 10)
print(mylist)

# 위치를 len(mylist) 로 주면 맨 뒤에 들어가서 append 와 같은 효과예요
mylist = [1, 2, 3]
last_index = len(mylist)
mylist.insert(last_index, 10)
print(mylist)

# extend: 원본 뒤에 다른 리스트의 원소들을 하나씩 덧붙여요
mylist = [1, 2, 3]
addon = [10, 9, 8, 7]
mylist.extend(addon)
print(mylist)

# 결과는 두 리스트를 + 로 더한 것과 같아요
print([1, 2, 3] + addon)
