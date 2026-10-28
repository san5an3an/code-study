# 첫 번째 프로젝트 BMI 계산식 확인용 예제 (강의 슬라이드 요구사항 정리)
# 실제 제출 과제는 input() 으로 값을 받아야 하지만, 여기서는 결과가 늘 같도록 값을 미리 넣어 둬요

myWeight = 85     # 몸무게(kg)
myHeight = 1.75   # 키(m)

# BMI = 체중(kg) / 신장(m) 의 제곱. 거듭제곱이 나눗셈보다 먼저 계산돼요
bmi = myWeight / myHeight ** 2
print(bmi)
