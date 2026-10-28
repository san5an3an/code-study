# 지금 실행 중인 파이썬이 3점대인지, 몇 버전 이상인지 확인하기 (강의 파이썬 설치 여부 확인하기 정리)
import sys

# 터미널의 python3 --version 과 같은 정보를 코드 안에서 꺼내 볼 수 있어요
# sys.version_info 는 (큰 번호, 작은 번호, ...) 꼴로 버전을 담고 있어요
print("큰 번호(major):", sys.version_info.major)

# 강의는 3.11 이상을 권해요. 버전을 비교하면 True 나 False 가 나와요
print("3.11 이상인가요?", sys.version_info >= (3, 11))

# 파이썬 2 로 실행했다면 큰 번호가 2 가 돼요. 맥에서 python3 로 실행하면 3 이 나와요
print("파이썬 3 인가요?", sys.version_info.major == 3)
