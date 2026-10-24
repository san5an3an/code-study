import java.io.BufferedReader;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.PrintWriter;

// 22강 예제 4: FileWriter + PrintWriter 로 result.txt 에 쓰기
// 쓰기 모드에서는 파일이 없으면 새로 만들어 줘요.
// FileWriter(파일명, true)  -> 기존 내용 뒤에 이어 쓰기(append)
// FileWriter(파일명, false) -> 기존 내용을 지우고 새로 쓰기(overwrite)
//
// 강의에서는 true/false 를 바꿔 가며 여러 번 실행하고 메모장으로 열어 봤어요.
// 여기서는 그 과정을 한 번에 보여 주려고 write 를 여러 번 부르고,
// 매번 파일 내용을 다시 읽어 화면에 보여 줘요.
public class FileWriteTest {

    public static void main(String[] args) {
        String fileName = "result.txt";     // 강의: "D:/workspace/result.txt"

        System.out.println("[1] false 로 쓰기 (새로 만들기 / 덮어쓰기)");
        write(fileName, false);
        show(fileName);

        System.out.println("[2] true 로 두 번 더 쓰기 (뒤에 이어 쓰기)");
        write(fileName, true);
        write(fileName, true);
        show(fileName);

        System.out.println("[3] 다시 false 로 쓰기 (앞 내용이 사라짐)");
        write(fileName, false);
        show(fileName);
    }

    // 강의의 Test04_output 내용을 메소드로 옮긴 것
    public static void write(String fileName, boolean append) {
        FileWriter fw = null;
        try {
            fw = new FileWriter(fileName, append);  // true 추가, false 덮어쓰기

            PrintWriter out = new PrintWriter(fw, true);
            out.print("KOREA");
            out.println("대한민국");
            out.printf("%d\n%f\n", 123, 45.67);     // 강의는 "%d\n%f" (끝 줄바꿈 없음)

            out.close();    // 자원 반납
            System.out.println("result.txt 완성!!");
        } catch (Exception e) {
            System.out.println("실패:" + e);
        } finally {
            try {
                if (fw != null) { fw.close(); }
            } catch (Exception e) {}
        }
    }

    // 파일 내용을 화면에 보여 주는 메소드 (강의에서는 메모장으로 열어 확인)
    public static void show(String fileName) {
        BufferedReader br = null;
        try {
            br = new BufferedReader(new FileReader(fileName));
            System.out.println("----- " + fileName + " 내용 -----");
            while (true) {
                String line = br.readLine();
                if (line == null) {
                    break;
                }
                System.out.println(line);
            }
            System.out.println("-------------------------");
        } catch (Exception e) {
            System.out.println("실패:" + e);
        } finally {
            try {
                if (br != null) { br.close(); }
            } catch (Exception e) {}
        }
    }
}
