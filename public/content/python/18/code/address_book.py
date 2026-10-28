# 주소록 자료구조 만들기 프로젝트 예시 (강의 18강 슬라이드 주소록 자료구조 생성하기 정리)
# 원래 과제는 input() 으로 인원수와 "이름/연락처"를 입력받아요
# 이 파일은 바로 실행해 볼 수 있게 입력 대신 미리 정한 값을 써요

# count = int(input("인원수: "))          # 과제에서는 이렇게 입력받아요
inputs = ["홍길동/010-2345-6789", "김철수/010-1111-2222"]
count = len(inputs)

addressBook = []    # 빈 리스트를 먼저 만들어요

for i in range(0, count):
    # line = input("이름/연락처: ")       # 과제에서는 반복할 때마다 입력받아요
    line = inputs[i]
    data = line.split("/")              # "/" 를 기준으로 잘라 ['홍길동', '010-2345-6789'] 가 돼요
    person = {"name": data[0], "phone": data[1]}
    addressBook.append(person)          # 만든 딕셔너리를 리스트에 추가해요

# 반복이 끝난 뒤 한 번에 출력해요
print(addressBook)
