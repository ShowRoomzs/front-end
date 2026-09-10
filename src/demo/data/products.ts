import { DEMO_PRODUCT_IMAGE, DemoProductImages, DemoProductSlug } from "@/demo/images";
import {
  DeliveryInfo,
  OptionGroup,
  ProductDetail,
  ProductNotice,
  SellerInfo,
  Variant,
} from "@/features/product/types/product";

/**
 * 데모 상품 8종 — 실제로 파는 제품의 공식 컷을 그대로 쓴다.
 *
 * 지어낸 상품명보다 아는 제품이 훨씬 빨리 읽힌다. 미팅에서 화면을 보는 사람이
 * "이거 내가 쓰는 건데"라고 알아보는 순간 플랫폼이 돌아가고 있다는 인상이 생긴다.
 *
 * 옵션 구성은 일부러 갈라 두었다 — **옵션 시트의 다섯 가지 화면을 한 자리에서 보여 주려는 것**이고,
 * 상품 이름이 바뀌어도 이 구조는 그대로 둔다.
 *
 * | 보여 주는 화면 | 담당 상품 |
 * | --- | --- |
 * | 옵션 없음(수량만) | AHC 로션 |
 * | 1단 옵션 | Anua 토너 · Cetaphil 크림 · Paul Medison 로션 · Anua 세럼 |
 * | 2단 단계적 잠금 + 품절 행 | On:the Body 바디워시 (향 3 × 용량 2) |
 * | 목록 7줄 → 6줄에서 잘려 스크롤 | Kerasys 케라마이드 (구성 8) |
 * | 전체 품절 → 구매 잠김 | Elastine 샴푸 |
 */

export interface DemoBrand {
  marketId: number;
  marketName: string;
  brandSiteUrl: string;
  seller: SellerInfo;
}

/**
 * 판매자 정보는 데모용으로 지어낸 값이다.
 *
 * 사업자등록번호 · 통신판매업신고번호 · 주소 · 전화번호를 실제 회사 것으로 넣으면
 * 그 회사가 이 플랫폼에 입점한 것처럼 보인다. 브랜드 이름과 제품 사진까지만 실제를 쓰고
 * **법인 정보는 전부 가짜**로 둔 이유다.
 */
export const DEMO_BRANDS = {
  anua: {
    marketId: 101,
    marketName: "아누아",
    brandSiteUrl: "https://www.showroomz.shop",
    seller: {
      companyName: "아누아 공식스토어 (데모)",
      representativeName: "김현주",
      businessRegistrationNumber: "214-88-01234",
      mailOrderRegNumber: "제2025-서울강남-01821호",
      businessAddress: "서울특별시 강남구 논현로 132길 18, 4층",
      csNumber: "1600-2841",
      email: "cs@demo.example",
    },
  },
  ahc: {
    marketId: 102,
    marketName: "AHC",
    brandSiteUrl: "https://www.showroomz.shop",
    seller: {
      companyName: "AHC 공식스토어 (데모)",
      representativeName: "정세라",
      businessRegistrationNumber: "127-86-55210",
      mailOrderRegNumber: "제2025-경기성남-03390호",
      businessAddress: "경기도 성남시 분당구 판교로 255, 9층",
      csNumber: "1600-7742",
      email: "help@demo.example",
    },
  },
  cetaphil: {
    marketId: 103,
    marketName: "세타필",
    brandSiteUrl: "https://www.showroomz.shop",
    seller: {
      companyName: "세타필 공식스토어 (데모)",
      representativeName: "박지훈",
      businessRegistrationNumber: "533-81-00947",
      mailOrderRegNumber: "제2024-서울마포-04412호",
      businessAddress: "서울특별시 마포구 양화로 45, 8층",
      csNumber: "02-336-1180",
      email: "care@demo.example",
    },
  },
  paulmedison: {
    marketId: 104,
    marketName: "폴메디슨",
    brandSiteUrl: "https://www.showroomz.shop",
    seller: {
      companyName: "폴메디슨 공식스토어 (데모)",
      representativeName: "이수아",
      businessRegistrationNumber: "621-87-33018",
      mailOrderRegNumber: "제2025-서울성동-02207호",
      businessAddress: "서울특별시 성동구 연무장길 45, 2층",
      csNumber: "070-4123-9900",
      email: "hello@demo.example",
    },
  },
  onthebody: {
    marketId: 105,
    marketName: "온더바디",
    brandSiteUrl: "https://www.showroomz.shop",
    seller: {
      companyName: "온더바디 공식스토어 (데모)",
      representativeName: "최다은",
      businessRegistrationNumber: "448-81-72055",
      mailOrderRegNumber: "제2025-서울용산-01634호",
      businessAddress: "서울특별시 용산구 이태원로 200, 5층",
      csNumber: "02-798-5520",
      email: "body@demo.example",
    },
  },
  elastine: {
    marketId: 106,
    marketName: "엘라스틴",
    brandSiteUrl: "https://www.showroomz.shop",
    seller: {
      companyName: "엘라스틴 공식스토어 (데모)",
      representativeName: "한지우",
      businessRegistrationNumber: "310-81-44902",
      mailOrderRegNumber: "제2025-서울영등포-05118호",
      businessAddress: "서울특별시 영등포구 여의대로 108, 12층",
      csNumber: "080-024-0114",
      email: "hair@demo.example",
    },
  },
  kerasys: {
    marketId: 107,
    marketName: "케라시스",
    brandSiteUrl: "https://www.showroomz.shop",
    seller: {
      companyName: "케라시스 공식스토어 (데모)",
      representativeName: "오세린",
      businessRegistrationNumber: "205-86-17734",
      mailOrderRegNumber: "제2025-서울중구-02940호",
      businessAddress: "서울특별시 중구 청계천로 100, 7층",
      csNumber: "080-023-0100",
      email: "clinic@demo.example",
    },
  },
  // `Record<string, _>`가 아니라 `satisfies`다 — 그래야 `seed.brand` 오타를 tsc가 잡는다
} satisfies Record<string, DemoBrand>;

