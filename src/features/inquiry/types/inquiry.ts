import { PageParams } from "@/common/types/page";

export type InquiryStatus = "WAITING" | "ANSWERED";

export interface InquiryCategoryDetail {
  key: string;
  description: string;
}

export interface InquiryCategory {
  key: string;
  description: string;
  details: Array<InquiryCategoryDetail>;
}

export interface Inquiry {
  id: number;
  type: string;
  typeName: string;
  detailType: string;
  detailTypeName: string;
  content: string;
  imageUrls: Array<string>;
  status: InquiryStatus;
  answerContent: string | null;
  answeredAt: string | null;
  createdAt: string;
}

export type InquiryListParams = PageParams;

export interface InquiryRequest {
  type: string;
  detailType: string;
  content: string;
  imageUrls?: Array<string>;
}
