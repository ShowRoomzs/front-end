import { ShopType } from "@/common/types/shop";

export type SnsType = "INSTAGRAM" | "YOUTUBE" | "TIKTOK" | "X";
export type SnsLink = {
  snsType: SnsType;
  snsUrl: string;
};
export type SnsLinks = Array<SnsLink>;

export interface Market {
  shopId: number;
  shopName: string;
  shopImageUrl: string;
  shopDescription: string;
  shopUrl: string;
  shopType: ShopType;
  mainCategoryId: number;
  mainCategoryName: string;
  snsLinks: SnsLinks;
  followerCount: number;
  followed: boolean;
}
