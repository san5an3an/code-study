# range 의 세 번째 값으로 변화량 조절하기 (강의 18강-반복문(2)-for.ipynb 값의 변화단계 조절하기 정리)

# 0부터 100 전(=99)까지 10씩 증가해요. 100은 범위 밖이라 90에서 끝나요
for a in range(0, 100, 10):
    print("a=%d" % a)

# 10부터 0 전(=1)까지 2씩 감소해요. 변화량을 음수로 주면 돼요
for b in range(10, 0, -2):
    print("b=%d" % b)

# range 가 만드는 값을 한눈에 보고 싶으면 list() 로 감싸서 출력해요
print(list(range(0, 10)))
print(list(range(10, 0, -2)))
