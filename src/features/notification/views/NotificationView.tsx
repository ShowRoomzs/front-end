import ComingSoonView from "@/common/components/ComingSoon/ComingSoonView";
import { useCommonNavigation } from "@/common/router";

/**
 * 알림 — 임시 화면.
 *
 * 서버에 알림 API가 아직 없다. 헤더의 알림 아이콘은 디자인대로 두되 로즈 점(미확인 표시)은
 * 켜지 않는다 — 셀 값이 없는데 점을 띄우면 눌러도 아무것도 없는 화면으로 보낸다.
 */
export default function NotificationView() {
  const navigation = useCommonNavigation();

  return (
    <ComingSoonView
      title="알림"
      description="공구 소식과 주문 알림을 여기로 모으고 있어요."
      onPressBack={navigation.goBack}
    />
  );
}
