import { DEMO_PRODUCT_IMAGE } from "@/demo/images";
import { Faq, FaqCategory } from "@/features/faq/types/faq";
import { InquiryCategory, InquiryDetail } from "@/features/inquiry/types/inquiry";
import { NoticeDetail } from "@/features/notice/types/notice";
import {
  ProductInquiryCategory,
  ProductInquiryHistory,
  PublicProductInquiry,
} from "@/features/product/types/productInquiry";

/** 공지 · FAQ · 문의 — 마이 탭 아래쪽 화면을 채우는 읽기 전용 콘텐츠 */

function daysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

// ── 공지사항 ────────────────────────────────────────────────

export const DEMO_NOTICES: Array<NoticeDetail> = [
  {
    id: 7001,
    title: "추석 연휴 배송 및 고객센터 운영 안내",
    pinned: true,
    createdDate: daysAgo(3),
    content:
      "<p>안녕하세요, 쇼룸즈입니다.</p><p>추석 연휴 기간 배송과 고객센터 운영 일정을 안내드립니다.</p>" +
      "<p><b>주문 마감</b> 9월 24일(수) 오후 2시까지 결제 완료된 주문은 연휴 전 출고됩니다.</p>" +
      "<p><b>배송 재개</b> 9월 29일(월)부터 순차 출고되며, 택배사 물량에 따라 1~2일 지연될 수 있습니다.</p>" +
      "<p><b>고객센터</b> 9월 25일(목)~28일(일) 휴무이며, 문의는 앱 내 1:1 문의로 남겨 주시면 순차 답변드립니다.</p>",
  },
  {
    id: 7002,
    title: "공동구매 마감 및 환불 정책 변경 안내",
    pinned: true,
    createdDate: daysAgo(12),
    content:
      "<p>2026년 10월 1일부터 공동구매 마감 후 환불 정책이 변경됩니다.</p>" +
      "<p>기존에는 마감 후 24시간 이내에만 취소가 가능했으나, 앞으로는 <b>발송 전까지</b> 마이 > 주문 내역에서 직접 취소하실 수 있습니다.</p>" +
      "<p>발송 이후에는 기존과 같이 수령 후 7일 이내 반품 신청이 가능합니다.</p>",
  },
  {
    id: 7003,
    title: "쇼룸즈 1.0 정식 출시",
    pinned: false,
    createdDate: daysAgo(28),
    content:
      "<p>쇼룸즈가 정식 출시되었습니다.</p>" +
      "<p>좋아하는 크리에이터의 쇼룸을 팔로우하면 새 공동구매와 게시물을 홈 피드에서 가장 먼저 만나실 수 있습니다.</p>" +
      "<p>앞으로도 더 나은 경험으로 찾아뵙겠습니다. 감사합니다.</p>",
  },
];

// ── FAQ ────────────────────────────────────────────────────

export const DEMO_FAQ_CATEGORIES: Array<FaqCategory> = [
  { key: "ORDER", description: "주문·결제" },
  { key: "DELIVERY", description: "배송" },
  { key: "RETURN", description: "교환·반품" },
  { key: "ACCOUNT", description: "회원" },
];

