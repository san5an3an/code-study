import java.io.FileWriter;
import java.io.PrintWriter;

// 22강 준비용: 읽기 예제에서 쓸 data.txt 를 만들어 줘요.
// 강의에서는 메모장으로 D:/workspace/data.txt 를 직접 만들었어요.
// 이 파일을 먼저 실행하면, 실행한 폴더에 같은 내용의 data.txt 가 생겨요.
public class MakeDataFile {

    public static void main(String[] args) {
        FileWriter fw = null;
        try {
            fw = new FileWriter("data.txt", false);     // false: 덮어쓰기
            PrintWriter out = new PrintWriter(fw);
            out.println("무궁화 꽃이 피었습니다~~");
            out.println("Gone With The Wind!!");
            out.println("2023년");
            out.println("오필승");
            out.print("KOREA....대한민국");               // 마지막 줄은 줄바꿈 없음
            out.close();
            System.out.println("data.txt 준비 완료");
        } catch (Exception e) {
            System.out.println("실패:" + e);
        } finally {
            try {
                if (fw != null) { fw.close(); }
            } catch (Exception e) {}
        }
    }
}
