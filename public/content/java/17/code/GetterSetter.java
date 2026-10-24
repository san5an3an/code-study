// 17강 예제 3: private 멤버 변수를 getter/setter 로 다루기
public class GetterSetter {
    public static void main(String[] args) {
        Bbs bbs = new Bbs();

        // bbs.bbsno = 3;   // 에러: private 이라 밖에서 직접 못 건드려요
        bbs.setBbsno(3);                       // setter 로 값 넣기
        bbs.setWriter("코리아");
        bbs.setSubject("무궁화 꽃이 피었습니다");

        System.out.println(bbs.getBbsno());    // getter 로 값 꺼내기
        System.out.println(bbs.getWriter());
        System.out.println(bbs.getSubject());

        System.out.println("-----");

        // 이클립스 Source > Generate Getters and Setters... 로 만든 모양
        Member m = new Member();
        m.setMemberno(1);
        m.setId("kim");
        m.setName("김자바");
        System.out.println(m.getMemberno() + " " + m.getId() + " " + m.getName());
    }
}

// 게시판 글 하나를 나타내는 클래스
class Bbs {
    private int bbsno;       // 글번호
    private String writer;   // 글작성자
    private String subject;  // 글제목

    public Bbs() {}

    // getter: get + 필드 첫 글자 대문자, 값을 돌려줘요
    public int getBbsno() {
        return this.bbsno;
    }

    // setter: set + 필드 첫 글자 대문자, 값을 받아 넣어요 (리턴 없음 = void)
    public void setBbsno(int bbsno) {
        this.bbsno = bbsno;
    }

    public String getWriter() {
        return this.writer;
    }

    public void setWriter(String writer) {
        this.writer = writer;
    }

    public String getSubject() {
        return this.subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }
}

// 회원 클래스: 이클립스 자동 생성 결과와 같은 형태
class Member {
    private int memberno;
    private String id;
    private String pw;
    private String name;
    private String address;

    public Member() {}

    public int getMemberno() { return memberno; }
    public void setMemberno(int memberno) { this.memberno = memberno; }
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getPw() { return pw; }
    public void setPw(String pw) { this.pw = pw; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
}
