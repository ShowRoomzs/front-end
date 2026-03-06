import { LimitParams } from "@/common/types/page";

export interface WishlistParams extends LimitParams {
  categoryId: number | null;
}
