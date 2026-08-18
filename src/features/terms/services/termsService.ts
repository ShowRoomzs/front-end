import { apiInstance } from "@/common/lib/apiInstance";
import { TermsDocument, TermsDocumentDetail, TermsTarget, TermsType } from "@/features/terms/types/terms";

export const termsService = {
  getList: async (params?: { type?: TermsType; target?: TermsTarget }) => {
    const { data } = await apiInstance.get<Array<TermsDocument>>("/common/terms", { params });

    return data;
  },

  getDetail: async (documentId: number) => {
    const { data } = await apiInstance.get<TermsDocumentDetail>(`/common/terms/${documentId}`);

    return data;
  },
};
