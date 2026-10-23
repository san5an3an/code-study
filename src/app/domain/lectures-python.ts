import type { Course } from './course';

// 자료 가져오기가 생기기 전까지 쓰는 목록. 순서와 제목은 강의 영상 파일 이름과 같음
export const PYTHON_COURSE: Course = {
  id: 'python',
  title: 'Python',
  subtitle: '기초 강의 18강',
  parts: [
    { id: 1, title: '시작하기' },
    { id: 2, title: '변수와 연산' },
    { id: 3, title: '문자열' },
    { id: 4, title: '리스트와 딕셔너리' },
    { id: 5, title: '조건과 반복' },
  ],
  lectures: [
    { id: '01', part: 1, title: '프로그래밍 언어의 기본 개념 및 파이썬 소개', folder: '01-프로그래밍-언어의-기본-개념-및-파이썬-소개' },
    { id: '02', part: 1, title: '파이썬 개발환경 구성(windows)', folder: '02-파이썬-개발환경-구성-windows' },
    { id: '03', part: 1, title: '파이썬 개발환경 구성(mac)', folder: '03-파이썬-개발환경-구성-mac' },
    { id: '04', part: 1, title: '첫번째 파이썬 프로그램', folder: '04-첫번째-파이썬-프로그램' },
    { id: '05', part: 2, title: '변수의 이해', folder: '05-변수의-이해' },
    { id: '06', part: 2, title: '함수와 객체의 이해', folder: '06-함수와-객체의-이해' },
    { id: '07', part: 2, title: '연산자', folder: '07-연산자' },
    { id: '08', part: 3, title: '문자열', folder: '08-문자열' },
    { id: '09', part: 3, title: '문자열의 인덱싱과 슬라이싱', folder: '09-문자열의-인덱싱과-슬라이싱' },
    { id: '10', part: 3, title: '형식문자를 활용한 문자열 포메팅', folder: '10-형식문자를-활용한-문자열-포메팅' },
    { id: '11', part: 3, title: 'format 메서드를 활용한 문자열 포메팅', folder: '11-format-메서드를-활용한-문자열-포메팅' },
    { id: '12', part: 3, title: '문자열 관련 함수', folder: '12-문자열-관련-함수' },
    { id: '13', part: 4, title: '리스트', folder: '13-리스트' },
    { id: '14', part: 4, title: '리스트 활용', folder: '14-리스트-활용' },
    { id: '15', part: 4, title: '딕셔너리', folder: '15-딕셔너리' },
    { id: '16', part: 5, title: '조건문', folder: '16-조건문' },
    { id: '17', part: 5, title: '반복문(1) while', folder: '17-반복문-1-while' },
    { id: '18', part: 5, title: '반복문(2) for', folder: '18-반복문-2-for' },
  ],
};
