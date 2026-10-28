# 내장 함수 enumerate 로 인덱스와 값을 한 번에 얻기 (강의 18강-반복문(2)-for.ipynb 내장함수를 사용하여 인덱스와 값 한번에 얻기 정리)

# i 에는 리스트의 인덱스가 저장돼요
# v 에는 리스트의 값(원소)이 저장돼요
# i, v 는 그냥 변수라서 이름은 마음대로 지어도 돼요
city = ['서울', '인천', '대구', '대전', '광주', '부산']

for i, v in enumerate(city):
    print("%d번째 값 >> %s" % (i, v))

# 이름을 바꿔도 똑같이 동작해요
for num, value in enumerate(['봄', '여름']):
    print(num, value)
