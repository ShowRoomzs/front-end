/**
 * 상품정보제공고시 항목 이름 — 서버는 영문 키로 내려준다(`productNotice`, 파트너센터 등록 폼
 * `ProductDto.ProductNoticeRequest`의 필드 이름 그대로). 화면에는 시안 C7 「상품정보제공고시」 표의 이름을 쓴다.
 *
 * 시안에 없는 항목은 서버 스키마 설명을 따른다 — `manufacturerSeller`는 시안이 제조업자 · 책임판매업자 두 줄로
 * 나눴지만 서버는 한 칸으로 받으므로 한 줄로 합친 이름을 쓴다.
 *
 * 표는 이 순서대로 그린다(시안 순서 = 등록 폼 순서). 여기 없는 키가 오면 키 그대로 맨 뒤에 붙인다 —
 * 서버가 항목을 늘려도 내용이 사라지지 않게 하려는 것이다.
 */
export const PRODUCT_NOTICE_LABELS: Record<string, string> = {
  capacityWeight: "용량 또는 중량",
  mainSpecs: "제품 주요 사양",
  expirationPeriod: "사용기한",
  usageMethod: "사용방법",
  manufacturerSeller: "화장품제조업자·책임판매업자",
  origin: "제조국",
  ingredients: "전성분",
  functionalCosmeticApproval: "기능성 화장품 여부",
  precautions: "사용할 때 주의사항",
  qualityAssurance: "품질보증기준",
  customerServicePhone: "소비자상담 전화번호",
};

const NOTICE_ORDER = Object.keys(PRODUCT_NOTICE_LABELS);

/** 영문 키 · 값 쌍을 표 행(한글 이름)으로 바꾸고 시안 순서로 정렬한다 */
export function toNoticeRows(notice: Record<string, unknown>): Array<{ key: string; value: string }> {
  const rank = (key: string) => {
    const index = NOTICE_ORDER.indexOf(key);

    return index === -1 ? NOTICE_ORDER.length : index;
  };

  return Object.entries(notice)
    .filter(([, value]) => !!value)
    .sort(([a], [b]) => rank(a) - rank(b))
    .map(([key, value]) => ({ key: PRODUCT_NOTICE_LABELS[key] ?? key, value: String(value) }));
}
