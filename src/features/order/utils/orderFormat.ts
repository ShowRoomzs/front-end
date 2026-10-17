import { AxiosError } from "axios";

import { CustomErrorResponse } from "@/common/types/error";
import { formatPrice } from "@/common/utils/formatPrice";

/**
 * 주문 화면의 날짜·금액·오류 표기.
 *
 * 주문·클레임 API 시각은 `yyyy-MM-dd'T'HH:mm:ss` **KST · 오프셋 없음**이다(back-end `OrderDto.TIME_PATTERN`).
 * `new Date(문자열)`로 읽으면 기기 시간대에 따라 해석이 갈리므로 문자열을 **쪼개서** 쓴다.
 * 전역 직렬화(`JacksonConfig`)를 타는 값은 `…Z`(UTC)로 오므로, 시간대가 붙은 값만 KST로 옮겨 읽는다.
 */
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

interface DateParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  weekday: string;
}

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

function parse(value: string | null | undefined): DateParts | null {
  if (!value) {
    return null;
  }
  const match = value.match(
    /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?(Z|[+-]\d{2}:?\d{2})?)?/
  );

  if (!match) {
    return null;
  }
  const [, y, m, d, hh = "0", mm = "0", ss = "0", zone] = match;

  if (zone) {
    // 시간대가 붙은 값은 절대 시각이다 — KST로 옮긴 숫자를 UTC 게터로 읽는다
    const epoch = Date.parse(value);

    if (Number.isNaN(epoch)) {
      return null;
    }
    const kst = new Date(epoch + KST_OFFSET_MS);

    return {
      year: kst.getUTCFullYear(),
      month: kst.getUTCMonth() + 1,
      day: kst.getUTCDate(),
      hour: kst.getUTCHours(),
      minute: kst.getUTCMinutes(),
      second: kst.getUTCSeconds(),
      weekday: WEEKDAYS[kst.getUTCDay()],
    };
  }
  const year = Number(y);
  const month = Number(m);
  const day = Number(d);

  return {
    year,
    month,
    day,
    hour: Number(hh),
    minute: Number(mm),
    second: Number(ss),
    weekday: WEEKDAYS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()],
  };
}

const pad = (value: number) => String(value).padStart(2, "0");

/** 26.09.12 (금) — 주문 내역 그룹 머리 · 주문 상세 제목 */
export function formatOrderDate(value: string | null | undefined): string {
  const p = parse(value);

  return p ? `${String(p.year).slice(2)}.${pad(p.month)}.${pad(p.day)} (${p.weekday})` : "";
}

/** 26.10.04(일) 13:31 — 반품·교환 상세 제목 */
export function formatRequestedAt(value: string | null | undefined): string {
  const p = parse(value);

  return p
    ? `${String(p.year).slice(2)}.${pad(p.month)}.${pad(p.day)}(${p.weekday}) ${pad(p.hour)}:${pad(p.minute)}`
    : "";
}

/** 2026-10-04 13:31:54 — 신청 정보의 일시 행 */
export function formatDateTimeFull(value: string | null | undefined): string {
  const p = parse(value);

  return p ? `${p.year}-${pad(p.month)}-${pad(p.day)} ${pad(p.hour)}:${pad(p.minute)}:${pad(p.second)}` : "";
}

/** 09.16 */
export function formatMonthDay(value: string | null | undefined): string {
  const p = parse(value);

  return p ? `${pad(p.month)}.${pad(p.day)}` : "";
}

/** 09.16 (수) — 배송 조회 · 회수 조회 제목의 날짜, 발송 예정 행 */
export function formatMonthDayWeekday(value: string | null | undefined): string {
  const p = parse(value);

  return p ? `${pad(p.month)}.${pad(p.day)} (${p.weekday})` : "";
}

/** 10.11(일) — 기한 문구(「10.11(일)까지 등록해 주세요」) */
export function formatDueDate(value: string | null | undefined): string {
  const p = parse(value);

  return p ? `${pad(p.month)}.${pad(p.day)}(${p.weekday})` : "";
}

