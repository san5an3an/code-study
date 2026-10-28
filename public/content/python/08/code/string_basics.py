# 문자열 만들기 (강의 08강-문자열.ipynb 앞부분 정리)
# 문자열은 글자들을 따옴표로 감싼 값이에요. 쌍따옴표("), 홑따옴표(') 둘 다 써요

msg1 = "Life is too short"   # 쌍따옴표로 시작했으니 쌍따옴표로 끝내요
msg2 = 'You need Python'     # 홑따옴표로 시작했으니 홑따옴표로 끝내요
print(msg1)
print(msg2)

# 따옴표 안에 들어가면 숫자도 문자열이에요
num_text = "100"
print(num_text)

# 시작과 끝 따옴표가 다르면 에러가 나요. 실행하면 멈추니까 주석으로만 남겨요
# msg3 = "Python Study'
# SyntaxError: unterminated string literal (detected at line 1)
