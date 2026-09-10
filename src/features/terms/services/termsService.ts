import { apiInstance } from "@/common/lib/apiInstance";
import { IS_DEMO } from "@/demo/config";
import { demoTermsService } from "@/demo/services/content";
import { TermsDocument, TermsDocumentDetail, TermsTarget, TermsType } from "@/features/terms/types/terms";

const realTermsService = {
  getList: async (params?: { type?: TermsType; target?: TermsTarget }) => {
    const { data } = await apiInstance.get<Array<TermsDocument>>("/common/terms", { params });

    return data;
  },

  getDetail: async (documentId: number) => {
    const { data } = await apiInstance.get<TermsDocumentDetail>(`/common/terms/${documentId}`);

    return data;
  },
};

/**
 * 데모 모드에서는 서버 대신 `src/demo`의 구현을 쓴다.
 *
 * 타입을 `typeof realTermsService`로 묶어 두어 데모 구현이 실제 계약에서 벗어나면
 * 컴파일이 잡는다 — 화면 코드는 지금과 하나도 달라지지 않는다.
 */
export const termsService: typeof realTermsService = IS_DEMO
  ? { ...realTermsService, ...demoTermsService }
  : realTermsService;
