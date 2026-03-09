import { useInfiniteList } from "@/common/hooks/useInfiniteList";
import { WISHLIST_QUERY_KEY } from "@/features/wishlist/constants/queryKey";
import { wishlistService } from "@/features/wishlist/services/wishlistService";
import { WishlistParams } from "@/features/wishlist/types/params";
import { WishlistResponse } from "@/features/wishlist/types/wishlist";

export function useGetWishlist(params: WishlistParams) {
  return useInfiniteList<WishlistResponse>({
    queryKey: [WISHLIST_QUERY_KEY.WISHLIST, params],
    queryFn: page => wishlistService.get({ ...params, page }),
  });
}
