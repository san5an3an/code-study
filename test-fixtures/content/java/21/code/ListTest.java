import java.util.ArrayList;
import java.util.List;
import java.util.Vector;

// 21강 예제 1: List 계열 (Vector, ArrayList)
// 강의 흐름 그대로 제네릭(<>) 없이 써 본 예제예요.
// 제네릭 없이 쓰면 컴파일할 때 "unchecked" 안내(Note)가 나오는데, 에러가 아니라 경고예요.
public class ListTest {

    public static void main(String[] args) {
        // Vector 객체 만들기 (java.util 패키지에 있어서 import 필요)
        Vector vec = new Vector();
        vec.add(3);         // 정수
        vec.add(2.4);       // 실수
        vec.add('R');       // 문자(char)
        vec.add("KOREA");   // 문자열
        vec.add(5);         // 강의에서는 new Integer(5) 로 썼어요
        vec.add(6.7);       // 강의에서는 new Double(6.7) 로 썼어요

        // 요소의 개수
        System.out.println(vec.size());

        // 0번째 요소값 가져오기 (List 는 순서 번호가 0부터 시작)
        System.out.println(vec.get(0));

        // 반복문으로 처음부터 끝까지 꺼내기
        for (int i = 0; i < vec.size(); i++) {
            System.out.println(vec.get(i));
        }

        System.out.println("-----------------");

        // 0번째 요소 삭제 -> 개수가 하나 줄어요
        vec.remove(0);
        System.out.println(vec.size());

        // 요소 전부 삭제
        vec.removeAllElements();

        // 비어 있는지 확인 (true/false 를 돌려줘요)
        if (vec.isEmpty()) {
            System.out.println("비어있다");
        } else {
            System.out.println("비어 있지 않다");
        }

        // 다형성: 부모(인터페이스 List) 변수에 자식(ArrayList) 객체를 담기
        List list = new ArrayList();
        list.add(2);
        list.add(4.6);
        list.add('r');
        list.add("SEOUL");
        list.add(7L);       // long 형 7 (강의에서는 new Long(7))

        System.out.println(list.size());
    }
}