export const DEMO_FAQS: Array<Faq> = [
  {
    id: 1,
    category: "ORDER",
    categoryName: "주문·결제",
    question: "공동구매는 일반 주문과 무엇이 다른가요?",
    answer:
      "공동구매는 정해진 기간 동안 주문을 모아 한 번에 발송하는 방식입니다. 마감 시각까지 주문하실 수 있고, 마감 후 순차적으로 출고됩니다. 같은 공구에 담은 상품은 배송비가 한 번만 부과됩니다.",
  },
  {
    id: 2,
    category: "ORDER",
    categoryName: "주문·결제",
    question: "주문을 취소하고 싶어요.",
    answer:
      "발송 전이라면 마이 > 주문 내역에서 직접 취소하실 수 있습니다. 발송이 시작된 뒤에는 수령 후 반품으로 진행해 주세요.",
  },
  {
    id: 3,
    category: "DELIVERY",
    categoryName: "배송",
    question: "언제 발송되나요?",
    answer:
      "공동구매 마감 후 영업일 기준 2~3일 내 순차 발송됩니다. 상품마다 발송 시점이 다를 수 있어 상품 상세의 [배송정보]를 확인해 주세요.",
  },
  {
    id: 4,
    category: "DELIVERY",
    categoryName: "배송",
    question: "제주·도서산간도 배송되나요?",
    answer: "가능합니다. 제주는 3,000원, 그 외 도서산간은 5,000원의 추가 배송비가 결제 단계에서 계산됩니다.",
  },
  {
    id: 5,
    category: "RETURN",
    categoryName: "교환·반품",
    question: "반품은 어떻게 신청하나요?",
    answer:
      "배송 완료 후 7일 이내에 마이 > 주문 내역에서 신청하실 수 있습니다. 단순 변심의 경우 왕복 배송비가 부과됩니다.",
  },
  {
    id: 6,
    category: "RETURN",
    categoryName: "교환·반품",
    question: "개봉한 화장품도 반품이 되나요?",
    answer:
      "화장품은 개봉·사용 후 청약철회가 제한될 수 있습니다. 불량이나 오배송인 경우에는 개봉 여부와 관계없이 교환·반품이 가능합니다.",
  },
  {
    id: 7,
    category: "ACCOUNT",
    categoryName: "회원",
    question: "닉네임을 바꾸고 싶어요.",
    answer: "마이 > 설정 > 닉네임 변경에서 바꾸실 수 있습니다. 닉네임은 30일에 한 번 변경 가능합니다.",
  },
  {
    id: 8,
    category: "ACCOUNT",
    categoryName: "회원",
    question: "탈퇴하면 주문 내역도 사라지나요?",
    answer:
      "전자상거래법에 따라 주문·결제 기록은 5년간 보관됩니다. 그 외 프로필·팔로우·좋아요 정보는 즉시 삭제됩니다.",
  },
];

// ── 1:1 문의 ────────────────────────────────────────────────

export const DEMO_INQUIRY_CATEGORIES: Array<InquiryCategory> = [
  { key: "ORDER", description: "주문·결제" },
  { key: "DELIVERY", description: "배송" },
  { key: "RETURN", description: "교환·반품" },
  { key: "ACCOUNT", description: "회원 정보" },
  { key: "ETC", description: "기타" },
];

export const DEMO_ONE_TO_ONE: Array<InquiryDetail> = [
  {
    id: 6001,
    type: "DELIVERY",
    typeName: "배송",
    content: "제주도로 주문했는데 추가 배송비가 결제 화면에 안 보여요. 나중에 따로 청구되나요?",
    imageUrls: [],
    orderId: null,
    order: null,
    status: "ANSWERED",
    answerContent:
      "안녕하세요, 쇼룸즈입니다. 제주 추가 배송비 3,000원은 배송지를 입력하시면 결제 직전 단계에서 합계에 자동으로 더해집니다. 별도로 청구되는 금액은 없습니다.",
    answeredAt: daysAgo(4),
    createdAt: daysAgo(5),
    writerNickname: "수민",
    writerProfileImageUrl: null,
    answererName: "쇼룸즈 운영팀",
  },
  {
    id: 6002,
    type: "ACCOUNT",
    typeName: "회원 정보",
    content: "카카오로 가입했는데 네이버 계정으로 바꿀 수 있을까요?",
    imageUrls: [],
    orderId: null,
    order: null,
    status: "WAITING",
    answerContent: null,
    answeredAt: null,
    createdAt: daysAgo(1),
    writerNickname: "수민",
    writerProfileImageUrl: null,
    answererName: null,
  },
];

// ── 상품 문의 ───────────────────────────────────────────────

export const DEMO_PRODUCT_INQUIRY_CATEGORIES: Array<ProductInquiryCategory> = [
  { key: "INGREDIENT_USAGE", description: "성분·사용법" },
  { key: "DELIVERY", description: "배송" },
  { key: "RESTOCK", description: "재입고" },
  { key: "OPTION", description: "옵션" },
  { key: "ETC", description: "기타" },
];

interface InquirySeed {
  typeName: string;
  author: string;
  days: number;
  answerDays: number | null;
  secret?: boolean;
  content: string;
  answer?: string;
}

