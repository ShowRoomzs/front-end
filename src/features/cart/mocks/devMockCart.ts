import {
  CartGroup,
  CartItem,
  CartResponse,
  CreateCartRequest,
  UpdateCartRequest,
} from "@/features/cart/types/cart";
import { DEV_MOCK_CART_ID_BASE, DEV_MOCK_GROUP_BUY_ID } from "@/features/product/mocks/devMockIds";
import { DEV_MOCK_PRODUCT, getDevMockVariant } from "@/features/product/mocks/devMockProduct";

/**
 * DEV 목업 장바구니 — 목업 상품(`devMockIds`)을 담으면 서버로 보내지 않고 메모리에만 둔다.
 *
 * 조회 때 서버 응답 끝에 목업 공구 묶음 하나를 붙여, 헤더 배지 수 · 장바구니 화면이 실제처럼
 * 움직이게 한다(§08 배지 범프 확인용). 앱을 다시 띄우면 비워진다. 결제까지는 이어지지 않는다 —
 * 주문서는 서버가 계산하므로 목업 항목으로는 열리지 않는다.
 */
let items: Array<CartItem> = [];
let nextCartId = DEV_MOCK_CART_ID_BASE;

function toCartItem(variantId: number, quantity: number): CartItem | null {
  const variant = getDevMockVariant(variantId);

  if (!variant) {
    return null;
  }
  return {
    cartId: nextCartId++,
    productId: DEV_MOCK_PRODUCT.id,
    variantId,
    productName: DEV_MOCK_PRODUCT.name,
    thumbnailUrl: "",
    marketId: DEV_MOCK_PRODUCT.marketId,
    marketName: DEV_MOCK_PRODUCT.marketName,
    optionName: variant.name,
    quantity,
    price: {
      regularPrice: variant.regularPrice,
      discountRate: DEV_MOCK_PRODUCT.discountRate,
      salePrice: variant.salePrice,
      maxBenefitPrice: variant.salePrice,
    },
    deliveryFee: DEV_MOCK_PRODUCT.delivery.deliveryFee,
    stock: { stock: variant.stock, isOutOfStock: variant.isOutOfStock, isOutOfStockForced: false },
    availability: { isPurchasable: true, reason: null, label: null, message: null },
    isSelected: true,
  };
}

/** 같은 옵션을 또 담으면 서버처럼 수량을 더한다 */
export function addDevMockCartItems(request: CreateCartRequest) {
  request.forEach(({ variantId, quantity }) => {
    const existing = items.find(item => item.variantId === variantId);

    if (existing) {
      existing.quantity += quantity;
      return;
    }
    const created = toCartItem(variantId, quantity);

    if (created) {
      items = [...items, created];
    }
  });
}

export function updateDevMockCartItem(cartId: number, body: UpdateCartRequest) {
  items = items.map(item => (item.cartId === cartId ? { ...item, quantity: body.quantity } : item));
}

export function removeDevMockCartItems(cartIds: Array<number>) {
  items = items.filter(item => !cartIds.includes(item.cartId));
}

/** 서버 응답 끝에 목업 공구 묶음을 붙인다. 선택 목록을 안 보냈으면 서버처럼 전부 선택으로 본다 */
export function mergeDevMockCart(response: CartResponse, selectedCartItemIds?: Array<number>): CartResponse {
  if (items.length === 0) {
    return response;
  }
  const withSelection = items.map(item => ({
    ...item,
    isSelected: selectedCartItemIds ? selectedCartItemIds.includes(item.cartId) : true,
  }));
  const selected = withSelection.filter(item => item.isSelected);
  const regularTotal = selected.reduce((sum, item) => sum + item.price.regularPrice * item.quantity, 0);
  const saleTotal = selected.reduce((sum, item) => sum + item.price.salePrice * item.quantity, 0);
  const { deliveryFee, freeShippingThreshold } = DEV_MOCK_PRODUCT.delivery;
  const isFreeShipping = freeShippingThreshold !== null && saleTotal >= freeShippingThreshold;
  const chargedDeliveryFee = selected.length === 0 || isFreeShipping ? 0 : deliveryFee;

  const group: CartGroup = {
    groupBuyId: DEV_MOCK_GROUP_BUY_ID,
    groupBuyNumber: DEV_MOCK_PRODUCT.groupBuyNumber,
    groupBuyTitle: "DEV 목업 공구",
    endAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    dDay: 3,
    marketId: DEV_MOCK_PRODUCT.marketId,
    marketName: "DEV 목업 쇼룸",
    marketImageUrl: null,
    isClosed: false,
    items: withSelection,
    shipping: {
      deliveryFee,
      freeShippingThreshold,
      hasSelectedItems: selected.length > 0,
      selectedProductTotal: saleTotal,
      chargedDeliveryFee,
      isFreeShipping,
      amountToFreeShipping:
        selected.length === 0 || freeShippingThreshold === null || isFreeShipping
          ? null
          : freeShippingThreshold - saleTotal,
    },
  };
  const { summary } = response;

  return {
    groups: [...response.groups, group],
    summary: {
      regularTotal: summary.regularTotal + regularTotal,
      saleTotal: summary.saleTotal + saleTotal,
      discountTotal: summary.discountTotal + (regularTotal - saleTotal),
      deliveryFeeTotal: summary.deliveryFeeTotal + chargedDeliveryFee,
      finalTotal: summary.finalTotal + saleTotal + chargedDeliveryFee,
      selectedCount: summary.selectedCount + selected.length,
      selectableCount: summary.selectableCount + items.length,
      totalCount: summary.totalCount + items.length,
    },
  };
}
