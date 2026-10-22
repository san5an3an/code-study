import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Vector;

// 21강 예제 3: 제네릭(Generic)
// <E> Element(요소), <K, V> Key, Value
// 제네릭 자리에는 클래스(참조형)만 올 수 있어요. int, double 같은 기본형은 안 돼요.
public class GenericTest {

    public static void main(String[] args) {
        // String 만 모으는 Vector
        Vector<String> vec = new Vector<String>();
        vec.add("KOREA");
        vec.add("대한민국");
        vec.add(new String("SEOUL"));
        // vec.add(3);      에러: String 이 아님
        // vec.add(2.4);    에러: String 이 아님
        System.out.println(vec);

        // Integer 만 모으는 ArrayList (오른쪽 <> 는 비워 둬도 돼요: 다이아몬드)
        ArrayList<Integer> list = new ArrayList<>();
        list.add(2);
        list.add(4);        // 강의에서는 new Integer(4)
        // list.add("");    에러
        // list.add(1.3);   에러
        System.out.println(list);

        // Double 만 모으는 HashSet
        HashSet<Double> set = new HashSet<>();
        set.add(6.7);
        set.add(8.9);       // 강의에서는 new Double(8.9)
        // set.add(5);      에러: 5는 int -> Integer 라서 Double 이 아님
        // set.add("");     에러
        System.out.println(set.size());

        // Key 도 String, Value 도 String 인 HashMap
        HashMap<String, String> map = new HashMap<>();
        map.put("one", "오필승");
        map.put("two", "코리아");
        // map.put("", 3);    에러: Value 가 String 이 아님
        // map.put("", 4.5);  에러
        System.out.println(map.get("one") + map.get("two"));

        // 우리가 만든 클래스(Mountain)도 제네릭에 쓸 수 있어요
        Mountain m1 = new Mountain("한라산", 1950);
        Mountain m2 = new Mountain("북한산", 1200);
        Mountain m3 = new Mountain("설악산", 1300);

        ArrayList<Mountain> item = new ArrayList<Mountain>();
        item.add(m1);
        item.add(m2);
        item.add(m3);
        // item.add("");   에러: Mountain 이 아님
        // item.add(3);    에러

        // [참고(강의 밖)] 모은 산 정보를 꺼내 보기
        for (int i = 0; i < item.size(); i++) {
            Mountain m = item.get(i);   // 형변환 없이 바로 Mountain 으로 받아요
            System.out.println(m.name + " " + m.height + "m");
        }
    }
}
