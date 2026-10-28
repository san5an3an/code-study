# 리스트 메서드 count, index: 개수 세기와 위치 찾기 (강의 14강-리스트의_활용.ipynb 원소의 수, 특정 원소가 처음으로 나타나는 위치 찾기 정리)

# 주어진 값과 일치하는 원소의 개수를 세요
mylist = [1, 2, 3, 2, 4, 2]
c = mylist.count(2)
print(c)

# 특정 원소가 처음으로 나타나는 위치(인덱스)를 찾아요
mylist = [1, 2, 3, 10, 1, 2, 3, 10]
x = mylist.index(10)
print(x)

# 없는 값을 찾으면 문자열의 find 처럼 -1 이 나오는 게 아니라 에러가 나요(주석으로만 남김)
# y = mylist.index(5)    # ValueError: list.index(x): x not in list

# 에러를 피하려면 in 으로 먼저 있는지 확인할 수 있어요 (강의 밖 내용)
if 5 in mylist:
    print(mylist.index(5))
else:
    print("5는 리스트에 없어요")
