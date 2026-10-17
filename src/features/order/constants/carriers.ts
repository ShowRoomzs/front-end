import { ClaimFormCarrier } from "@/features/order/types/claim";

/**
 * 송장 택배사 목록의 **대체값** — 서버 목록(`GET /common/delivery-carriers`)을 받기 전이나 못 받았을 때만 쓴다.
 *
 * 요청 화면(C10-3)은 폼 API의 `carriers`를, 송장 등록·수정 화면(C10-5 · C10-4 [송장 수정])은 공용 목록 API를
 * 쓴다 — 둘 다 back-end `DeliveryCarrier.selectable()`(추적 연동 업체)이다.
 */
export const CONSUMER_CARRIERS: Array<ClaimFormCarrier> = [
  { code: "CJ", label: "CJ대한통운" },
  { code: "EPOST", label: "우체국택배" },
  { code: "HANJIN", label: "한진택배" },
  { code: "LOTTE", label: "롯데택배" },
  { code: "LOGEN", label: "로젠택배" },
  { code: "KYUNGDONG", label: "경동택배" },
  { code: "DAESIN", label: "대신택배" },
  { code: "ILYANG", label: "일양로지스" },
  { code: "CU", label: "CU 편의점택배" },
  { code: "GS25", label: "GS25 편의점택배" },
  { code: "HAPDONG", label: "합동택배" },
  { code: "WOORI", label: "우리택배" },
];
