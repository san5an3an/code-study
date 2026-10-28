# 문자열 인덱싱: 대괄호 [] 안에 인덱스 번호를 넣어 글자 하나를 꺼냄 (강의 슬라이드 문자열 인덱싱 + 09강-문자열의_인덱싱과_슬라이싱.ipynb 문자열 인덱싱 정리)

msg = "You need Python"

# 양의 정수 인덱스는 왼쪽부터 0, 1, 2 ... 로 세요. 띄어쓰기도 한 글자예요
a = msg[2]      # 인덱싱 결과를 다른 변수에 저장해요
print(a)        # u

# 음의 정수 인덱스는 오른쪽 끝 글자부터 -1, -2, -3 ... 으로 세요
print(msg[-4])  # t (결과를 바로 출력해요)

# 띄어쓰기도 인덱스 번호를 하나 차지해요. repr() 로 감싸면 공백이 따옴표 안에 보여요
print(repr(msg[3]))  # ' '

# 강의 실습 문자열이에요. 강의에서는 변수 이름을 str 로 썼지만 str() 함수가 가려져서 text 로 바꿨어요
text = "Life is too short, You need Python"
print(text[3])   # 0부터 세니까 인덱스 3은 네 번째 글자 e
print(text[-3])  # 뒤에서 -1, -2, -3 이니까 h

# 없는 인덱스 번호를 쓰면 에러가 나요. 실행하면 멈추니까 주석으로만 남겨요
# print(msg[15])   # IndexError: string index out of range
