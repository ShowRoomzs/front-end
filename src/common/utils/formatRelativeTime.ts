import dayjs from "dayjs";

/**
 * 게시물 타임스탬프 — 헤더에 "· 2시간", "· 어제"처럼 붙는다.
 *
 * "전"을 붙이지 않는다. 앞에 가운뎃점이 오고 뒤에 아무것도 오지 않는 짧은 자리라
 * 조사 하나가 이름과 시간 사이의 리듬을 흐린다.
 */
export function formatRelativeTime(isoDate: string): string {
  const target = dayjs(isoDate);

  if (!target.isValid()) {
    return "";
  }

  const now = dayjs();
  const diffMinutes = now.diff(target, "minute");

  if (diffMinutes < 1) {
    return "방금";
  }
  if (diffMinutes < 60) {
    return `${diffMinutes}분`;
  }

  const diffHours = now.diff(target, "hour");

  if (diffHours < 24) {
    return `${diffHours}시간`;
  }

  const diffDays = now.startOf("day").diff(target.startOf("day"), "day");

  if (diffDays === 1) {
    return "어제";
  }
  if (diffDays < 7) {
    return `${diffDays}일`;
  }
  if (now.isSame(target, "year")) {
    return target.format("M월 D일");
  }

  return target.format("YYYY. M. D.");
}
