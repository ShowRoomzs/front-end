import { CommonActions } from "@react-navigation/native";
import { useCallback, useEffect, useRef } from "react";
import { AppState } from "react-native";

import { useBottomSheet } from "@/common/hooks/useBottomSheet";
import { useBottomSheetContext } from "@/common/providers/BottomSheetProvider";
import { toast } from "@/common/providers/ToastProvider";
import { navigationRef } from "@/common/router/navigationRef";
import { HOME_ROUTES, MYPAGE_ROUTES, ROOT_ROUTES } from "@/common/router/routes";
import SuspensionNoticeSheet from "@/features/account/components/SuspensionNoticeSheet";
import { SUSPENSION_SHEET_ID } from "@/features/account/constants/suspension";
import {
  invalidateAccountStatus,
  useAccountStatus,
  useSuspension,
} from "@/features/account/hooks/useAccountStatus";
import { accountStatusService } from "@/features/account/services/accountStatusService";

/**
 * C20 계정 이용 정지의 **화면 밖** 일 — 앱에 하나만 둔다(`App`).
 *
 * - 정지 안내 시트를 여기서 등록한다. 배너 · 안내 줄의 [자세히]는 같은 id로 연다 — 화면마다 등록하면 한 화면이
 *   사라질 때 시트 등록도 함께 지워진다.
 * - 정지 후 첫 진입이면(`noticePending`) 시트를 자동으로 1회 띄우고 ack한다.
 * - 정지가 풀렸으면(`releaseNotice`) 토스트를 1회 띄우고 ack한다.
 * - 포그라운드로 돌아올 때 상태를 다시 받는다(서버 문서의 재조회 시점).
 */
export default function AccountStatusHost() {
  const { data } = useAccountStatus();
  const suspension = useSuspension();
  const { close } = useBottomSheetContext();
  const handledNoticeRef = useRef(false);
  const handledReleaseRef = useRef(false);

  const handlePressAppeal = useCallback(() => {
    close();
    if (!navigationRef.isReady()) {
      return;
    }
    // 답변 전 정지 문의가 있으면 새로 쓰지 않고 그 문의를 고친다 — 서버가 정지 1건당 1건만 받는다
    const params = suspension?.pendingAppealInquiryId
      ? { inquiryId: suspension.pendingAppealInquiryId }
      : { sanctionAppeal: true };

    // 전역 ref의 navigate는 지금 열린 화면 쪽 내비게이터부터 처리한다 — 하단 탭에도 「home」 탭이 있어
    // 그 탭이 가로채 홈으로만 간다. 루트 스택을 대상으로 못 박는다
    navigationRef.dispatch({
      ...CommonActions.navigate(ROOT_ROUTES.HOME, {
        screen: HOME_ROUTES.MYPAGE,
        params: { screen: MYPAGE_ROUTES.INQUIRY_REGISTER, params },
      }),
      target: navigationRef.getRootState().key,
    });
  }, [close, suspension?.pendingAppealInquiryId]);

  const { open } = useBottomSheet({
    id: SUSPENSION_SHEET_ID,
    render: suspension ? (
      <SuspensionNoticeSheet suspension={suspension} onPressClose={close} onPressAppeal={handlePressAppeal} />
    ) : (
      <></>
    ),
    sheetProps: { enableDynamicSizing: true, snapPoints: undefined },
  });

  const noticePending = !!suspension?.noticePending;

  useEffect(() => {
    if (!noticePending || handledNoticeRef.current) {
      return;
    }
    handledNoticeRef.current = true;
    // 시트 등록(위 effect)이 반영된 뒤에 연다
    const timer = setTimeout(() => {
      open();
      void accountStatusService.ackSuspensionNotice().finally(invalidateAccountStatus);
    }, 600);

    return () => clearTimeout(timer);
  }, [noticePending, open]);

  const hasReleaseNotice = !!data?.releaseNotice;

  useEffect(() => {
    if (!hasReleaseNotice || handledReleaseRef.current) {
      return;
    }
    handledReleaseRef.current = true;
    toast.show("계정 이용 정지가 해제되었어요");
    void accountStatusService.ackReleaseNotice().finally(invalidateAccountStatus);
  }, [hasReleaseNotice]);

  // 정지 · 해제를 다시 겪으면 다시 한 번 알린다
  useEffect(() => {
    if (!noticePending) {
      handledNoticeRef.current = false;
    }
  }, [noticePending]);
  useEffect(() => {
    if (!hasReleaseNotice) {
      handledReleaseRef.current = false;
    }
  }, [hasReleaseNotice]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", state => {
      if (state === "active") {
        invalidateAccountStatus();
      }
    });

    return () => subscription.remove();
  }, []);

  return null;
}
