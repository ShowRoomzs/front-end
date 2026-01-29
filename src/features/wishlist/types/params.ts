import { PageParams } from "@/common/types/page";

export interface WishlistParams extends PageParams {
  categoryId: number | null;
}
