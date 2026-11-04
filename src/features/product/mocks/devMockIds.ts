/**
 * DEV 목업 상품의 번호 — 서버에 열 수 있는 공구 상품이 없을 때 상품 상세 · 옵션 시트 · 담기 ·
 * 장바구니 배지를 확인하려고 둔다. 진입: `showroomz://product/990001`.
 *
 * 서비스가 이 번호만 보고 목업으로 돌리므로, 번호만 이 파일에 두고 데이터는 DEV에서만
 * 동적으로 불러온다(`devMockProduct` · `devMockCart`). 실제 번호와 겹치지 않게 크게 잡았다.
 */
export const DEV_MOCK_PRODUCT_ID = 990001;
export const DEV_MOCK_GROUP_BUY_ID = 990001;
export const DEV_MOCK_VARIANT_IDS = [990011, 990012, 990013] as const;
/** 목업 장바구니 항목 번호는 이 값부터 매긴다 */
export const DEV_MOCK_CART_ID_BASE = 990100;

export function isDevMockProduct(productId?: number | null) {
  return __DEV__ && productId === DEV_MOCK_PRODUCT_ID;
}

export function isDevMockCartId(cartId: number) {
  return __DEV__ && cartId >= DEV_MOCK_CART_ID_BASE && cartId < DEV_MOCK_CART_ID_BASE + 1000;
}
