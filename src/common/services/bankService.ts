import { apiInstance } from "@/common/lib/apiInstance";
import { BankResponse } from "@/common/types/bank";

export const bankService = {
  get: async () => {
    const { data: response } = await apiInstance.get<BankResponse>("/common/banks");

    return response;
  },
};
