import ComingSoonView from "@/common/components/ComingSoon/ComingSoonView";
import { useMypageNavigation } from "@/common/router";

/** 취소·반품 — 주문 API가 없어 아직 열 수 없다. 주문 내역과 함께 열린다 */
export default function CancelAndRefundView() {
  const navigation = useMypageNavigation();

  return (
    <ComingSoonView
      title="취소 및 환불"
      description="주문·결제 기능을 열면 여기에서 취소와 환불을 신청할 수 있어요."
      onPressBack={navigation.goBack}
    />
  );
}
