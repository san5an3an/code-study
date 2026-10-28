# if문의 기본 구조와 들여쓰기 (강의 슬라이드 IF문, 16강-조건문.ipynb 조건문 이해하기 정리)

# 슬라이드 예제: 조건이 참이면 들여쓴 두 줄이 모두 실행돼요
a = 100
if a >= 100:
    print("a는 100보다 크거나 같습니다.")
    print("그러므로 이 부분은 출력됩니다.")

# a 가 5 라면 조건이 거짓이라 들여쓴 두 줄 모두 건너뛰어요
a = 5
if a >= 100:
    print("a는 100보다 크거나 같습니다.")
    print("그러므로 이 부분은 출력됩니다.")

# 강의에서는 score 를 input() 으로 받았어요
# 여기서는 실행할 때마다 같은 결과가 나오도록 72 를 직접 넣었어요
print("시험시작")
score = 72
if score >= 60:
    print("합격입니다.")
print("시험 끝")

# 50 이면 if 블록을 건너뛰고 바로 "시험 끝" 으로 가요
print("시험시작")
score = 50
if score >= 60:
    print("합격입니다.")
print("시험 끝")

# 들여쓰기가 틀리면 실행 전에 에러가 나요(주석으로만 남김)
# if a >= 100:
#   print("두 칸")
#     print("네 칸")          # IndentationError: unexpected indent
#
# if a >= 100:
# print("들여쓰기 없음")     # IndentationError: expected an indented block after 'if' statement on line 1
#
# if a >= 100                # SyntaxError: expected ':'
#     print("콜론 없음")
