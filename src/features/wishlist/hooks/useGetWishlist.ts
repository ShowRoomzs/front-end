import { useInfiniteQuery } from "@tanstack/react-query";

import { PageInfo } from "@/common/types/page";
import { WISHLIST_QUERY_KEY } from "@/features/wishlist/constants/queryKey";
import { wishlistService } from "@/features/wishlist/services/wishlistService";
import { WishlistParams } from "@/features/wishlist/types/params";
import { WishlistProductType, WishlistResponse } from "@/features/wishlist/types/wishlist";

export function useGetWishlist(params: WishlistParams) {
  const { page: _page, ...paramsWithoutPage } = params;

  const query = useInfiniteQuery({
    queryKey: [WISHLIST_QUERY_KEY.WISHLIST, paramsWithoutPage],
    queryFn: async ({ pageParam }) => {
      const response = await wishlistService.getWishlist({ ...params, page: pageParam });

      return response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: WishlistResponse) =>
      lastPage.pageInfo.hasNext ? lastPage.pageInfo.currentPage + 1 : undefined,
  });

  const products: Array<WishlistProductType> = query.data?.pages.flatMap(page => page.data) ?? [];
  const pageInfo: PageInfo | undefined = query.data?.pages.at(-1)?.pageInfo;

  return {
    ...query,
    data: { products, pageInfo },
    products,
    pageInfo,
  };
}