const DELIVERY: DeliveryInfo = {
  shippingLeadDays: 2,
  deliveryFee: 3000,
  freeShippingThreshold: 30000,
  remoteAreaSurcharge: 5000,
  returnFee: 3000,
  exchangeFee: 6000,
};

function notice(extra: Record<string, string>): ProductNotice {
  return {
    "용량 또는 중량": extra["용량 또는 중량"] ?? "본문 참조",
    "제품 주요 사양": extra["제품 주요 사양"] ?? "모든 피부용",
    사용기한: "제조일로부터 30개월 · 개봉 후 6개월",
    사용방법: extra["사용방법"] ?? "적당량을 덜어 부드럽게 펴 바릅니다",
    화장품제조업자: "(주)한국코스메틱연구소",
    화장품책임판매업자: extra["화장품책임판매업자"] ?? "",
    제조국: "대한민국",
    전성분: extra["전성분"] ?? "정제수, 부틸렌글라이콜, 글리세린…",
    "기능성 화장품 여부": extra["기능성 화장품 여부"] ?? "해당 없음",
    "사용할 때 주의사항": "상처 부위에는 사용을 피하고, 이상 발생 시 사용을 중지하세요",
    품질보증기준: "소비자분쟁해결기준(공정거래위원회 고시)에 따릅니다",
    "소비자상담 전화번호": extra["소비자상담 전화번호"] ?? "1600-0000",
  };
}

function description(paragraphs: Array<string>): string {
  return paragraphs
    .map(
      (p, i) =>
        `<p style="font:400 15px/1.85 -apple-system,sans-serif;color:#3C3C3C;padding:${
          i === 0 ? "0" : "16px"
        } 2px 0;margin:0">${p}</p>`
    )
    .join("");
}

interface OptionSeed {
  groupId: number;
  name: string;
  options: Array<{ optionId: number; name: string; price: number; soldOut?: boolean }>;
}

function buildOptionGroups(seeds: Array<OptionSeed>): Array<OptionGroup> {
  return seeds.map(seed => ({
    optionGroupId: seed.groupId,
    name: seed.name,
    options: seed.options.map(option => ({
      optionId: option.optionId,
      name: option.name,
      price: option.price,
    })),
  }));
}

