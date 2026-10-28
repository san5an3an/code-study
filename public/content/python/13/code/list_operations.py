# 리스트 연산: 규칙이 문자열과 같아요 (강의 슬라이드 리스트의 연산, 리스트의 연산 에러케이스 정리)

# 리스트 + 리스트 = 두 리스트를 이어 붙인 새 리스트
a = [1, 2, 3]
b = [4, 5]
c = a + b
print(c)

# 리스트 * 정수 = 원소가 그 수만큼 반복되는 새 리스트
d = [10, 20, 30]
e = d * 3
print(e)

# 문자열도 같은 규칙이었어요
print("Hello" + "Py")
print("py" * 3)

# 에러가 나는 경우(주석으로만 남김)
list1 = [1, 2, 3]
list2 = [4, 5]
# print(list1 + 10)      # TypeError: can only concatenate list (not "int") to list
# print(list1 + "hi")    # TypeError: can only concatenate list (not "str") to list
# print(list1 * list2)   # TypeError: can't multiply sequence by non-int of type 'list'
