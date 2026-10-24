// 18강 보충 예제 (강의 밖 내용): 다형성이 진짜 쓸모 있는 순간
// 부모 타입 변수로 불러도, 자식이 오버라이드한 메소드가 실행돼요.

class Animal {
    public void sound() {
        System.out.println("...");
    }
}

class Dog extends Animal {
    @Override
    public void sound() { System.out.println("멍멍"); }

    public void fetch() { System.out.println("공을 물어 와요"); } // Dog 에만 있는 메소드
}

class Cat extends Animal {
    @Override
    public void sound() { System.out.println("야옹"); }
}

public class PolyOverride {
    public static void main(String[] args) {
        // 부모 타입 배열 하나에 여러 자식 객체를 담을 수 있어요
        Animal[] animals = { new Animal(), new Dog(), new Cat() };

        for (Animal a : animals) {
            a.sound(); // 변수 타입은 Animal 이지만, 실제 객체의 sound() 가 실행돼요
        }

        Animal pet = new Dog();
        // pet.fetch(); // 에러: Animal 타입 변수로는 Dog 만의 메소드가 안 보여요
        Dog dog = (Dog) pet; // 진짜 Dog 이니까 Dog 타입으로 바꿔(형변환) 쓰면 돼요
        dog.fetch();
    }
}
