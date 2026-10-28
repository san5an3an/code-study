# 8진수와 16진수 표현 (강의 05강-변수의_이해.ipynb 8진수, 16진수 표현 정리)

# 8진수: 숫자 0 + 알파벳 o + 숫자값. 출력할 때는 10진수로 바꿔서 보여줘요
g = 0o177
print(g)         # 1*64 + 7*8 + 7 = 127

# 16진수: 숫자 0 + 알파벳 x + 숫자값. 0~9 다음에 A~F 를 써요
h = 0xABC
print(h)         # 10*256 + 11*16 + 12 = 2748

# 앞에 아무것도 안 붙이면 그냥 10진수예요
print(3)

# 숫자 0 만 붙이면 에러가 나요. 실행하면 멈추니까 주석으로만 남겨요
# print(0177)
# SyntaxError: leading zeros in decimal integer literals are not permitted; use an 0o prefix for octal integers
