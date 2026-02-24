import { useInfiniteQuery } from "@tanstack/react-query";

import { PageInfo, PageResponse } from "@/common/types/page";
import { PRODUCT_INQUIRY_QUERY_KEY } from "@/features/product/constants/queryKey";
import { productInquiryService } from "@/features/product/services/productInquiryService";
import { ProductInquiryHistory, ProductInquiryHistoryParams } from "@/features/product/types/productInquiry";

export function useGetProductInquiryHistory(params: ProductInquiryHistoryParams) {
  const { page: _page, ...paramsWithoutPage } = params;

  const query = useInfiniteQuery({
    queryKey: [PRODUCT_INQUIRY_QUERY_KEY.INQUIRY_HISTORY, paramsWithoutPage],
    queryFn: async ({ pageParam }) => {
      const response = await productInquiryService.getHistory({ ...params, page: pageParam });

      return response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: PageResponse<ProductInquiryHistory>) =>
      lastPage.pageInfo.hasNext ? lastPage.pageInfo.currentPage + 1 : undefined,
  });

  const inquiries: Array<ProductInquiryHistory> = query.data?.pages.flatMap(page => page.content) ?? [];
  const pageInfo: PageInfo | undefined = query.data?.pages.at(-1)?.pageInfo;

  return {
    ...query,
    inquiries,
    pageInfo,
  };
}
