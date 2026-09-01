/**
 * 공개 문의 목록의 작성자 표기 — 앞 절반만 남기고 나머지를 `*`로 가린다 (시안 C7 `mask`).
 *
 * 홀수 길이는 **가리는 쪽을 더 많이** 잡는다(수민초록 → 수민** · 지은맑 → 지**).
 * 공개 목록이라 반올림 방향이 곧 노출량이다 — 올리면 한 글자씩 더 드러나므로 내림한다.
 *
 * 마스킹은 **서버가 하는 편이 안전하다**(원본 닉네임이 응답에 아예 실리지 않는다).
 * 아직 공개 목록 API가 없어 규칙이 정해지지 않았으므로, 화면에서도 한 번 더 가려 둔다.
 * 서버가 마스킹해서 내려주기 시작하면 `*`만 있는 문자열이 들어와도 결과가 같다(멱등).
 */
export function maskAuthorName(name: string): string {
  const value = name ?? "";

  if (value.length <= 1) {
    return value;
  }

  const shown = Math.floor(value.length / 2);

  return value.slice(0, shown) + "*".repeat(value.length - shown);
}