const COMMON_INQUIRIES: Array<InquirySeed> = [
  {
    typeName: "성분·사용법",
    author: "수민초록",
    days: 3,
    answerDays: 2,
    content:
      "민감성인데 아침에도 써도 괜찮을까요? 자외선 차단제를 덧바를 예정이고, 여름에는 유분이 많아지는 편이라 무거운 제형은 피하고 싶습니다.",
    answer:
      "네, 자극 테스트를 완료한 제품으로 아침저녁 모두 사용 가능합니다. 제형이 가벼워 자외선 차단제와 함께 쓰셔도 밀리지 않으며, 처음에는 2~3방울 소량으로 시작해 보시길 권합니다.",
  },
  {
    typeName: "옵션",
    author: "현지",
    days: 4,
    answerDays: 4,
    secret: true,
    content: "",
  },
  {
    typeName: "재입고",
    author: "지은맑음",
    days: 5,
    answerDays: null,
    content: "품절된 옵션은 언제쯤 다시 들어오나요? 알림 받을 수 있는 방법이 있을까요?",
  },
  {
    typeName: "배송",
    author: "윤아",
    days: 7,
    answerDays: 7,
    content: "제주도인데 배송비가 얼마나 추가되나요?",
    answer: "제주 지역은 3,000원이 추가되며, 결제 단계에서 배송지 우편번호를 입력하시면 자동으로 계산됩니다.",
  },
  {
    typeName: "성분·사용법",
    author: "하늘바다",
    days: 9,
    answerDays: 8,
    content: "레티놀 제품과 같이 써도 되나요?",
    answer:
      "함께 사용하실 수 있습니다. 다만 같은 시간대에 겹쳐 바르기보다 아침에는 본 제품, 저녁에 레티놀을 쓰시는 것을 권합니다.",
  },
  {
    typeName: "옵션",
    author: "민서",
    days: 11,
    answerDays: 10,
    content: "선물 포장도 함께 되나요?",
    answer: "선물 포장은 준비되어 있지 않지만, 배송 메모에 남겨 주시면 완충재를 한 겹 더 넣어 보내드립니다.",
  },
  {
    typeName: "기타",
    author: "채원",
    days: 14,
    answerDays: 13,
    content: "리뷰 이벤트는 따로 없나요?",
    answer: "지금은 진행하고 있지 않습니다. 새 이벤트가 열리면 공지사항과 알림으로 안내드리겠습니다.",
  },
  {
    typeName: "재입고",
    author: "서연가을",
    days: 18,
    answerDays: 17,
    content: "다음 공구는 언제 열리나요?",
    answer: "보통 4~6주 간격으로 열립니다. 쇼룸을 팔로우해 두시면 새 공구가 열릴 때 알림을 보내드립니다.",
  },
];

/** 상품마다 같은 문의 묶음을 쓰되 id만 상품별로 갈라 둔다 — 시연에서 어느 상품을 열어도 채워져 있다 */
export function demoProductInquiries(productId: number): Array<PublicProductInquiry> {
  return COMMON_INQUIRIES.map((seed, index) => ({
    id: productId * 1000 + index,
    typeName: seed.typeName,
    content: seed.content,
    secret: !!seed.secret,
    status: seed.answerDays === null ? "WAITING" : "ANSWERED",
    answerContent: seed.answer ?? null,
    authorName: seed.author,
    createdAt: daysAgo(seed.days),
    answeredAt: seed.answerDays === null ? null : daysAgo(seed.answerDays),
  }));
}

/** 마이 > 문의 내역의 상품 문의 탭 — 데모 사용자가 남긴 문의 */
export const DEMO_MY_PRODUCT_INQUIRIES: Array<ProductInquiryHistory> = [
  {
    id: 6101,
    productId: 1001,
    shopName: "라보에이치",
    productName: "아누아 어성초 77% 수딩 세럼 30ml",
    productImageUrl: DEMO_PRODUCT_IMAGE["anua-serum"].main,
    type: "INGREDIENT_USAGE",
    typeName: "성분·사용법",
    content: "임신 중에도 사용할 수 있는 성분인가요?",
    secret: false,
    imageUrls: [],
    status: "ANSWERED",
    answerContent:
      "네, 임신 중 사용을 피해야 하는 성분(레티놀·살리실릭애씨드 등)은 들어 있지 않습니다. 다만 컨디션에 따라 반응이 다를 수 있으니 팔 안쪽에 먼저 테스트해 보시길 권합니다.",
    createdAt: daysAgo(6),
    answeredAt: daysAgo(5),
  },
  {
    id: 6102,
    productId: 1007,
    shopName: "코랄로지",
    productName: "온더바디 수퍼보타닉 바디워시 900ml",
    productImageUrl: DEMO_PRODUCT_IMAGE["onthebody-wash"].main,
    type: "RESTOCK",
    typeName: "재입고",
    content: "03 코랄피치 재입고 예정 있나요?",
    secret: false,
    imageUrls: [],
    status: "WAITING",
    answerContent: null,
    createdAt: daysAgo(2),
    answeredAt: null,
  },
];
