import java.io.FileInputStream;

// 22강 예제 1: FileInputStream 으로 1바이트씩 읽기
// byte 기반이라 한글이 깨져 보여요.
// 먼저 MakeDataFile 을 실행해서 data.txt 를 만들어 두세요.
public class ByteReadTest {

    public static void main(String[] args) {
        // 강의: "D:/workspace/data.txt" (Windows 절대경로)
        // 여기서는 실행하는 폴더 기준 상대경로를 써요.
        String fileName = "data.txt";

        FileInputStream fis = null;     // byte 기반 -> 한글 깨짐

        try {
            // data.txt 실제 파일을 읽기 모드로 열기 (없으면 예외 발생)
            fis = new FileInputStream(fileName);

            // 1바이트만 읽어 보기
            int first = fis.read();
            System.out.println("첫 바이트: " + first);

            // 나머지를 끝까지 1바이트씩 읽기
            while (true) {
                int by = fis.read();    // 1바이트 읽음 (0~255)
                if (by == -1) {         // -1 이면 파일의 끝
                    break;
                }
                System.out.printf("%c", by);
            }
            System.out.println();
        } catch (Exception e) {
            System.out.println("실패:" + e);
        } finally {     // 자원 반납
            try {
                if (fis != null) { fis.close(); }
            } catch (Exception e) {}
        }
    }
}
