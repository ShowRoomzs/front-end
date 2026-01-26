import { Gender } from "@/common/types/gender";
import { PageResponse } from "@/common/types/page";

interface ProductPrice {
  regularPrice: number;
  discountRate: number;
  salePrice: number;
  maxBenefitPrice: number;
}

interface ProductStatus {
  isOutOfStock: boolean;
  isOutOfStockForced: boolean;
}

export interface Product {
  categoryId: number;
  categoryName: string;
  createdAt: string;
  deliveryEstimatedDays: number;
  deliveryFee: number;
  deliveryFreeThreshold: number;
  deliveryType: string; // TODO : 타입 정의
  description: string;
  gender: Gender; // ? 왜있지
  id: number;
  isDisplay: boolean;
  isRecommended: boolean;
  isWished: boolean;
  likeCount: number;
  marketId: number;
  marketName: "number";
  name: number;
  price: ProductPrice;
  productNotice: string; // JSON 형태 > 파싱 필요
  productNumber: string;
  purchasePrice: number;
  representativeImageUrl: string;
  reviewCount: number;
  sellerProductCode: string;
  status: ProductStatus;
  tags: string | null; // JSON 형태 > 파싱 필요
  thumbnailUrl: string;
}

export type ProductListResponse = PageResponse<Product>;
