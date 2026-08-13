import { PageResponse } from "@/common/types/page";
import { ShopType } from "@/common/types/shop";

export interface FollowingShop {
  shopId: number;
  shopName: string;
  shopImageUrl: string;
  shopType: ShopType;
}

export type FollowingListResponse = PageResponse<FollowingShop>;
