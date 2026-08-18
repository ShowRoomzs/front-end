/**
 * 금액을 천 단위로 끊어 표시한다 — 38000 → "38,000".
 *
 * "원"은 붙이지 않는다. 정가(취소선)는 단위를 생략하고 실제로 낼 금액에만 "원"을 붙이는 것이
 * 디자인 규칙이라, 단위를 붙일지는 부르는 쪽이 정한다.
 */
export function formatPrice(value: number): string {
  return value.toLocaleString("ko-KR");
}
