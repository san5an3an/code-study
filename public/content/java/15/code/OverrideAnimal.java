// 참고(강의 밖 예제): 상속으로 공통 코드를 재활용하고, 다른 부분만 오버라이드하기

class Animal {
    String kind = "동물"; // 모든 동물이 공통으로 가진 변수

    // 공통 기능: 자식들이 그대로 물려받아 써요
    public void eat() {
        System.out.println(kind + "이(가) 밥을 먹어요");
    } // eat() end

    // 동물마다 다른 기능: 자식이 오버라이드할 예정
    public void sound() {
        System.out.println("...");
    } // sound() end
} // class Animal end

class Dog extends Animal {
    @Override
    public void sound() { // 개에 맞게 다시 작성
        System.out.println("멍멍");
    } // sound() end
} // class Dog end

class Cat extends Animal {
    @Override
    public void sound() { // 고양이에 맞게 다시 작성
        System.out.println("야옹");
    } // sound() end
} // class Cat end

public class OverrideAnimal {

    public static void main(String[] args) {
        Dog dog = new Dog();
        dog.kind = "강아지"; // 물려받은 변수에 값 넣기
        dog.eat();          // 물려받은 eat() 그대로
        dog.sound();        // 오버라이드한 sound()

        Cat cat = new Cat();
        cat.kind = "고양이";
        cat.eat();
        cat.sound();

        Animal animal = new Animal();
        animal.sound();     // 부모 원래 버전
    } // main() end
}
