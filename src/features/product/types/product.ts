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
interface ProductNotice {
  asInfo: string;
  color: string;
  manufactureDate: string;
  manufacturer: string;
  material: string;
  origin: string;
  qualityAssurance: string;
  size: string;
  washingMethod: string;
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
  name: string;
  price: ProductPrice;
  productNotice: string | ProductNotice; // JSON 형태 > 파싱 필요
  productNumber: string;
  purchasePrice: number;
  representativeImageUrl: string;
  reviewCount: number;
  sellerProductCode: string;
  status: ProductStatus;
  tags: Array<string> | string | null; // JSON 형태 > 파싱 필요
  thumbnailUrl: string;
}

export type ProductListResponse = PageResponse<Product>;

type Option = {
  optionId: number;
  name: string;
  price: number;
};

interface OptionGroup {
  optionGroupId: number;
  name: string;
  options: Array<Option>;
}

interface Variant {
  variantId: number;
  name: string;
  regularPrice: number;
  salePrice: number;
  stock: number;
  isRepresentative: boolean;
  isDisplay: boolean;
  optionIds: Array<number>;
}

export interface ProductDetail extends Omit<Product, "price"> {
  coverImageUrls: Array<string>;
  regularPrice: number;
  salePrice: number;
  isFreeDelivery: boolean;
  optionGroups: Array<OptionGroup>;
  variants: Array<Variant>;
  isFollowing: boolean;
}

export type ProductDetailResponse = ProductDetail;
