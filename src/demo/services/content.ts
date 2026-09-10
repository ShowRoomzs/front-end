import { PageParams } from "@/common/types/page";
import { demoDelay } from "@/demo/config";
import { DEMO_PRODUCTS } from "@/demo/data/products";
import {
  DEMO_FAQS,
  DEMO_FAQ_CATEGORIES,
  DEMO_INQUIRY_CATEGORIES,
  DEMO_NOTICES,
  DEMO_ONE_TO_ONE,
} from "@/demo/data/support";
import { demoPage } from "@/demo/services/shared";
import { demoStore } from "@/demo/store";
import { Category } from "@/features/category/types/category";
import { InquiryHistoryParams, InquiryRequest, InquirySummary } from "@/features/inquiry/types/inquiry";
import { TermsDocumentDetail, TermsType } from "@/features/terms/types/terms";

// ── 공지사항 ────────────────────────────────────────────────

export const demoNoticeService = {
  getNoticeList: (params: PageParams) => demoDelay(demoPage(DEMO_NOTICES, params)),
  getNoticeDetail: (noticeId: number) =>
    demoDelay(DEMO_NOTICES.find(item => item.id === noticeId) ?? DEMO_NOTICES[0]),
};

// ── FAQ ────────────────────────────────────────────────────

export const demoFaqService = {
  getList: (params?: { category?: string; keyword?: string }) => {
    const keyword = params?.keyword?.trim().toLowerCase();

    return demoDelay(
      DEMO_FAQS.filter(faq => !params?.category || faq.category === params.category).filter(
        faq =>
          !keyword ||
          faq.question.toLowerCase().includes(keyword) ||
          faq.answer.toLowerCase().includes(keyword)
      )
    );
  },
  getCategories: () => demoDelay(DEMO_FAQ_CATEGORIES),
};

// ── 1:1 문의 ────────────────────────────────────────────────

export const demoInquiryService = {
  getCategories: () => demoDelay(DEMO_INQUIRY_CATEGORIES),

  create: async (data: InquiryRequest) => {
    const category = DEMO_INQUIRY_CATEGORIES.find(item => item.key === data.type);

    DEMO_ONE_TO_ONE.unshift({
      id: demoStore.nextId(),
      type: data.type,
      typeName: category?.description ?? "기타",
      content: data.content,
      imageUrls: data.imageUrls ?? [],
      orderId: null,
      order: null,
      status: "WAITING",
      answerContent: null,
      answeredAt: null,
      createdAt: new Date().toISOString(),
      writerNickname: "수민",
      writerProfileImageUrl: null,
      answererName: null,
    });
    return { inquiryId: demoStore.nextId() };
  },

  getHistory: (params: PageParams & InquiryHistoryParams) => {
    const items = params.status
      ? DEMO_ONE_TO_ONE.filter(item => item.status === params.status)
      : DEMO_ONE_TO_ONE;

    return demoDelay(demoPage(items, params));
  },

  getSummary: (): Promise<InquirySummary> =>
    demoDelay({
      oneToOneTotal: DEMO_ONE_TO_ONE.length,
      oneToOneWaiting: DEMO_ONE_TO_ONE.filter(item => item.status === "WAITING").length,
      productTotal: 2,
      productWaiting: 1,
    }),

  getDetail: (inquiryId: number) =>
    demoDelay(DEMO_ONE_TO_ONE.find(item => item.id === inquiryId) ?? DEMO_ONE_TO_ONE[0]),

  update: async () => undefined,
  delete: async () => undefined,
};

// ── 약관 ────────────────────────────────────────────────────

