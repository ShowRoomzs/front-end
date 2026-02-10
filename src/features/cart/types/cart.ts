import { PageResponse } from "@/common/types/page";
import { ProductPrice } from "@/features/product/types/product";

// TODO : 여러개 등록 가능하도록 개선 요청
export interface CreateCartRequest {
  variantId: number;
  quantity: number;
}

export type UpdateCartRequest = CreateCartRequest;

interface Stock {
  stock: number;
  isOutOfStock: boolean;
  isOutOfStockForced: boolean;
}

export interface CartItemResponse {
  cartId: number;
  productId: number;
  variantId: number;
  productName: string;
  thumbnailUrl: string;
  marketId: number;
  marketName: string;
  optionName: string;
  quantity: number;
  price: ProductPrice;
  deliveryFee: number;
  stock: Stock;
}

interface CartSummary {
  regularTotal: number;
  saleTotal: number;
  discountTotal: number;
  deliveryFeeTotal: number;
  finalTotal: number;
}

export interface CartResponse extends PageResponse<CartItemResponse> {
  summary: CartSummary;
}
