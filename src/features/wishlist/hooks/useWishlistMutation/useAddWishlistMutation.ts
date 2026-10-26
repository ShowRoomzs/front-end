import { useMutation } from "@tanstack/react-query";

import { getInvalidateFns } from "./config";

import { toast } from "@/common/providers/ToastProvider";
import { SUSPENSION_BLOCKED } from "@/features/account/constants/suspension";
import { resolveErrorCode } from "@/features/order/utils/orderFormat";
import { wishlistService } from "@/features/wishlist/services/wishlistService";

export function useAddWishlistMutation(invalidateOnSuccess = true) {
  return useMutation({
    mutationFn: wishlistService.create,
    onSuccess: (_data, productId) => {
      if (invalidateOnSuccess) {
        getInvalidateFns(productId).forEach(fn => fn());
      }
    },
    // C20 — 상품 좋아요는 화면이 먼저 하트를 채우고 실패하면 되돌린다. 왜 되돌아갔는지 알려 준다
    onError: error => {
      if (resolveErrorCode(error) === "USER_SUSPENDED") {
        toast.show(SUSPENSION_BLOCKED.LIKE);
      }
    },
  });
}
