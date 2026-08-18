import ComingSoonView from "@/common/components/ComingSoon/ComingSoonView";
import { useMypageNavigation } from "@/common/router";

/**
 * 주문 내역 — 임시 화면.
 *
 * 서버에 주문 엔티티(Order · OrderProduct)와 리포지토리는 있지만 주문 서비스와 API가 아직 없다.
 * 주문·결제 동선이 열리면 이 자리가 C10 주문 내역이 된다.
 */
export default function OrderHistoryView() {
  const navigation = useMypageNavigation();

  return (
    <ComingSoonView
      title="주문 내역"
      description="주문·결제 기능을 열면 여기에서 주문과 배송을 확인할 수 있어요."
      onPressBack={navigation.goBack}
    />
  );
}
