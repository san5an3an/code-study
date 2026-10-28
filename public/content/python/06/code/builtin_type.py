# 내장 함수 print() 와 type() (강의 06강-함수와_객체의_이해.ipynb 내장함수 사용해 보기 정리)
# 내장 함수는 우리가 정의하지 않아도 파이썬에 미리 정의되어 있는 함수예요

# print 도 함수예요. 파라미터로 받은 내용을 출력해요
print("Hello World")

a = 100
b = 200
print(a + b)   # 같은 print 함수를 또 재사용했어요

# type() 은 파라미터로 받은 값의 데이터 타입을 판단해서 돌려줘요
age = 20
typeOfAge = type(age)
print(typeOfAge)

print(type(3.14))
print(type("안녕"))

# 참고: print 는 화면에 출력만 하고, 돌려주는 값은 None(값 없음)이에요
result = print("출력만 해요")
print(result)
