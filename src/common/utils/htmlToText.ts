/**
 * 어드민 리치 에디터가 만든 HTML을 읽을 수 있는 평문으로 옮긴다.
 *
 * 공지·약관 본문은 문단과 목록이 전부라, 이 정도 변환이면 원문 그대로 읽힌다. WebView를 띄우지
 * 않는 이유는 아코디언 안에서 열리기 때문이다 — 높이를 알 수 없는 뷰를 목록 안에 넣으면
 * 펼칠 때마다 목록이 튄다.
 */
export function htmlToText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h[1-6]|tr)>/gi, "\n")
    .replace(/<li[^>]*>/gi, "· ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
