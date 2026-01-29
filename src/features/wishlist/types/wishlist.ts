import { PageResponse } from "@/common/types/page";
import { ProductPrice } from "@/features/product/types/product";

export interface WishlistProductType {
  id: number;
  productNumber: string;
  name: string;
  thumbnailUrl: string;
  price: ProductPrice;
  isWished: boolean;
}

export type WishlistResponse = PageResponse<WishlistProductType>;
