import { PublicProductInquiry, PublicProductInquiryList } from "@/features/product/types/productInquiry";

/**
 * ⚠️ 임시 목업 — C7 문의 탭을 실물 데이터 없이 확인하기 위한 자리다.
 *
 * 서버에 상품별 **공개** 문의 목록 API가 없다. `/v1/user/product-inquiries`는 로그인한 사람의
 * 자기 문의만 주고 작성자 이름도 내려주지 않아, 목록도 건수도 만들 수 없다.
 * 그대로 두면 문의 탭이 계속 "준비 중" 안내로만 남아 아코디언·비밀글·답변 상태 같은 규칙을
 * 검토할 수 없으므로, **실제 조회가 실패했을 때만** 이 샘플로 떨어진다.
 *
 * **삭제하는 법** — 공개 목록 API가 열리면 `productInquiryService.getPublicList`의 catch 한
 * 블록과 이 파일을 지우면 된다. 타입(`PublicProductInquiry`)은 그대로 쓴다.
 *
 * 값은 `productId`로 결정한다 — 열 때마다 달라지면 펼쳐 둔 항목이 바뀌어 검토가 안 된다.
 */
const INQUIRIES: Array<Omit<PublicProductInquiry, "id">> = [
  {
    typeName: "성분·사용법",
    authorName: "수민초록",
    createdAt: "2026-08-08T10:20:00",
    answeredAt: "2026-08-09T09:10:00",
    secret: false,
    status: "ANSWERED",
    content:
      "민감성인데 아침에도 써도 괜찮을까요? 자외선 차단제를 덧바를 예정이고, 여름에는 유분이 많아지는 편이라 무거운 제형은 피하고 싶습니다.",
    answerContent:
      "네, 자극 테스트를 완료한 제품으로 아침저녁 모두 사용 가능합니다. 제형이 가벼워 자외선 차단제와 함께 쓰셔도 밀리지 않으며, 처음에는 2~3방울 소량으로 시작해 보시길 권합니다.",
  },
  {
    typeName: "옵션·구성",
    authorName: "현지",
    createdAt: "2026-08-09T14:02:00",
    answeredAt: "2026-08-09T18:30:00",
    secret: true,
    status: "ANSWERED",
    content: "",
    answerContent: "",
  },
  {
    typeName: "재입고",
    authorName: "지은맑음",
    createdAt: "2026-08-10T08:41:00",
    answeredAt: null,
    secret: false,
    status: "WAITING",
    content: "리필은 본품과 같은 용량인가요?",
    answerContent: null,
  },
  {
    typeName: "배송",
    authorName: "윤아",
    createdAt: "2026-08-07T11:15:00",
    answeredAt: "2026-08-07T16:40:00",
    secret: false,
    status: "ANSWERED",
    content: "제주도인데 배송비가 얼마나 추가되나요?",
    answerContent:
      "제주 지역은 3,000원이 추가되며, 결제 단계에서 배송지 우편번호를 입력하시면 자동으로 계산됩니다.",
  },
  {
    typeName: "성분·사용법",
    authorName: "하늘바다",
    createdAt: "2026-08-06T20:05:00",
    answeredAt: "2026-08-07T10:00:00",
    secret: false,
    status: "ANSWERED",
    content: "레티놀 제품과 같이 써도 되나요?",
    answerContent:
      "함께 사용하실 수 있습니다. 다만 같은 시간대에 겹쳐 바르기보다 아침에는 본 제품, 저녁에 레티놀을 쓰시는 것을 권합니다.",
  },
  {
    typeName: "옵션·구성",
    authorName: "민서",
    createdAt: "2026-08-05T09:30:00",
    answeredAt: "2026-08-06T09:20:00",
    secret: false,
    status: "ANSWERED",
    content: "리필 구성에도 펌프가 들어 있나요?",
    answerContent: "리필에는 펌프가 포함되지 않습니다. 본품 용기의 펌프를 그대로 사용해 주세요.",
  },
  {
    typeName: "재입고",
    authorName: "서연가을",
    createdAt: "2026-08-04T13:12:00",
    answeredAt: "2026-08-05T11:00:00",
    secret: false,
    status: "ANSWERED",
    content: "50ml 대용량은 이번 공구에 없나요?",
    answerContent: "이번 공동구매에는 30ml 구성만 준비되어 있습니다. 대용량은 다음 공구에서 검토 중입니다.",
  },
  {
    typeName: "기타",
    authorName: "채원",
    createdAt: "2026-08-03T17:48:00",
    answeredAt: "2026-08-04T10:30:00",
    secret: false,
    status: "ANSWERED",
    content: "선물 포장도 가능한가요?",
    answerContent: "옵션에서 선물 포장 쇼핑백을 추가하시면 함께 발송해 드립니다.",
  },
];

/**
 * 시안의 건수(12)는 목록(8건)보다 많다 — 의도된 값이다.
 * 머리의 건수는 **전체 기준**이고 목록은 잘려 있다는 사실을 그대로 확인하기 위한 샘플이다.
 */
const TOTAL_COUNT = 12;

export function buildProductInquiryMock(productId: number): PublicProductInquiryList {
  return {
    totalCount: TOTAL_COUNT,
    items: INQUIRIES.map((inquiry, index) => ({ ...inquiry, id: productId * 100 + index })),
  };
}
