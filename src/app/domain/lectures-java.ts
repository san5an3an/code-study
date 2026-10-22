import type { Course } from './course';

// 자료 가져오기가 생기기 전까지 쓰는 목록. 순서와 제목은 Java-notes 목차와 같음
export const JAVA_COURSE: Course = {
  id: 'java',
  title: 'Java',
  subtitle: '기초 강의 22강',
  parts: [
    { id: 1, title: '자바 시작하기' },
    { id: 2, title: '흐름 제어와 배열' },
    { id: 3, title: '메소드' },
    { id: 4, title: '객체지향' },
    { id: 5, title: '실전 도구' },
  ],
  lectures: [
    { id: '01', part: 1, title: '자바 개념 및 교육 소개', folder: '01-자바-개념-및-교육-소개' },
    { id: '02', part: 1, title: '개발 환경 구축 및 콘솔창 출력', folder: '02-개발-환경-구축-및-콘솔창-출력' },
    { id: '03', part: 1, title: '변수와 상수', folder: '03-변수와-상수' },
    { id: '04', part: 1, title: '기본 자료형', folder: '04-기본-자료형' },
    { id: '05', part: 1, title: 'printf의 다양한 출력서식', folder: '05-printf의-다양한-출력서식' },
    { id: '06', part: 2, title: 'if 조건문 및 switch-case문', folder: '06-제어문-if-조건문-및-switch-case문' },
    { id: '07', part: 2, title: 'for 반복문', folder: '07-제어문-for-반복문' },
    { id: '08', part: 2, title: 'while문, do-while문, continue문', folder: '08-제어문-while문-do-while문-continue문' },
    { id: '09', part: 2, title: '배열', folder: '09-배열' },
    { id: '10', part: 3, title: '메소드 정의와 호출', folder: '10-메소드-정의와-호출' },
    { id: '11', part: 3, title: '메소드 return형과 오버로드', folder: '11-메소드-return형과-메소드-오버로드' },
    { id: '12', part: 4, title: '클래스와 생성자 함수', folder: '12-클래스와-생성자-함수' },
    { id: '13', part: 4, title: 'String 클래스와 Wrapper 클래스', folder: '13-String-클래스와-Wrapper클래스' },
    { id: '14', part: 4, title: 'static 및 final 예약어', folder: '14-static-및-final-예약어' },
    { id: '15', part: 4, title: '상속과 메소드 오버라이드', folder: '15-상속과-메소드-오버라이드' },
    { id: '16', part: 4, title: 'Math와 Calendar 클래스', folder: '16-Math와-Calendar-클래스' },
    { id: '17', part: 4, title: 'this와 this() 및 Getter·Setter', folder: '17-this와-this생성자-및-Getter와-Setter함수' },
    { id: '18', part: 4, title: 'Object 클래스와 super 및 다형성', folder: '18-Object클래스와-super-및-다양성' },
    { id: '19', part: 4, title: '추상 클래스와 인터페이스', folder: '19-추상클래스와-인터페이스' },
    { id: '20', part: 5, title: '예외처리', folder: '20-예외처리' },
    { id: '21', part: 5, title: 'Collection Framework 및 제네릭', folder: '21-Java-Collection-Framework-및-제네릭' },
    { id: '22', part: 5, title: '파일 입출력', folder: '22-파일-입출력' },
  ],
};
