import { BundleProduct, ProductDetail, StockResponse } from "@/features/product/types/product";

/**
 * ⚠️ 임시 목업 — C7 상품 상세를 실물 데이터 없이 확인하기 위한 자리다.
 *
 * C1·C4·C5의 공구 게시물이 아직 목업(`features/post/mocks/groupBuyMock.ts`)이라, 거기서 만든
 * 상품 ID는 서버에 없다. 그대로 두면 **상품 행을 누르는 순간 404로 화면이 죽어** 공구 카드에서
 * 상품 상세로 이어지는 동선 자체를 검토할 수 없다.
 *
 * 그래서 **실제 조회가 실패했을 때만** 이 목업으로 떨어진다. 서버에 있는 상품은 언제나 진짜
 * 데이터로 열리고, 목업은 없는 상품에만 쓰인다.
 *
 * **삭제하는 법** — 공구 게시물이 실제 데이터로 바뀌면 `productService.getDetail`의 catch 한
 * 블록과 이 파일을 지우면 된다.
 *
 * 값은 `productId`로 결정한다 — 열 때마다 달라지면 옵션을 고르다 화면이 바뀌어 검토가 안 된다.
 */
const NAMES = [
  "시카 리페어 앰플 30ml 리필 2개 세트 기획",
  "진정 토너 패드 60매",
  "배리어 크림 50ml 대용량 리뉴얼",
];

const OPTION_GROUP_ID = 9001;
const SIZE_GROUP_ID = 9002;

/** 옵션 조합마다 하나씩 — 앞에서부터 (구성 × 용량) 순서로 짝지어 만든다 */
const COMPOSITIONS = [
  { optionId: 91001, name: "단품 30ml", extra: 0 },
  { optionId: 91002, name: "30ml + 리필 1개", extra: 14000 },
  { optionId: 91003, name: "30ml + 리필 2개", extra: 25000 },
];

const SIZES = [
  { optionId: 92001, name: "기본", extra: 0 },
  { optionId: 92002, name: "대용량", extra: 9000 },
];

const SELLER = {
  companyName: "주식회사 라보에이치",
  representativeName: "홍길동",
  businessRegistrationNumber: "000-00-00000",
  mailOrderRegNumber: "제 0000-서울강남-00000호",
  businessAddress: "서울특별시 강남구 ○○로 00",
  csNumber: "000-0000-0000",
  email: "brand@example.com",
};

const NOTICE = {
  "용량 또는 중량": "30ml (리필 30ml × 2)",
  "제품 주요 사양": "모든 피부용 · 민감성 사용 가능",
  사용기한: "제조일로부터 30개월 · 개봉 후 6개월",
  사용방법: "세안 후 3~4방울을 얼굴 전체에 펴 바릅니다",
  제조국: "대한민국",
  "기능성 화장품 여부": "해당 없음",
};

const DESCRIPTION = `
<p style="font:400 15px/1.85 -apple-system,sans-serif;color:#3C3C3C;padding:0 2px">
여름 내내 자외선과 냉방으로 지친 피부를 위해 만든 시카 라인입니다.
판테놀과 마데카소사이드를 함께 담아 자극 없이 진정과 보습을 동시에 잡아줍니다.
</p>
<p style="font:400 15px/1.85 -apple-system,sans-serif;color:#3C3C3C;padding:16px 2px 0">
아침저녁 세안 후 3~4방울을 얼굴 전체에 펴 바르고, 건조한 부위는 한 번 더 겹쳐 발라 주세요.
리필은 본품과 동일한 30ml 용량으로, 본품 용기를 그대로 쓰실 수 있게 구성했습니다.
</p>
`.trim();

