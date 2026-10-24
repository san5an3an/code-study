import { contentPath, fetchContentText } from './content-text';

function fakeFetch(body: string, status: number, type: string) {
  const calls: { url: string; signal?: AbortSignal | null }[] = [];
  const fn = (async (url: string, init?: RequestInit) => {
    calls.push({ url, signal: init?.signal });
    return new Response(body, { status, headers: { 'content-type': type } });
  }) as typeof fetch;
  return { fn, calls };
}

describe('강의 자료 글 불러오기', () => {
  it('과목, 강의 번호, 파일 이름으로 /content 아래 경로를 만듦', () => {
    expect(contentPath('java', '03', 'note.md')).toBe('java/03/note.md');
  });

  it('글 파일이면 내용을 돌려주고, 요청 취소 신호를 fetch 에 넘김', async () => {
    const { fn, calls } = fakeFetch('## 노트', 200, 'text/markdown; charset=UTF-8');
    const signal = new AbortController().signal;
    await expect(fetchContentText('java/03/note.md', signal, fn)).resolves.toBe('## 노트');
    expect(calls).toEqual([{ url: '/content/java/03/note.md', signal }]);
  });

  it('404 응답이면 에러를 던짐', async () => {
    const { fn } = fakeFetch('', 404, 'text/plain');
    await expect(fetchContentText('python/03/note.md', undefined, fn)).rejects.toThrow(/404/);
  });

  it('200 이어도 index.html 이 오면 없는 파일로 보고 에러를 던짐', async () => {
    const { fn } = fakeFetch('<!doctype html>', 200, 'text/html');
    await expect(fetchContentText('python/03/note.md', undefined, fn)).rejects.toThrow(
      /text\/html/,
    );
  });
});
