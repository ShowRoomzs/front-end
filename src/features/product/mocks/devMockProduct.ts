import {
  DEV_MOCK_GROUP_BUY_ID,
  DEV_MOCK_PRODUCT_ID,
  DEV_MOCK_VARIANT_IDS,
} from "@/features/product/mocks/devMockIds";
import { ProductDetail, StockResponse, Variant } from "@/features/product/types/product";

/**
 * DEV 목업 상품 — 진행 중 공구 · 옵션 세 개(하나는 품절) · 무료배송 기준 있음.
 * 응답은 1.2초 늦게 준다 — 스켈레톤(300ms 넘는 대기)과 크로스페이드를 함께 보려는 것이다.
 */
const RESPONSE_DELAY = 1200;

const REGULAR_PRICE = 32000;
const SALE_PRICE = 24900;

const VARIANTS: Array<Variant> = [
  { name: "21호 라이트", stock: 12, isOutOfStock: false },
  { name: "23호 내추럴", stock: 3, isOutOfStock: false },
  { name: "25호 베이지", stock: 0, isOutOfStock: true },
].map((variant, index) => ({
  variantId: DEV_MOCK_VARIANT_IDS[index],
  name: variant.name,
  regularPrice: REGULAR_PRICE,
  salePrice: SALE_PRICE,
  stock: variant.stock,
  isOutOfStock: variant.isOutOfStock,
  isRepresentative: index === 0,
  optionIds: [DEV_MOCK_VARIANT_IDS[index]],
}));

const DETAIL: ProductDetail = {
  id: DEV_MOCK_PRODUCT_ID,
  name: "[DEV 목업] 수분 광채 쿠션 파운데이션 SPF50+ 본품 15g",
  representativeImageUrl: "",
  coverImageUrls: [],
  marketId: DEV_MOCK_GROUP_BUY_ID,
  marketName: "DEV 목업 브랜드",
  brandSiteUrl: null,
  regularPrice: REGULAR_PRICE,
  discountRate: 22,
  salePrice: SALE_PRICE,
  groupBuyId: DEV_MOCK_GROUP_BUY_ID,
  groupBuyNumber: "DEV-990001",
  groupBuyStatus: "IN_PROGRESS",
  groupBuy: {
    dday: 3,
    isClosed: false,
    showroomId: DEV_MOCK_GROUP_BUY_ID,
    showroomName: "DEV 목업 쇼룸",
    showroomImageUrl: null,
  },
  status: { isOutOfStock: false, isOutOfStockForced: false },
  delivery: {
    shippingLeadDays: 2,
    deliveryFee: 3000,
    freeShippingThreshold: 50000,
    remoteAreaSurcharge: 3000,
    returnFee: 3000,
    exchangeFee: 6000,
  },
  description:
    "<p>DEV 목업 상품의 상세 설명입니다.</p>" +
    "<p>탭 밑줄 · 스켈레톤 · 옵션 시트 · 장바구니 담기를 확인하려고 둔 상품으로, 서버에는 없습니다.</p>" +
    "<p>".concat("본문 길이를 채우는 줄입니다. ".repeat(40), "</p>"),
  productNotice: {
    capacityWeight: "15g",
    mainSpecs: "모든 피부",
    expirationPeriod: "제조일로부터 36개월",
  },
  optionGroups: [
    {
      optionGroupId: DEV_MOCK_VARIANT_IDS[0],
      name: "호수",
      options: VARIANTS.map(variant => ({ optionId: variant.variantId, name: variant.name, price: 0 })),
    },
  ],
  variants: VARIANTS,
  sellerInfo: {
    companyName: "DEV 목업 상사",
    representativeName: "홍길동",
    businessRegistrationNumber: "000-00-00000",
    mailOrderRegNumber: "제0000-서울-0000호",
    businessAddress: "서울특별시 어딘가 1",
    csNumber: "02-000-0000",
    email: "dev@example.com",
  },
};

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getDevMockProductDetail(): Promise<ProductDetail> {
  await wait(RESPONSE_DELAY);
  return DETAIL;
}

export async function getDevMockStock(variantIds: Array<number>): Promise<StockResponse> {
  return {
    variants: VARIANTS.filter(variant => variantIds.includes(variant.variantId)).map(variant => ({
      productId: DEV_MOCK_PRODUCT_ID,
      variantId: variant.variantId,
      stock: variant.stock,
      isOutOfStock: variant.isOutOfStock,
      isOutOfStockForced: false,
      price: {
        regularPrice: REGULAR_PRICE,
        discountRate: DETAIL.discountRate,
        salePrice: SALE_PRICE,
        maxBenefitPrice: SALE_PRICE,
      },
    })),
  };
}

export function getDevMockVariant(variantId: number) {
  return VARIANTS.find(variant => variant.variantId === variantId);
}

export const DEV_MOCK_PRODUCT = DETAIL;
