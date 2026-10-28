# in, not in 을 조건으로 쓰기 (강의 16강-조건문.ipynb 포함 여부를 검사하는 in 연산자 정리)

# 예제를 위한 변수 준비
user1 = "hello"
user2 = "world"
memberList = ['hello', 'python', 'life']

# 왼쪽의 변수가 오른쪽의 리스트에 속한 값이므로 참
a = user1 in memberList
print(a)

# 왼쪽의 변수가 오른쪽의 리스트에 속해 있지 않으므로 거짓
b = user2 in memberList
print(b)

# 조건이 참이므로 결과가 출력됨
if user1 in memberList:
    print( user1 + "(은)는 이미 가입되어 있습니다." )

# 조건이 거짓이므로 결과가 출력되지 않음
if user2 in memberList:
    print( user2 + "(은)는 이미 가입되어 있습니다." )

# 조건이 거짓이므로 결과가 출력되지 않음
if user1 not in memberList:
    print( user1 + "(은)는 가입되어 있지 않습니다." )

# 조건이 참이므로 결과가 출력됨
if user2 not in memberList:
    print( user2 + "(은)는 가입되어 있지 않습니다." )

# in 은 문자열에도 쓸 수 있어요. 글자 조각이 들어 있는지 봐요
print("py" in "python")
