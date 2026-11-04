import { apiInstance } from "@/common/lib/apiInstance";
import { PolicyValues } from "@/common/types/policyValues";

export const policyService = {
  getValues: async () => {
    const { data: response } = await apiInstance.get<PolicyValues>("/common/policy-values");

    return response;
  },
};