/** 옵션 조합을 모두 펼쳐 variant로 만든다 — 한 축이라도 빠지면 옵션 시트가 아무것도 못 고른다 */
function buildVariants(productId: number, basePrice: number, seeds: Array<OptionSeed>): Array<Variant> {
  if (seeds.length === 0) {
    return [
      {
        variantId: productId * 100,
        name: "단일 상품",
        regularPrice: basePrice,
        salePrice: basePrice,
        stock: 40,
        isOutOfStock: false,
        isRepresentative: true,
        optionIds: [],
      },
    ];
  }

  let combos: Array<Array<OptionSeed["options"][number]>> = [[]];

  seeds.forEach(seed => {
    combos = combos.flatMap(combo => seed.options.map(option => [...combo, option]));
  });

  return combos.map((combo, index) => {
    const extra = combo.reduce((sum, option) => sum + option.price, 0);
    const soldOut = combo.some(option => option.soldOut);

    return {
      variantId: productId * 100 + index,
      name: combo.map(option => option.name).join(" · "),
      regularPrice: basePrice + extra + 13000,
      salePrice: basePrice + extra,
      stock: soldOut ? 0 : 12 + index,
      isOutOfStock: !!soldOut,
      isRepresentative: index === 0,
      optionIds: combo.map(option => option.optionId),
    };
  });
}

interface Seed {
  id: number;
  /** 상품 전체 품절 — 상세의 판매 종료 화면(회색 배지 · 팔로우 CTA)을 보여 주려고 하나를 둔다 */
  soldOut?: boolean;
  slug: string;
  name: string;
  brand: keyof typeof DEMO_BRANDS;
  regularPrice: number;
  salePrice: number;
  discountRate: number;
  options: Array<OptionSeed>;
  paragraphs: Array<string>;
  noticeExtra: Record<string, string>;
}

