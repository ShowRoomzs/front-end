import { demoDelay } from "@/demo/config";
import { DEMO_PRODUCTS, demoProduct } from "@/demo/data/products";
import { demoStore } from "@/demo/store";
import {
  CartGroup,
  CartItem,
  CartRecommendationResponse,
  CartResponse,
  CreateCartRequest,
  UpdateCartRequest,
} from "@/features/cart/types/cart";

/**
 * 데모 장바구니.
 *
 * 합계·배송비는 **선택된 항목만으로** 다시 계산한다 — 체크를 바꿀 때마다 목록을 다시 받는
 * 실제 계약과 같게 두어야 무료배송 안내("○○원 더 담으면 무료")가 시연에서 살아난다.
 */

const DELIVERY_FEE = 3000;
const FREE_THRESHOLD = 30000;

function buildItem(
  entry: { cartId: number; productId: number; variantId: number; quantity: number },
  selectedIds: Array<number> | undefined
): CartItem {
  const product = demoProduct(entry.productId);
  const variant = product.variants.find(item => item.variantId === entry.variantId) ?? product.variants[0];
  const isSelected = selectedIds ? selectedIds.includes(entry.cartId) : true;

  return {
    cartId: entry.cartId,
    productId: product.id,
    variantId: variant.variantId,
    productName: product.name,
    thumbnailUrl: product.representativeImageUrl,
    marketId: product.marketId,
    marketName: product.marketName,
    optionName: product.optionGroups.length > 0 ? variant.name : "",
    quantity: entry.quantity,
    price: {
      regularPrice: variant.regularPrice,
      discountRate: product.discountRate,
      salePrice: variant.salePrice,
      maxBenefitPrice: variant.salePrice,
    },
    deliveryFee: DELIVERY_FEE,
    stock: { stock: variant.stock, isOutOfStock: variant.isOutOfStock, isOutOfStockForced: false },
    availability: {
      isPurchasable: !variant.isOutOfStock,
      reason: variant.isOutOfStock ? "SOLD_OUT" : null,
      label: variant.isOutOfStock ? "품절" : null,
      message: variant.isOutOfStock ? "준비된 수량이 모두 소진되었어요" : null,
    },
    isSelected: isSelected && !variant.isOutOfStock,
  };
}

function buildGroups(items: Array<CartItem>): Array<CartGroup> {
  const byMarket = new Map<number, Array<CartItem>>();

  items.forEach(item => {
    byMarket.set(item.marketId, [...(byMarket.get(item.marketId) ?? []), item]);
  });

  return [...byMarket.entries()].map(([marketId, groupItems]) => {
    const selectedTotal = groupItems
      .filter(item => item.isSelected)
      .reduce((sum, item) => sum + item.price.salePrice * item.quantity, 0);
    const hasSelectedItems = groupItems.some(item => item.isSelected);
    const isFreeShipping = selectedTotal >= FREE_THRESHOLD;

    return {
      marketId,
      marketName: groupItems[0].marketName,
      marketImageUrl: null,
      isClosed: false,
      items: groupItems,
      shipping: {
        deliveryFee: DELIVERY_FEE,
        freeShippingThreshold: FREE_THRESHOLD,
        hasSelectedItems,
        selectedProductTotal: selectedTotal,
        chargedDeliveryFee: !hasSelectedItems || isFreeShipping ? 0 : DELIVERY_FEE,
        isFreeShipping,
        amountToFreeShipping: !hasSelectedItems || isFreeShipping ? null : FREE_THRESHOLD - selectedTotal,
      },
    };
  });
}

function buildResponse(selectedIds?: Array<number>): CartResponse {
  const items = demoStore.cart().map(entry => buildItem(entry, selectedIds));
  const groups = buildGroups(items);
  const selected = items.filter(item => item.isSelected);

  const regularTotal = selected.reduce((sum, item) => sum + item.price.regularPrice * item.quantity, 0);
  const saleTotal = selected.reduce((sum, item) => sum + item.price.salePrice * item.quantity, 0);
  const deliveryFeeTotal = groups.reduce((sum, group) => sum + group.shipping.chargedDeliveryFee, 0);

  return {
    groups,
    summary: {
      regularTotal,
      saleTotal,
      discountTotal: regularTotal - saleTotal,
      deliveryFeeTotal,
      finalTotal: saleTotal + deliveryFeeTotal,
    },
  };
}

export const demoCartService = {
  get: (selectedCartItemIds?: Array<number>) => demoDelay(buildResponse(selectedCartItemIds)),

  getRecommendations: (limit?: number): Promise<CartRecommendationResponse> => {
    const inCart = new Set(demoStore.cart().map(entry => entry.productId));

    return demoDelay({
      products: DEMO_PRODUCTS.filter(product => !inCart.has(product.id))
        .slice(0, limit ?? 6)
        .map(product => ({
          productId: product.id,
          productName: product.name,
          thumbnailUrl: product.representativeImageUrl,
          marketId: product.marketId,
          marketName: product.marketName,
          price: {
            regularPrice: product.regularPrice,
            discountRate: product.discountRate,
            salePrice: product.salePrice,
            maxBenefitPrice: product.salePrice,
          },
          helpsFreeShipping: product.salePrice >= 15000,
        })),
    });
  },

  create: async (body: CreateCartRequest) => {
    demoStore.addToCart(body);
    return undefined;
  },

  update: async (cartId: number, body: UpdateCartRequest) => {
    demoStore.updateCart(cartId, body.variantId, body.quantity);
  },

  deleteMany: async (cartItemIds: Array<number>) => {
    demoStore.removeFromCart(cartItemIds);
    return undefined;
  },
};
