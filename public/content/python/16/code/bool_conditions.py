# 논리값(True/False)을 조건으로 쓰기 (강의 16강-조건문.ipynb 논리값에 대한 조건문 정리)

isKorean = True
#isKorean = False   # 강의처럼 주석을 바꿔서 결과를 비교해 보세요

if isKorean == True:
    print("한국사람입니다...(1)")

if isKorean == False:
    print("한국사람이 아닙니다...(2)")

if isKorean != True:
    print("한국사람이 아닙니다...(3)")

if isKorean != False:
    print("한국사람입니다...(4)")

# 변수 자체를 조건으로 쓰면 "이 변수가 참이라면" 이라는 뜻이에요
if isKorean:
    print("한국사람입니다...(5)")

# not 을 붙이면 "이 변수가 거짓이라면" 이라는 뜻이에요
if not isKorean:
    print("한국사람이 아닙니다...(6)")
