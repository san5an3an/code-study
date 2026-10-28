# strip(), lstrip(), rstrip() 메서드로 공백 지우기 (강의 12강-문자열_함수.ipynb 공백 지우기 정리)

# 실습을 위한 문자열: 앞뒤에 공백이 들어 있어요
k = "     python     "

# 공백이 어디 있는지 보이도록 앞뒤에 대괄호를 붙여서 출력해요
print("[" + k + "]")

# strip: 앞뒤 공백을 모두 지운 결과를 돌려줘요
x = k.strip()
print("[" + x + "]")

# lstrip(left strip): 왼쪽 공백만 지운 결과를 돌려줘요
y = k.lstrip()
print("[" + y + "]")

# rstrip(right strip): 오른쪽 공백만 지운 결과를 돌려줘요
z = k.rstrip()
print("[" + z + "]")

# 가운데 공백은 지우지 않아요
print("[" + "  you need  python  ".strip() + "]")
