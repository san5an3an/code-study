# if ~ elif ~ else 문: 여러 경우의 수 나열 (강의 16강-조건문.ipynb elif를 활용한 다양한 경우의 수 나열 정리)

# 강의에서는 point 를 input() 으로 받았어요. 여기서는 72 를 직접 넣었어요
print("시험시작")

point = 72

if point > 90:
    print("A학점")
elif point > 80:
    print("B학점")
elif point > 70:
    print("C학점")      # 처음 만나는 참인 조건이라 여기만 실행돼요
elif point > 60:
    print("D학점")      # 72 > 60 도 참이지만 앞에서 이미 실행해서 건너뛰어요
else:
    print("F학점")

print("시험 끝")

# 경계값을 조심하세요. > 는 "초과" 라서 90 점은 A 가 아니라 B 예요
point = 90
if point > 90:
    print("A학점")
elif point > 80:
    print("B학점")
else:
    print("그 밖")

# else 는 생략할 수 있어요. 모든 조건이 거짓이면 아무것도 실행되지 않아요
point = 30
if point > 90:
    print("A학점")
elif point > 80:
    print("B학점")
print("else 가 없어서 위에서는 아무것도 안 나왔어요")
