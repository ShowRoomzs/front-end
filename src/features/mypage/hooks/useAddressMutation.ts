import { useAddAddressMutation } from "@/features/mypage/hooks/useAddAddressMutation";
import { useUpdateAddressMutation } from "@/features/mypage/hooks/useUpdateAddressMutation";

export function useAddressMutation() {
  const addAddressMutation = useAddAddressMutation();
  const updateAddressMutation = useUpdateAddressMutation();

  return {
    addAddressMutation,
    updateAddressMutation,
  };
}
