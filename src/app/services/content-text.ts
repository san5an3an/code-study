// public/content 의 강의 자료 글 파일을 불러옴. 파일을 못 찾으면 에러를 던짐
import type { CourseId } from '../domain/course';

// 예: contentPath('java', '03', 'note.md') → "java/03/note.md"
export function contentPath(course: CourseId, lectureId: string, file: string) {
  return `${course}/${lectureId}/${file}`;
}

export async function fetchContentText(
  path: string,
  signal?: AbortSignal,
  fetchFn: typeof fetch = fetch,
): Promise<string> {
  const res = await fetchFn(`/content/${path}`, { signal });
  // 없는 파일이면 개발 서버가 404 대신 index.html 을 돌려주므로 응답 종류가 HTML 이어도 실패로 봄
  const type = res.headers.get('content-type') ?? '';
  if (!res.ok || type.includes('text/html')) {
    throw new Error(`강의 자료를 못 불러옴: ${path} (${res.status} ${type})`);
  }
  return res.text();
}
