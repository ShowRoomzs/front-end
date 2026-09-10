import { PageParams } from "@/common/types/page";
import { demoDelay } from "@/demo/config";
import { demoProductGroupBuy } from "@/demo/data/groupBuys";
import { DEMO_PRODUCTS, demoProduct } from "@/demo/data/products";
import {
  DEMO_MY_PRODUCT_INQUIRIES,
  DEMO_PRODUCT_INQUIRY_CATEGORIES,
  demoProductInquiries,
} from "@/demo/data/support";
import { demoPage } from "@/demo/services/shared";
import { demoStore } from "@/demo/store";
import { Product, ProductDetail, StockResponse } from "@/features/product/types/product";
import {
  ProductInquiryRequest,
  PublicProductInquiry,
  PublicProductInquiryList,
} from "@/features/product/types/productInquiry";

function toListItem(product: ProductDetail): Product {
  return {
    id: product.id,
    productNumber: `SZ-${product.id}`,
    name: product.name,
    sellerProductCode: `${product.marketId}-${product.id}`,
    representativeImageUrl: product.representativeImageUrl,
    thumbnailUrl: product.representativeImageUrl,
    categoryId: 10,
    categoryName: "스킨케어",
    marketId: product.marketId,
    marketName: product.marketName,
    price: {
      regularPrice: product.regularPrice,
      discountRate: product.discountRate,
      salePrice: product.salePrice,
      maxBenefitPrice: product.salePrice,
    },
    discountRate: product.discountRate,
    gender: "FEMALE",
    isDisplay: true,
    isRecommended: true,
    productNotice: product.productNotice ?? {},
    description: product.description,
    createdAt: new Date().toISOString(),
    status: product.status,
    likeCount: 120 + (product.id % 7) * 31,
    wishCount: 80 + (product.id % 5) * 17,
    reviewCount: 0,
    isWished: false,
  };
}

export const demoProductService = {
  get: (params: { page?: number; size?: number }) =>
    demoDelay(demoPage(DEMO_PRODUCTS.map(toListItem), params)),

  /** 공구는 게시물 쪽이 정본이다 — 상품에 따로 적어 두면 D-day가 둘 사이에서 어긋난다 */
  getDetail: (productId: number) =>
    demoDelay({ ...demoProduct(productId), groupBuy: demoProductGroupBuy(productId) }),

  getStock: (productId: number, variantIds: Array<number>): Promise<StockResponse> => {
    const product = demoProduct(productId);

    return demoDelay({
      variants: variantIds.map(variantId => {
        const variant = product.variants.find(item => item.variantId === variantId);

        return {
          productId,
          variantId,
          stock: variant?.stock ?? 0,
          isOutOfStock: variant?.isOutOfStock ?? true,
          isOutOfStockForced: false,
          price: {
            regularPrice: variant?.regularPrice ?? product.regularPrice,
            discountRate: product.discountRate,
            salePrice: variant?.salePrice ?? product.salePrice,
            maxBenefitPrice: variant?.salePrice ?? product.salePrice,
          },
        };
      }),
    });
  },
};

/** 시연 중에 쓴 문의를 목록 맨 위에 얹는다 — 작성 → 목록 반영까지 한 흐름으로 보여 주기 위해서다 */
function withWritten(productId: number): Array<PublicProductInquiry> {
  const written: Array<PublicProductInquiry> = demoStore.writtenInquiries(productId).map(entry => ({
    id: entry.id,
    typeName: entry.typeName,
    content: entry.content,
    secret: entry.secret,
    status: "WAITING",
    answerContent: null,
    authorName: "수민",
    createdAt: entry.createdAt,
    answeredAt: null,
  }));

  return [...written, ...demoProductInquiries(productId)];
}

export const demoProductInquiryService = {
  getPublicList: (productId: number): Promise<PublicProductInquiryList> => {
    const items = withWritten(productId);

    return demoDelay({ totalCount: items.length, items });
  },

  getCategories: () => demoDelay(DEMO_PRODUCT_INQUIRY_CATEGORIES),

  create: async (productId: number, data: ProductInquiryRequest) => {
    const category = DEMO_PRODUCT_INQUIRY_CATEGORIES.find(item => item.key === data.type);

    demoStore.addInquiry({
      productId,
      typeName: category?.description ?? "기타",
      content: data.content,
      secret: !!data.secret,
    });
    return { inquiryId: demoStore.nextId() };
  },

  update: async () => undefined,

  getDetail: (inquiryId: number) =>
    demoDelay(DEMO_MY_PRODUCT_INQUIRIES.find(item => item.id === inquiryId) ?? DEMO_MY_PRODUCT_INQUIRIES[0]),

  getHistory: (params: PageParams & { status?: string }) => {
    const items = params.status
      ? DEMO_MY_PRODUCT_INQUIRIES.filter(item => item.status === params.status)
      : DEMO_MY_PRODUCT_INQUIRIES;

    return demoDelay(demoPage(items, params));
  },

  delete: async () => undefined,
};
