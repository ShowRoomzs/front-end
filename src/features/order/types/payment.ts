/**
 * 결제수단 — back-end `PaymentMethod` · `CardIssuer` · `EasyPayProvider`.
 *
 * 앱은 **서버 enum만** 쓴다. 포트원 코드(`SHINHAN_CARD` 등)로의 변환은 서버가 하고, 결제창에
 * 넘길 값은 주문 생성 응답의 `payment` 블록(`PaymentWindow`)에 이미 들어 있다.
 * 실제로 그릴 목록은 주문서의 `paymentMethods`를 따른다 — 꺼진 수단은 목록에서 빠진다.
 */
export type PaymentMethod = "CARD" | "EASY_PAY";

export type CardIssuer =
  | "SHINHAN"
  | "SAMSUNG"
  | "HYUNDAI"
  | "KB"
  | "LOTTE"
  | "HANA"
  | "BC"
  | "NH"
  | "WOORI"
  | "KAKAOBANK";

export type EasyPayProvider = "KAKAOPAY" | "NAVERPAY" | "TOSSPAY";

/** 카드사 라벨 — 시트에는 뒤에 「카드」를 붙여 그린다(신한카드) */
export const CARD_ISSUER_LABEL: Record<CardIssuer, string> = {
  SHINHAN: "신한",
  SAMSUNG: "삼성",
  HYUNDAI: "현대",
  KB: "KB국민",
  LOTTE: "롯데",
  HANA: "하나",
  BC: "BC",
  NH: "NH농협",
  WOORI: "우리",
  KAKAOBANK: "카카오뱅크",
};

export const EASY_PAY_LABEL: Record<EasyPayProvider, string> = {
  KAKAOPAY: "카카오페이",
  NAVERPAY: "네이버페이",
  TOSSPAY: "토스페이",
};

/** 주문 결제 · 교환 재발송비 결제가 같이 쓰는 선택 모양(`OrderDto.PaymentSelection`) */
export interface PaymentSelection {
  method: PaymentMethod;
  cardIssuer?: CardIssuer;
  easyPayProvider?: EasyPayProvider;
}

/** 지금 열려 있는 결제수단 — 빈 배열이면 그 수단 자체를 숨긴다 */
export interface PaymentMethods {
  cardIssuers: Array<CardIssuer>;
  easyPayProviders: Array<EasyPayProvider>;
}

/**
 * 결제창 재료(`OrderDto.PaymentWindow`) — 서버가 **평평하게** 내린다.
 * SDK는 `card.cardCompany` · `easyPay.easyPayProvider`로 받으므로 `toPortOneRequest`가 옮긴다.
 */
export interface PaymentWindow {
  /** 주문 결제 `{주문번호}-{시도}` · 반품·교환 배송비 결제 `clm-{청구}-{시도}` */
  paymentId: string;
  storeId: string;
  channelKey: string;
  orderName: string;
  totalAmount: number;
  currency: string;
  payMethod: PaymentMethod;
  cardCompany: string | null;
  easyPayProvider: string | null;
  customer: {
    fullName: string;
    phoneNumber: string;
    email: string | null;
  };
}

/** 포트원 결제창이 끝나며 돌려준 값 — 힌트일 뿐이고 판정은 서버가 다시 한다 */
export interface PortOneClientResult {
  code: string | null;
  message: string | null;
  txId: string | null;
}

/** 주문 결제 상태 — 앱이 실제로 가르는 것은 READY · PAID · FAILED · CANCEL_REQUESTED · CANCELLED_MISMATCH */
export type PaymentStatus =
  | "READY"
  | "PAID"
  | "FAILED"
  | "EXPIRED"
  | "SUPERSEDED"
  | "CANCELLED"
  | "CANCEL_REQUESTED"
  | "CANCELLED_MISMATCH"
  | "CANCEL_FAILED";

/** 반품·교환 배송비 결제 상태 */
export type ClaimPaymentStatus = "READY" | "PAID" | "FAILED" | "CANCEL_REQUESTED" | "CANCELLED";

/** 결제가 완성될 만큼 골랐는가 — 수단만 고르고 세부를 비워 두면 결제창에서 실패한다 */
export function isPaymentSelectionComplete(selection: Partial<PaymentSelection> | null): boolean {
  if (!selection?.method) {
    return false;
  }
  return selection.method === "CARD" ? !!selection.cardIssuer : !!selection.easyPayProvider;
}

/** 「신한카드」 · 「카카오페이」 — 접수 화면·결제 정보 줄의 라벨 */
export function paymentSelectionLabel(selection: Partial<PaymentSelection> | null): string {
  if (selection?.method === "CARD" && selection.cardIssuer) {
    return `${CARD_ISSUER_LABEL[selection.cardIssuer]}카드`;
  }
  if (selection?.method === "EASY_PAY" && selection.easyPayProvider) {
    return EASY_PAY_LABEL[selection.easyPayProvider];
  }
  return "";
}
