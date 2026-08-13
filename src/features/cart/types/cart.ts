import { ProductPrice } from "@/features/product/types/product";

export interface CreateCartItem {
  variantId: number;
  quantity: number;
}
export type CreateCartRequest = Array<CreateCartItem>;
export type UpdateCartRequest = CreateCartItem;

interface Stock {
  stock: number;
  isOutOfStock: boolean;
  isOutOfStockForced: boolean;
}

export interface CartItem {
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

export interface CartResponse {
  items: Array<CartItem>;
  summary: CartSummary;
}