/** 목업 상품 하나 — 옵션 2단(구성 × 용량) 조합을 모두 갖춰 옵션 시트까지 확인할 수 있다 */
export function buildProductMock(productId: number): ProductDetail {
  const name = NAMES[productId % NAMES.length];
  const salePrice = 24900;

  const variants = COMPOSITIONS.flatMap((composition, compositionIndex) =>
    SIZES.map((size, sizeIndex) => {
      const index = compositionIndex * SIZES.length + sizeIndex;

      return {
        variantId: productId * 100 + index,
        name: `${composition.name} · ${size.name}`,
        regularPrice: 38000 + composition.extra + size.extra,
        salePrice: salePrice + composition.extra + size.extra,
        stock: index === 1 ? 0 : 20,
        // 한 조합만 품절로 둔다 — 옵션 시트의 취소선·회색 처리를 눈으로 확인하려고
        isOutOfStock: index === 1,
        isRepresentative: index === 0,
        optionIds: [composition.optionId, size.optionId],
      };
    })
  );

  return {
    id: productId,
    name,
    representativeImageUrl: "",
    coverImageUrls: [],
    marketId: 9000,
    marketName: "라보에이치",
    brandSiteUrl: "https://example.com",
    regularPrice: 38000,
    discountRate: 34,
    salePrice,
    groupBuyStatus: "IN_PROGRESS",
    groupBuy: {
      dday: 3,
      isClosed: false,
      showroomId: 1,
      showroomName: "제니의 뷰티룸",
      showroomImageUrl: null,
    },
    status: { isOutOfStock: false, isOutOfStockForced: false },
    delivery: {
      shippingLeadDays: 2,
      deliveryFee: 3000,
      freeShippingThreshold: 30000,
      remoteAreaSurcharge: 5000,
      returnFee: 3000,
      exchangeFee: 6000,
    },
    description: DESCRIPTION,
    productNotice: NOTICE,
    optionGroups: [
      { optionGroupId: OPTION_GROUP_ID, name: "구성", options: buildOptions(COMPOSITIONS) },
      { optionGroupId: SIZE_GROUP_ID, name: "용량", options: buildOptions(SIZES) },
    ],
    variants,
    sellerInfo: SELLER,
  };
}

/**
 * 같은 공구의 다른 상품 (C7 상세정보 탭 맨 아래 [이 공구에서 함께 판매 중]).
 *
 * ⚠️ 서버 미제공 — 상품 상세는 `groupBuyStatus` 문자열 하나만 주고, 이 상품이 어느
 * 공구에 묶여 있는지도 그 공구에 다른 상품이 있는지도 알 수 없다. 공구 자체가 목업이라
 * 묶음도 목업으로 둔다.
 *
 * **삭제하는 법** — 공구가 실제 데이터로 바뀌면 `ProductBundleSection`에 서버 목록을
 * 넣고 이 함수만 지우면 된다.
 */
const BUNDLE = [
  { name: "진정 토너 패드 60매", discountRate: 33, salePrice: 17500 },
  { name: "배리어 크림 50ml 대용량 리뉴얼", discountRate: 32, salePrice: 21900 },
  { name: "마일드 클렌징 폼 150ml", discountRate: 26, salePrice: 14000 },
];

export function buildBundleMock(productId: number): Array<BundleProduct> {
  return BUNDLE.map((item, index) => ({
    ...item,
    // 지금 보고 있는 상품과 아이디가 겹치면 자기 자신으로 돌아오는 카드가 생긴다.
    // 그 아이디도 서버에는 없으므로 눌러 들어가면 `buildProductMock`이 다시 받는다 —
    // 목적지의 이름·가격은 카드와 다르다. 목업끼리 어꺋나는 것이지 버그가 아니다.
    id: productId + index + 1,
    thumbnailUrl: null,
  }));
}

function buildOptions(source: Array<{ optionId: number; name: string; extra: number }>) {
  return source.map(option => ({ optionId: option.optionId, name: option.name, price: option.extra }));
}

/** 목업 상품의 재고 — 상세가 만든 variant와 같은 규칙을 따른다(둘이 어긋나면 옵션이 잠긴다) */
export function buildStockMock(productId: number, variantIds: Array<number>): StockResponse {
  const { variants, discountRate } = buildProductMock(productId);

  return {
    variants: variantIds.map(variantId => {
      const variant = variants.find(item => item.variantId === variantId);

      return {
        productId,
        variantId,
        stock: variant?.stock ?? 0,
        isOutOfStock: variant?.isOutOfStock ?? true,
        isOutOfStockForced: false,
        price: {
          regularPrice: variant?.regularPrice ?? 0,
          discountRate,
          salePrice: variant?.salePrice ?? 0,
          maxBenefitPrice: variant?.salePrice ?? 0,
        },
      };
    }),
  };
}
