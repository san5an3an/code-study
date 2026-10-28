# 이름을 쓰는 치환 문자 {price}, {unit} (강의 슬라이드 "치환문자를 활용한 문자열 포메팅 (2)"와 11강 ipynb "인덱스 이름을 사용한 포메팅" 정리)

# 슬라이드 예제: 이름=값 형식으로 넘기면 순서는 상관없어요
text = "이 과자는 {price}{unit}입니다."
print(text.format(unit="원", price=2000))

# 이름으로 넣기 -> format() 메서드에 전달되는 파라미터 순서는 영향이 없어요
msg3 = "{name}은 {yy}년 {mm}월 {dd}일 입니다."
print(msg3.format(mm=10, name="종강일", dd=20, yy=2023))
print(msg3.format(name="종강일", yy=2023, mm=10, dd=20))   # 순서를 바꿔도 결과가 같아요
