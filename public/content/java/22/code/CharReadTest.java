import java.io.FileReader;

// 22강 예제 2: FileReader 로 문자(char) 단위로 읽기
// 문자 단위라 한글이 깨지지 않아요.
public class CharReadTest {

    public static void main(String[] args) {
        String fileName = "data.txt";   // 강의: "D:/workspace/data.txt"
        FileReader fr = null;

        try {
            fr = new FileReader(fileName);
            while (true) {
                int ch = fr.read();     // 문자 하나를 읽어 int 로 돌려줌
                if (ch == -1) {         // 더 읽을 게 없으면 -1
                    break;
                }
                System.out.printf("%c", ch);
            }
            System.out.println();
        } catch (Exception e) {
            System.out.println("실패:" + e);
        } finally {
            try {
                if (fr != null) { fr.close(); }
            } catch (Exception e) {}
        }
    }
}
