# if ~ else 문: 그렇지 않으면 (강의 슬라이드 ELSE문, 16강-조건문.ipynb else절 활용하기 정리)

# 슬라이드 예제
is_korean = False
if is_korean == True:
    print("한국사람입니다.")
else:
    print("한국사람이 아닙니다.")

# 강의에서는 score 를 input() 으로 받았어요. 여기서는 53 을 직접 넣었어요
print("시험시작")
score = 53
if score >= 60:
    print("합격입니다.")
else:
    print("불합격입니다.")
print("시험 끝")

# 강의에서는 answer = input("한국인입니까? (Y/N)") 이었어요. 여기서는 소문자 "y" 를 넣었어요
answer = "y"

# upper() 로 대문자로 바꾸면 y 와 Y 를 한 번에 검사할 수 있어요
if answer.upper() == "Y":
    isKorean = True
else:
    isKorean = False

# 논리값을 조건으로 사용할 경우 "만약 이 변수가 참이라면?"의 의미
if isKorean:
    print("한국사람 입니다...(1)")
else:
    print("한국사람이 아닙니다...(2)")

# 논리값의 부정형을 조건으로 사용할 경우 "만약 이 변수가 거짓이라면?"의 의미
if not isKorean:
    print("한국사람이 아닙니다...(3)")
else:
    print("한국사람 입니다...(4)")

# 샘플 데이터
user1 = "hello"
user2 = "world"
memberList = ['hello', 'python', 'life']

if user1 in memberList:
    # 조건이 참이므로 if절이 실행된다.
    print("%s는 이미 가입되어 있습니다." % user1)
else:
    # 조건이 거짓이 아니므로 else절은 실행되지 않는다.
    print("%s는 가입되어 있지 않습니다." % user1)

if user2 in memberList:
    # 조건이 거짓이므로 if절은 실행되지 않는다.
    print("%s는 이미 가입되어 있습니다." % user2)
else:
    # 조건이 거짓이므로 else절이 실행된다.
    print("%s는 가입되어 있지 않습니다." % user2)

# else 는 혼자 쓸 수 없어요(주석으로만 남김)
# else:
#     print("혼자 있는 else")   # SyntaxError: invalid syntax
