import { SizeParams } from "@/common/types/page";

export interface WishlistParams extends SizeParams {
  categoryId: number | null;
}
