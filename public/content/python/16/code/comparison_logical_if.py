# 비교식과 논리식을 조건으로 쓰기 (강의 16강-조건문.ipynb 비교식과 논리식을 활용한 if문 정리)

# 강의에서는 myage 를 input() 으로 받았어요. 여기서는 19 를 직접 넣었어요
myage = 19

if myage == 19:
    print("19살 입니다.")

if myage != 20:
    print("20살이 아닙니다.")

if myage > 19:
    print("성인입니다.")

if myage <= 19:
    print("청소년입니다.")

# 강의에서는 point 도 input() 으로 받았어요. 여기서는 75 를 직접 넣었어요
point = 75

# AND --> 전체가 참이어야 결과가 참
if point > 70 and point <= 80:
    print("C학점 입니다.")

# OR --> 하나라도 참이면 전체가 참
if point <= 70 or point > 80:
    print("C학점이 아닙니다.")
