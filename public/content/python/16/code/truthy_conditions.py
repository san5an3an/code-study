# 값 자체를 조건으로 쓰기: 숫자, 문자열, 리스트 (강의 16강-조건문.ipynb 숫자형/문자열/리스트에 대한 조건 처리 정리)

# 숫자형 변수: 0 이 아니면 참, 0 이면 거짓이에요
money = 10000
if money:
    print("택시를 타고")
print("집에가자")

money = 0
if money:
    print("택시를 타고")
print("집에가자")

# 문자열 변수: 한 글자라도 있으면 참, 빈 문자열("")이면 거짓이에요
name = "Python"
if name:
    print(name)
print("프로그래밍")

name = ""
if name:
    print(name)
print("프로그래밍")

# 리스트 변수: 원소가 하나라도 있으면 참, 빈 리스트([])면 거짓이에요
grade = [100, 80, 70]
if grade:
    msg = "국어: {0}, 영어: {1}, 수학: {2}"
    print(msg.format(grade[0], grade[1], grade[2]))
print("성적처리")

grade = []
if grade:
    msg = "국어: {0}, 영어: {1}, 수학: {2}"
    print(msg.format(grade[0], grade[1], grade[2]))
print("성적처리")

# bool() 로 참/거짓을 직접 확인해 볼 수 있어요
print(bool(-1), bool(0))      # 음수도 0 이 아니라서 참이에요
print(bool(" "), bool(""))    # 띄어쓰기 한 칸도 글자라서 참이에요
print(bool([]), bool(()), bool({}))  # 빈 리스트, 빈 튜플, 빈 딕셔너리는 모두 거짓이에요
