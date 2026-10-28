# 성적에 대한 총점과 평균 구하기 (강의 18강-반복문(2)-for.ipynb 반복문의 활용 정리)
score = [100, 82, 98, 76, 51]

# 총점을 저장할 변수예요. 반복 전에 0으로 만들어요
total = 0

for v in score:
    # 총점은 각 원소를 누적해서 더해요
    total += v

# 평균은 총합을 원소의 수로 나눠요
# -> "//" 는 나눗셈에서 정수 부분의 몫만 구해요
avg = total // len(score)

tpl = "총점: {0}, 평균: {1}"
print(tpl.format(total, avg))

# 소수점까지 보고 싶으면 / 로 나눠요(강의 밖 내용)
print(total / len(score))
