import java.io.BufferedReader;
import java.io.FileReader;

// 22강 예제 3: BufferedReader 의 readLine() 으로 한 줄(엔터 기준)씩 읽기
public class LineReadTest {

    public static void main(String[] args) {
        String fileName = "data.txt";   // 강의: "D:/workspace/data.txt"
        FileReader fr = null;
        BufferedReader br = null;

        try {
            fr = new FileReader(fileName);
            br = new BufferedReader(fr);    // FileReader 를 BufferedReader 로 한 번 더 감싸기

            int lineNo = 0;
            while (true) {
                String line = br.readLine();    // 한 줄 읽기 (줄바꿈 문자는 빠짐)
                if (line == null) {             // 파일 끝이면 null
                    break;
                }
                lineNo++;
                System.out.println(lineNo + ": " + line);
            }
        } catch (Exception e) {
            System.out.println("실패:" + e);
        } finally {     // 자원 반납 (나중에 만든 br 부터 닫기)
            try {
                if (br != null) { br.close(); }
            } catch (Exception e) {}
            try {
                if (fr != null) { fr.close(); }
            } catch (Exception e) {}
        }
    }
}
