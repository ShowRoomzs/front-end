import { ProductDetail } from "@/features/product/types/product";

/**
 * 시안 C7의 `saleState` — 화면 전체를 가르는 축이다(갤러리 딤 · 배지 · 하단 CTA · 차단 모달).
 *
 * **품절과 마감을 하나로 뭉치지 않는다.** 둘 다 살 수 없는 상태지만 사용자에게 남은 길이
 * 다르기 때문이다 — 품절은 다른 옵션이 살아 있을 수 있어 되돌아갈 곳이 있고, 마감은 이
 * 공구 자체가 끝나 다음 공구를 기다리는 수밖에 없다. 문구도 모달도 그래서 갈린다.
 */
export type ProductSaleState = "ON_SALE" | "CLOSED" | "SOLD_OUT";

export function resolveSaleState(product: ProductDetail): ProductSaleState {
  // 공구가 끝났으면 재고가 남아 있어도 살 수 없다 — 마감이 품절보다 앞선다
  if (product.groupBuy?.isClosed) {
    return "CLOSED";
  }
  if (product.status?.isOutOfStock || product.status?.isOutOfStockForced) {
    return "SOLD_OUT";
  }
  return "ON_SALE";
}

/** 가격 아래 공구 줄의 배지 — 시안 `closedBadge` */
export function saleStateBadgeLabel(state: ProductSaleState) {
  return state === "SOLD_OUT" ? "품절" : "공구 마감";
}

/** 하단 CTA 위 한 줄 — 시안 `closedMsg` */
export function saleStateMessage(state: ProductSaleState) {
  return state === "SOLD_OUT" ? "준비된 수량이 모두 소진되었어요" : "이 공동구매는 마감되었어요";
}
