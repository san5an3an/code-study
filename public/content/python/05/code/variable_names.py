# 변수 이름 짓는 규칙 (강의 학습정리 슬라이드 정리)
# 영어, 숫자, 언더바(_)만 쓰고, 첫 글자는 숫자가 안 돼요. 예약어도 못 써요

num1 = 100        # 숫자는 첫 글자만 아니면 돼요
_count = 3        # 언더바로 시작해도 돼요
print(num1, _count)

# 대소문자를 구분해요. Age 와 age 는 서로 다른 변수예요
age = 20
Age = 30
print(age, Age)

# 띄어쓰기가 필요하면 두 가지 방법이 있어요
user_name = "홍길동"   # 스네이크 표기법: 단어 사이를 언더바로 이어요
userName = "홍길동"    # 카멜 표기법: 두 번째 단어부터 첫 글자를 대문자로 써요
print(user_name, userName)

# 잘 알려져 있진 않지만 한글 이름도 돼요
점수 = 90
print(점수)

# 안 되는 이름(실행하면 멈추니까 주석으로만 남김)
# 1abc = 3        # SyntaxError: invalid decimal literal  (숫자로 시작)
# class = 3       # SyntaxError: invalid syntax           (예약어)
# my name = 3     # SyntaxError: invalid syntax           (띄어쓰기)