const TERMS: Array<TermsDocumentDetail> = [
  {
    documentId: 5001,
    name: "서비스 이용약관",
    type: "TERMS_OF_SERVICE",
    typeName: "서비스 이용약관",
    target: "USER",
    targetName: "일반 회원",
    version: "v1.2",
    effectiveDate: "2026-07-01",
    content:
      "<h3>제1조 (목적)</h3><p>본 약관은 주식회사 쇼룸즈가 제공하는 공동구매 중개 서비스의 이용과 관련하여 회사와 회원 간의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.</p>" +
      "<h3>제2조 (정의)</h3><p>“쇼룸”이란 크리에이터가 공동구매를 개설하고 게시물을 발행하는 공간을 말합니다.</p>" +
      "<h3>제3조 (중개자의 지위)</h3><p>회사는 통신판매중개자로서 공동구매의 거래 당사자가 아니며, 상품의 정보·거래·배송·환불에 대한 책임은 각 판매자에게 있습니다.</p>",
  },
  {
    documentId: 5002,
    name: "개인정보 처리방침",
    type: "PRIVACY_POLICY",
    typeName: "개인정보 처리방침",
    target: "USER",
    targetName: "일반 회원",
    version: "v1.1",
    effectiveDate: "2026-07-01",
    content:
      "<h3>1. 수집하는 개인정보 항목</h3><p>회원가입 시 소셜 계정 식별자, 닉네임, 이메일을 수집하며 본인인증 과정에서 이름·생년월일·성별·휴대폰번호를 수집합니다.</p>" +
      "<h3>2. 이용 목적</h3><p>회원 식별, 주문·배송 처리, 고객 문의 응대, 서비스 개선을 위해 이용합니다.</p>" +
      "<h3>3. 보유 기간</h3><p>회원 탈퇴 시 즉시 파기하며, 전자상거래법 등 관계 법령에 따라 보존이 필요한 정보는 해당 기간 동안 보관합니다.</p>",
  },
  {
    documentId: 5003,
    name: "마케팅 정보 수신 동의",
    type: "MARKETING_CONSENT",
    typeName: "마케팅 정보 수신 동의",
    target: "USER",
    targetName: "일반 회원",
    version: "v1.0",
    effectiveDate: "2026-03-01",
    content:
      "<p>회사는 신규 공동구매 소식과 혜택 정보를 앱 푸시·문자·이메일로 발송할 수 있습니다.</p>" +
      "<p>수신 동의는 선택 사항이며, 동의하지 않아도 서비스 이용에 제한이 없습니다. 마이 &gt; 설정에서 언제든 철회하실 수 있습니다.</p>",
  },
];

export const demoTermsService = {
  getList: (params?: { type?: TermsType }) =>
    demoDelay(TERMS.filter(item => !params?.type || item.type === params.type)),
  getDetail: (documentId: number) =>
    demoDelay(TERMS.find(item => item.documentId === documentId) ?? TERMS[0]),
};

// ── 카테고리 · 위시리스트 ───────────────────────────────────

const CATEGORIES: Array<Category> = [
  { categoryId: 10, name: "스킨케어", order: 1, iconUrl: "", parentId: null, filters: [] },
  { categoryId: 20, name: "클렌징", order: 2, iconUrl: "", parentId: null, filters: [] },
  { categoryId: 30, name: "선케어", order: 3, iconUrl: "", parentId: null, filters: [] },
  { categoryId: 40, name: "메이크업", order: 4, iconUrl: "", parentId: null, filters: [] },
  { categoryId: 50, name: "헤어·바디", order: 5, iconUrl: "", parentId: null, filters: [] },
];

export const demoCategoryService = {
  get: () => demoDelay(CATEGORIES),
};

export const demoWishlistService = {
  get: (params: { page?: number; size?: number }) =>
    demoDelay(
      demoPage(
        DEMO_PRODUCTS.slice(0, 4).map(product => ({
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
          gender: "FEMALE" as const,
          isDisplay: true,
          isRecommended: false,
          productNotice: product.productNotice ?? {},
          description: product.description,
          createdAt: new Date().toISOString(),
          status: product.status,
          likeCount: 100,
          wishCount: 40,
          reviewCount: 0,
          isWished: true,
        })),
        params
      )
    ),
  create: async () => undefined,
  delete: async () => undefined,
};
