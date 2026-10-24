import { inlineHtml, noteHtml } from './note-markdown';

describe('노트 마크다운 변환', () => {
  it('맨 위 # 제목은 빼고, ## 제목부터 그림', () => {
    const html = noteHtml('# 03강. 변수와 상수\n\n## 이 강의에서 배우는 것\n\n본문');
    expect(html).not.toContain('<h1');
    expect(html).not.toContain('03강. 변수와 상수');
    expect(html).toContain('<h2>이 강의에서 배우는 것</h2>');
    expect(html).toContain('<p>본문</p>');
  });

  it('표와 표 칸 안의 <br> 줄바꿈을 그대로 살림', () => {
    const html = noteHtml('| 문법 | 설명 |\n| --- | --- |\n| else if | 첫 줄<br>둘째 줄 |');
    expect(html).toContain('<table>');
    expect(html).toContain('<th>문법</th>');
    expect(html).toContain('<td>첫 줄<br>둘째 줄</td>');
  });

  it('코드 블록은 언어 이름을 class 로 달고, 안의 <> 글자는 글자로 둠', () => {
    const html = noteHtml('```java\nList<Integer> a;\n```');
    expect(html).toContain('<pre><code class="language-java">');
    expect(html).toContain('List&lt;Integer&gt; a;');
  });

  it('한 줄 마크다운은 문단 태그 없이 코드와 굵게만 바꿈', () => {
    expect(inlineHtml('3번 `7.` 은 **실수**')).toBe('3번 <code>7.</code> 은 <strong>실수</strong>');
  });
});
