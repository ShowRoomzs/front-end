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
