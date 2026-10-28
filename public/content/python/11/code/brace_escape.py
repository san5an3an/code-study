# 문자열에 중괄호 { } 그대로 넣기 (강의 슬라이드 "문자열 정렬 (4)"와 11강 ipynb "중괄호 출력하기" 정리)

# 문자열에 "{"나 "}" 포함시키기 --> 두 겹으로 써요
msg12 = "{{python}}은 {0}다"
print(msg12.format("쉽"))
print(msg12.format("좋", python="내가 사용하는"))   # python= 값은 쓸 곳이 없어서 그냥 무시돼요

# 한 겹으로만 쓰면 {python} 을 치환 문자로 보고 값을 찾다가 에러가 나요(주석으로만 남김)
# msg12 = "{python}은 {0}다"
# print(msg12.format("쉽"))   # KeyError: 'python'

# 한 겹으로 쓰고 python= 값을 넘기면 치환 문자로 동작해요
msg13 = "{python}은 {0}다"
print(msg13.format("쉽", python="우리가 배우는"))
