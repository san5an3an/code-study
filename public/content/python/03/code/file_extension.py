# 파일 이름에서 확장자만 떼어 보기 (강의 파일 확장자와 텍스트 파일 정리)

# 파일 이름 뒤에 점(.)을 찍고 그 뒤에 확장자를 적어요
# rsplit(".", 1) 은 맨 뒤의 점 한 번만 기준으로 둘로 나눠요 (문자열 기능은 뒤 강의에서 배워요)
files = ["성적표.xlsx", "보고서.hwp", "02강-파이썬.ipynb", "노래.mp3", "사진.jpg", "메모.txt", "hello.py"]

for name in files:
    stem, ext = name.rsplit(".", 1)
    print(name, "=> 이름:", stem, "/ 확장자:", ext)

# 소스 코드도 결국 텍스트 파일이에요. 확장자만 .txt 대신 .py 로 바꾼 거예요
source = "hello.txt"
print(source, "->", source.replace(".txt", ".py"))

# 별표(*)는 "아무 이름이나 다"라는 뜻이에요. *.mp3 는 "확장자가 mp3 인 파일 전부"예요
# fnmatch 는 이런 별표 패턴에 맞는지 검사해 주는 기능이에요
from fnmatch import fnmatch

for name in files:
    if fnmatch(name, "*.mp3") or fnmatch(name, "*.jpg"):
        print("*.mp3 또는 *.jpg 에 해당해요:", name)
