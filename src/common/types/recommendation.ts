import { PageParams, PageResponse } from "@/common/types/page";
import { ShopType } from "@/common/types/shop";
import { ProductPrice } from "@/features/product/types/product";

// 추천 상품, 마켓 파라미터 타입(추후 분리 가능성 존재)
export interface RecommendationParams extends PageParams {
  categoryId: number | null;
}

export interface RecommendedMarket {
  marketId: number;
  marketName: string;
  sellerId: 1;
  marketImageUrl: string;
  representativeProducts: Array<{
    productId: number;
    imageUrl: string;
  }>;
  marketDescription: string;
  marketUrl: string;
  shopType: ShopType;
  followCount: number;
  isFollowing: boolean;
  mainCategoryId: number;
}

export interface RecommendedProduct {
  id: number;
  productNumber: number;
  name: string;
  thumbnailUrl: string;
  price: Omit<ProductPrice, "maxBenefitPrice">;
  discountRate: number;
  wishCount: number;
  reviewCount: number;
  isRecommended: boolean;
  isWished: boolean;
}

export type RecommendedMarketResponse = PageResponse<RecommendedMarket>;
export type RecommendationResponse = PageResponse<RecommendedProduct>;