const SEEDS: Array<Seed> = [
  {
    id: 1001,
    slug: "anua-serum",
    name: "아누아 어성초 77% 수딩 세럼 30ml",
    brand: "anua",
    regularPrice: 32000,
    salePrice: 19900,
    discountRate: 37,
    options: [
      {
        groupId: 90011,
        name: "구성",
        options: [
          { optionId: 900111, name: "단품 30ml", price: 0 },
          { optionId: 900112, name: "30ml 2개 기획", price: 16000 },
          { optionId: 900113, name: "30ml + 토너 150ml", price: 14000 },
        ],
      },
    ],
    paragraphs: [
      "어성초 추출물을 77% 담아 붉은기와 열감을 가라앉히는 진정 세럼입니다. 나이아신아마이드와 아연을 함께 넣어 번들거림까지 함께 잡아 줍니다.",
      "가볍게 발려 다음 단계를 방해하지 않습니다. 세안 후 토너 다음 단계에서 3~4방울을 얼굴 전체에 펴 바르고, 붉은기가 올라오는 부위는 한 번 더 겹쳐 발라 주세요.",
      "민감성 피부 대상 자극 테스트를 완료했으며 인공향료를 넣지 않았습니다.",
    ],
    noticeExtra: {
      "용량 또는 중량": "30ml",
      "제품 주요 사양": "모든 피부용 · 민감성 사용 가능",
      사용방법: "토너 다음 단계에서 3~4방울을 얼굴 전체에 펴 바릅니다",
      전성분: "어성초추출물, 나이아신아마이드, 판테놀, 아연PCA, 히알루론산…",
      화장품책임판매업자: "아누아 공식스토어 (데모)",
      "소비자상담 전화번호": "1600-2841",
    },
  },
  {
    id: 1002,
    slug: "anua-toner",
    name: "아누아 어성초 77 하이알루론 수딩 토너 150ml",
    brand: "anua",
    regularPrice: 24000,
    salePrice: 15900,
    discountRate: 34,
    options: [
      {
        groupId: 90021,
        name: "용량",
        options: [
          { optionId: 900211, name: "150ml", price: 0 },
          { optionId: 900212, name: "250ml 대용량", price: 7000 },
        ],
      },
    ],
    paragraphs: [
      "세안 직후 당김을 잡아 주는 진정 토너입니다. 어성초에 5종 히알루론산을 더해 물처럼 얇게 스미면서도 수분을 오래 붙잡습니다.",
      "화장솜에 충분히 적셔 결을 따라 닦아 내거나, 손바닥에 덜어 얼굴을 감싸듯 눌러 흡수시켜 주세요. 건조한 날에는 두세 번 나눠 겹쳐 바르는 편이 좋습니다.",
    ],
    noticeExtra: {
      "용량 또는 중량": "150ml",
      "제품 주요 사양": "모든 피부용 · 민감성 사용 가능",
      사용방법: "세안 후 화장솜이나 손바닥에 덜어 얼굴 전체에 흡수시킵니다",
      전성분: "어성초추출물, 소듐하이알루로네이트, 판테놀, 알란토인…",
      화장품책임판매업자: "아누아 공식스토어 (데모)",
      "소비자상담 전화번호": "1600-2841",
    },
  },
  {
    id: 1003,
    slug: "ahc-lotion",
    name: "AHC 바이탈 골든 콜라겐 로션 140ml",
    brand: "ahc",
    // 옵션이 없는 상품 — 시트에 수량만 뜨는 화면을 보여 준다
    regularPrice: 28000,
    salePrice: 17900,
    discountRate: 36,
    options: [],
    paragraphs: [
      "콜라겐과 금 성분을 담아 탄력과 화사함을 함께 잡는 로션입니다. 끈적임 없이 감기면서 다음 날 아침까지 매끈한 결을 남깁니다.",
      "토너 다음 단계에서 적당량을 덜어 얼굴과 목까지 부드럽게 펴 발라 주세요. 건조한 계절에는 크림 전 단계로 쓰면 좋습니다.",
    ],
    noticeExtra: {
      "용량 또는 중량": "140ml",
      "제품 주요 사양": "모든 피부용",
      사용방법: "토너 다음 단계에서 얼굴과 목에 펴 바릅니다",
      전성분: "정제수, 글리세린, 가수분해콜라겐, 금, 나이아신아마이드…",
      화장품책임판매업자: "AHC 공식스토어 (데모)",
      "소비자상담 전화번호": "1600-7742",
    },
  },
  {
    id: 1004,
    slug: "cetaphil-cream",
    name: "세타필 모이스처라이징 크림 550g",
    brand: "cetaphil",
    regularPrice: 35000,
    salePrice: 22900,
    discountRate: 35,
    options: [
      {
        groupId: 90041,
        name: "구성",
        options: [
          { optionId: 900411, name: "550g 1개", price: 0 },
          { optionId: 900412, name: "550g 2개 기획", price: 19000 },
        ],
      },
    ],
    paragraphs: [
      "건성부터 극건성까지, 48시간 보습을 목표로 만든 대용량 크림입니다. 향과 색소를 넣지 않아 얼굴과 몸에 함께 쓸 수 있습니다.",
      "샤워 직후 물기가 남아 있을 때 바르면 흡수가 빠릅니다. 팔꿈치·무릎처럼 각질이 두꺼운 부위는 한 번 더 겹쳐 발라 주세요.",
      "민감성 피부 대상 테스트를 완료했습니다.",
    ],
    noticeExtra: {
      "용량 또는 중량": "550g",
      "제품 주요 사양": "건성 · 극건성 · 민감성 피부용 · 얼굴과 몸 겸용",
      사용방법: "샤워 후 물기가 남아 있을 때 전신에 펴 바릅니다",
      전성분: "정제수, 글리세린, 페트롤라툼, 다이메티콘, 판테놀…",
      화장품책임판매업자: "세타필 공식스토어 (데모)",
      "소비자상담 전화번호": "02-336-1180",
    },
  },
  {
    id: 1005,
    slug: "paulmedison",
    name: "폴메디슨 화이트머스크 바디로션 1077ml",
    brand: "paulmedison",
    regularPrice: 26000,
    salePrice: 14900,
    discountRate: 42,
    options: [
      {
        groupId: 90051,
        name: "구성",
        options: [
          { optionId: 900511, name: "1077ml 1개", price: 0 },
          { optionId: 900512, name: "1077ml 2개 기획", price: 12000 },
        ],
      },
    ],
    paragraphs: [
      "한 통으로 온 가족이 쓰는 1077ml 대용량 바디로션입니다. 화이트머스크 향이 은은하게 남아 샤워 뒤의 기분을 이어 줍니다.",
      "샤워 후 물기를 가볍게 닦고 전신에 펴 바르세요. 펌프형이라 젖은 손으로도 한 손에 덜어 쓸 수 있습니다.",
    ],
    noticeExtra: {
      "용량 또는 중량": "1077ml",
      "제품 주요 사양": "모든 피부용 · 바디 전용",
      사용방법: "샤워 후 전신에 펴 바릅니다",
      전성분: "정제수, 글리세린, 세틸알코올, 시어버터, 향료…",
      화장품책임판매업자: "폴메디슨 공식스토어 (데모)",
      "소비자상담 전화번호": "070-4123-9900",
    },
  },
  {
    id: 1006,
    slug: "onthebody",
    name: "온더바디 수퍼보타닉 바디워시 900ml",
    brand: "onthebody",
    regularPrice: 19000,
    salePrice: 11900,
    discountRate: 37,
    // 2단 옵션 — 향을 고르기 전에는 용량이 잠긴다. 500ml 하나를 품절로 둬서 품절 행도 함께 보인다
    options: [
      {
        groupId: 90061,
        name: "향",
        options: [
          { optionId: 900611, name: "로즈 & 피오니", price: 0 },
          { optionId: 900612, name: "라벤더 & 로즈마리", price: 0 },
          { optionId: 900613, name: "레몬 & 버베나", price: 0 },
        ],
      },
      {
        groupId: 90062,
        name: "용량",
        options: [
          { optionId: 900621, name: "900ml", price: 0 },
          { optionId: 900622, name: "500ml", price: -3000, soldOut: true },
        ],
      },
    ],
    paragraphs: [
      "진짜 순한 약산성 바디워시입니다. 세 가지 향 모두 인공적이지 않게 잡아, 샤워 후 30분쯤 지나면 은은하게만 남습니다.",
      "샤워볼이나 손에 덜어 충분히 거품을 낸 뒤 몸을 부드럽게 마사지하고 헹궈 주세요.",
      "로즈 & 피오니는 포근하게, 라벤더 & 로즈마리는 차분하게, 레몬 & 버베나는 산뜻하게 마무리됩니다.",
    ],
    noticeExtra: {
      "용량 또는 중량": "900ml",
      "제품 주요 사양": "모든 피부용 · 약산성",
      사용방법: "샤워볼이나 손에 덜어 거품을 낸 뒤 몸을 마사지하고 헹굽니다",
      전성분: "정제수, 소듐라우로암포아세테이트, 글리세린, 식물추출물, 향료…",
      화장품책임판매업자: "온더바디 공식스토어 (데모)",
      "소비자상담 전화번호": "02-798-5520",
    },
  },
  {
    id: 1007,
    slug: "elastine",
    // 전체 품절 — 상세의 판매 종료 화면을 보여 주는 상품
    soldOut: true,
    name: "엘라스틴 프로틴클리닉 10000 모로칸 아르간오일 샴푸 1077ml",
    brand: "elastine",
    regularPrice: 24000,
    salePrice: 13900,
    discountRate: 42,
    options: [
      {
        groupId: 90071,
        name: "구성",
        options: [
          { optionId: 900711, name: "샴푸 1077ml", price: 0 },
          { optionId: 900712, name: "샴푸 + 트리트먼트 2종", price: 11000 },
        ],
      },
    ],
    paragraphs: [
      "LPP 단백질을 10000ppm 담은 고영양 샴푸입니다. 잦은 염색과 펌으로 비어 버린 모발 속을 채우는 데 초점을 맞췄습니다.",
      "모로칸 아르간 오일이 헹군 뒤에도 모발 겉을 감싸, 말리고 나면 부스스함이 눈에 띄게 줄어듭니다.",
      "젖은 모발에 충분히 거품을 내어 두피까지 마사지한 뒤 깨끗이 헹궈 주세요.",
    ],
    noticeExtra: {
      "용량 또는 중량": "1077ml",
      "제품 주요 사양": "손상모 · 건성모용",
      사용방법: "젖은 모발에 거품을 내어 두피까지 마사지한 뒤 헹굽니다",
      전성분: "정제수, 소듐라우레스설페이트, 가수분해단백질, 아르간커넬오일…",
      화장품책임판매업자: "엘라스틴 공식스토어 (데모)",
      "소비자상담 전화번호": "080-024-0114",
    },
  },
  {
    id: 1008,
    slug: "kerasys",
    name: "케라시스 어드밴스드 케라마이드 앰플 트리트먼트 1000ml",
    brand: "kerasys",
    regularPrice: 32000,
    salePrice: 18900,
    discountRate: 41,
    // 구성 8개 — 목록이 6줄에서 잘려 스크롤되는 화면을 보여 주는 상품
    options: [
      {
        groupId: 90081,
        name: "구성",
        options: [
          { optionId: 900811, name: "앰플 트리트먼트 1000ml", price: 0 },
          { optionId: 900812, name: "앰플 샴푸 1000ml", price: 0 },
          { optionId: 900813, name: "샴푸 + 트리트먼트 2종", price: 15000 },
          { optionId: 900814, name: "인텐시브 트리트먼트 튜브", price: -4000 },
          { optionId: 900815, name: "데미지 케어 미스트", price: -5000, soldOut: true },
          { optionId: 900816, name: "헤어 세럼", price: -2000 },
          { optionId: 900817, name: "앰플 스틱 6입", price: -3000 },
          { optionId: 900818, name: "미니 세럼 트래블", price: -8000, soldOut: true },
        ],
      },
    ],
    paragraphs: [
      "케라틴과 세라마이드를 함께 담아 극손상 모발에 보호막을 만드는 트리트먼트입니다. 30년간 쌓인 연구 데이터를 바탕으로 손상 단계별 라인을 갖췄습니다.",
      "샴푸 후 물기를 가볍게 짜고 모발 중간부터 끝까지 발라 3분 두었다가 헹궈 주세요. 두피에는 직접 닿지 않게 하는 편이 좋습니다.",
      "잦은 염색·펌으로 갈라지고 끊어지는 모발, 손 빗질이 안 될 만큼 엉키는 모발에 특히 맞습니다.",
    ],
    noticeExtra: {
      "용량 또는 중량": "1000ml",
      "제품 주요 사양": "극손상모 · 염색모용",
      사용방법: "샴푸 후 모발 중간부터 끝까지 바르고 3분 뒤 헹굽니다",
      전성분: "정제수, 세테아릴알코올, 가수분해케라틴, 세라마이드엔피, 아르지닌…",
      화장품책임판매업자: "케라시스 공식스토어 (데모)",
      "소비자상담 전화번호": "080-023-0100",
    },
  },
];

