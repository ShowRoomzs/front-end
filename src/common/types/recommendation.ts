import { PageParams, PageResponse } from "@/common/types/page";
import { ProductPrice } from "@/features/product/types/product";

export interface RecommendationParams extends PageParams {
  categoryId: number | null;
}

interface RepresentativeProduct {
  id: 1;
  productNumber: string;
  name: string;
  thumbnailUrl: string;
  price: Omit<ProductPrice, "maxBenefitPrice">;
  isRecommended: boolean;
}

interface RecommendedProduct {
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

interface RecommendedMarket {
  marketId: number;
  marketName: string;
  marketImageUrl: string;
  mainCategoryId: number;
  mainCategoryName: string;
  followerCount: number;
  isFollowing: boolean;
  representativeProducts: Array<RepresentativeProduct>;
}

export interface RecommendationResponse extends PageResponse<RecommendedProduct> {
  recommendedMarkets: Array<RecommendedMarket>;
}
