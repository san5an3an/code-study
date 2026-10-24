import java.util.HashMap;
import java.util.HashSet;

// 21강 예제 2: Set 계열(HashSet)과 Map 계열(HashMap)
// 강의 흐름대로 제네릭(<>) 없이 쓴 예제예요.
public class SetMapTest {

    public static void main(String[] args) {
        // Set 계열 -> 순서가 없고, 같은 값은 한 번만 들어가요
        HashSet set = new HashSet();
        set.add(3);
        set.add(2.4);
        set.add("KOREA");
        set.add('R');
        set.add(7);         // 강의에서는 new Integer(7)

        System.out.println(set.size()); // 요소의 개수

        // [참고(강의 밖)] 이미 있는 값을 또 넣으면?
        boolean added = set.add(3);     // 3은 이미 있음
        System.out.println("3을 또 넣었나? " + added);
        System.out.println("개수: " + set.size());

        // Map 계열 -> Key(이름표) 와 Value(값) 한 쌍으로 저장
        HashMap map = new HashMap();
        map.put("one", 3);          // "one" 이라는 이름표에 3
        map.put("two", 2.4);        // "two" 라는 이름표에 2.4
        map.put("three", "SEOUL");  // "three" 라는 이름표에 "SEOUL"

        System.out.println(map.size());

        // 이름표(Key)로 값 꺼내기
        System.out.println(map.get("three"));
    }
}