/** 상품 슬러그와 이미지 슬러그가 다른 것들 — 이미지 파일명이 더 길다 */
const IMAGE_SLUG: Record<string, DemoProductSlug> = {
  paulmedison: "paulmedison-lotion",
  onthebody: "onthebody-wash",
  elastine: "elastine-shampoo",
  kerasys: "kerasys-treatment",
};

function imagesOf(slug: string): DemoProductImages {
  const key = IMAGE_SLUG[slug] ?? (slug as DemoProductSlug);
  const images = DEMO_PRODUCT_IMAGE[key];

  if (!images) {
    // 여기서 조용히 undefined가 나가면 앱이 켜지자마자 흰 화면으로 죽는다 — 어느 슬러그인지 남긴다
    throw new Error(`데모 상품 이미지가 없다: ${slug}`);
  }

  return images;
}

function buildProduct(seed: Seed): ProductDetail {
  const brand = DEMO_BRANDS[seed.brand];
  const images = imagesOf(seed.slug);

  return {
    id: seed.id,
    name: seed.name,
    representativeImageUrl: images.main,
    coverImageUrls: [images.sub],
    marketId: brand.marketId,
    marketName: brand.marketName,
    brandSiteUrl: brand.brandSiteUrl,
    regularPrice: seed.regularPrice,
    discountRate: seed.discountRate,
    salePrice: seed.salePrice,
    groupBuyStatus: "IN_PROGRESS",
    status: { isOutOfStock: !!seed.soldOut, isOutOfStockForced: false },
    delivery: DELIVERY,
    description: description(seed.paragraphs),
    productNotice: notice(seed.noticeExtra),
    optionGroups: buildOptionGroups(seed.options),
    variants: buildVariants(seed.id, seed.salePrice, seed.options),
    sellerInfo: brand.seller,
  };
}

export const DEMO_PRODUCTS: Array<ProductDetail> = SEEDS.map(buildProduct);

export const DEMO_PRODUCT_BY_ID = new Map(DEMO_PRODUCTS.map(product => [product.id, product]));

export const DEMO_PRODUCT_SLUG_BY_ID = new Map(SEEDS.map(seed => [seed.id, seed.slug]));

/** 상세 이미지(세로로 긴 컷) — 상세정보 탭에서 본문 위에 네이티브로 그린다 */
export function demoDetailImageUrls(productId: number): Array<string> {
  const slug = DEMO_PRODUCT_SLUG_BY_ID.get(productId);

  return slug ? [imagesOf(slug).detail] : [];
}

export function demoProduct(productId: number): ProductDetail {
  return DEMO_PRODUCT_BY_ID.get(productId) ?? DEMO_PRODUCTS[0];
}
