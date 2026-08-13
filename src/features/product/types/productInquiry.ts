import { SizeParams } from "@/common/types/page";

export interface ProductInquiryCategoryDetail {
  key: string;
  description: string;
}
export interface ProductInquiryCategory {
  key: string;
  description: string;
  details: Array<ProductInquiryCategoryDetail>;
}

export type ProductInquiryCategoryResponse = Array<ProductInquiryCategory>;

export interface ProductInquiryRequest {
  type: string;
  content: string;
}

export interface ProductInquiryDetail {
  id: number;
  productId: number;
  shopName: string;
  productName: string;
  productImageUrl: string;
  type: string;
  typeName: string;
  content: string;
  status: ProductInquiryHistoryStatus;
  answerContent: string | null;
  createdAt: string;
  answeredAt: string | null;
}

export type ProductInquiryHistoryParams = SizeParams;

export type ProductInquiryHistoryStatus = "WAITING" | "ANSWERED";

export interface ProductInquiryHistory {
  id: number;
  productId: number;
  shopName: string;
  productName: string;
  productImageUrl: string;
  type: string;
  typeName: string;
  content: string;
  status: ProductInquiryHistoryStatus;
  answerContent: string | null;
  createdAt: string;
  answeredAt: string | null;
}
