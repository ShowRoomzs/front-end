import { PageParams } from "@/common/types/page";

export interface InquiryCategoryDetail {
  key: string;
  description: string;
}

export interface InquiryCategory {
  key: string;
  description: string;
  details: Array<InquiryCategoryDetail>;
}

export type InquiryCategoryResponse = Array<InquiryCategory>;

export interface InquiryRequest {
  type: string;
  detailType: string;
  content: string;
  imageUrls?: Array<string>;
}

export type InquiryHistoryParams = PageParams;

export type InquiryHistoryStatus = "WAITING" | "ANSWERED";

export interface InquiryHistory {
  id: number;
  type: string;
  typeName: string;
  detailType: string;
  detailTypeName: string;
  content: string;
  imageUrls: Array<string>;
  status: InquiryHistoryStatus;
  answerContent: string | null;
  createdAt: string;
  answeredAt: string | null;
}
