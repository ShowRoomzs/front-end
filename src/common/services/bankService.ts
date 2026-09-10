import { apiInstance } from "@/common/lib/apiInstance";
import { BankResponse } from "@/common/types/bank";
import { IS_DEMO } from "@/demo/config";
import { demoBankService } from "@/demo/services/settings";

const realBankService = {
  get: async () => {
    const { data: response } = await apiInstance.get<BankResponse>("/common/banks");

    return response;
  },
};

/** 데모 모드에서는 서버 대신 `src/demo`의 구현을 쓴다 */
export const bankService: typeof realBankService = IS_DEMO
  ? { ...realBankService, ...demoBankService }
  : realBankService;
