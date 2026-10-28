# 파일 이름과 확장자 나누기 (강의 슬라이드 "소스코드(Source Code)"의 확장자 설명 정리)
# 확장자는 파일 이름 뒤에 마침표와 함께 붙어서 파일 종류를 알려 주는 글자예요
import os.path

files = ["hello.txt", "hello.py", "study.ipynb", "movie.avi", "song.mp3"]

for name in files:
    stem, ext = os.path.splitext(name)   # (이름, 확장자) 두 개로 나눠 줘요
    print(name, "->", "이름:", stem, "/ 확장자:", ext, "/ 글자 수:", len(ext) - 1)