/** 09/16 (수) 14:20 — 스캔 이력의 시각 */
export function formatScanTime(value: string | null | undefined): string {
  const p = parse(value);

  return p ? `${pad(p.month)}/${pad(p.day)} (${p.weekday}) ${pad(p.hour)}:${pad(p.minute)}` : "";
}

/** 10.04 (일) 15:12 — 송장 등록 일시 */
export function formatMonthDayTime(value: string | null | undefined): string {
  const p = parse(value);

  return p ? `${pad(p.month)}.${pad(p.day)} (${p.weekday}) ${pad(p.hour)}:${pad(p.minute)}` : "";
}

/** 서버 시각을 절대 시각(ms)으로 — 만료 5분 전 잠금처럼 지금과 비교할 때만 쓴다 */
export function toKstEpoch(value: string | null | undefined): number | null {
  const p = parse(value);

  if (!p) {
    return null;
  }
  return Date.UTC(p.year, p.month - 1, p.day, p.hour - 9, p.minute, p.second);
}

/** 24,900원 */
export function won(value: number): string {
  return `${formatPrice(value)}원`;
}

/** 단품 · 1개 — 옵션과 수량은 따로 내려온다(조합은 앱이 한다) */
export function optionWithQuantity(optionName: string | null | undefined, quantity: number): string {
  return withOption(optionName, `${quantity}개`);
}

/** 브랜드가 반품지를 등록하지 않았을 때 보낼 곳 자리에 쓰는 문구 */
export const RETURN_TO_MISSING =
  "브랜드 반품지가 아직 등록되지 않았어요. 1:1 문의로 보낼 곳을 확인해 주세요.";

/**
 * 브랜드 반품지(보낼 곳)를 두 줄로 — 첫 줄 「이름 · 연락처」, 둘째 줄 주소.
 * 반품지가 없으면 서버가 값을 비워 보내므로 빈 값은 빼고 잇는다(「 · 」·「null」이 찍히지 않게).
 */
export function returnToLines(
  returnTo:
    | { name: string | null; contact: string | null; address: string | null; detailAddress: string | null }
    | null
    | undefined,
  separator = " · "
) {
  const head = [returnTo?.name, returnTo?.contact].filter(Boolean).join(separator);
  const address = [returnTo?.address, returnTo?.detailAddress].filter(Boolean).join(" ");

  return { head, address, isEmpty: !head && !address };
}

/**
 * 옵션명 뒤에 문구를 잇는다 — 옵션이 없는 상품은 서버가 `optionName: null`을 주므로
 * 옵션 자리를 비우고 뒤 문구만 남긴다(「null · 주문 1개」가 찍히지 않게).
 */
export function withOption(optionName: string | null | undefined, rest: string, separator = " · "): string {
  return optionName ? `${optionName}${separator}${rest}` : rest;
}

type ApiError = AxiosError<CustomErrorResponse<string, { message?: string; code?: string }>>;

/** 서버의 `message`는 그대로 띄워도 되는 문구다 — 없을 때만 화면 기본 문구를 쓴다 */
export function resolveErrorMessage(error: unknown, fallback: string): string {
  return (error as ApiError).response?.data?.message || fallback;
}

export function resolveErrorCode(error: unknown): string | undefined {
  const data = (error as ApiError).response?.data as { code?: string } | undefined;

  return data?.code;
}

export function resolveHttpStatus(error: unknown): number | undefined {
  return (error as ApiError).response?.status;
}

/** 9.16 (수) — 배송 조회 제목의 날짜(시안 C10-2는 월을 0으로 채우지 않는다) */
export function formatShortMonthDayWeekday(value: string | null | undefined): string {
  const p = parse(value);

  return p ? `${p.month}.${p.day} (${p.weekday})` : "";
}

/** 09.14 자정 · 09.14 18:00 — 공구 마감 시각 */
export function formatDeadline(value: string | null | undefined): string {
  const p = parse(value);

  if (!p) {
    return "";
  }
  const isMidnight = (p.hour === 23 && p.minute === 59) || (p.hour === 0 && p.minute === 0);

  return isMidnight
    ? `${pad(p.month)}.${pad(p.day)} 자정`
    : `${pad(p.month)}.${pad(p.day)} ${pad(p.hour)}:${pad(p.minute)}`;
}
