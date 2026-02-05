import { PageResponse } from "@/common/types/page";
import { Product } from "@/features/product/types/product";

export type WishlistProductType = Product;

export type WishlistResponse = PageResponse<WishlistProductType>;
