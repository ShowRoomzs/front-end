import { ClaimFormCarrier } from "@/features/order/types/claim";

/**
 * 소비자가 회수 송장에 고를 수 있는 택배사 — back-end `DeliveryCarrier.isConsumerSelectable()`.
 *
 * 요청 화면(C10-3)은 폼 API의 `carriers`를 그대로 쓴다. 이 목록은 폼을 거치지 않는 **송장 등록·수정
 * 화면**(C10-5 · C10-4 [송장 수정])만 쓴다 — 상세 API가 택배사 목록을 주지 않아서다.
 * 서버 목록이 바뀌면(GS25 반값택배 추가 등 — 클레임 설계서 Q9) 여기도 함께 고친다.
 */
export const CONSUMER_CARRIERS: Array<ClaimFormCarrier> = [
  { code: "CJ", label: "CJ대한통운" },
  { code: "EPOST", label: "우체국택배" },
  { code: "HANJIN", label: "한진택배" },
  { code: "LOTTE", label: "롯데택배" },
  { code: "LOGEN", label: "로젠택배" },
  { code: "CU", label: "CU편의점택배" },
];
