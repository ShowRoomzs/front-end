import ComingSoonView from "@/common/components/ComingSoon/ComingSoonView";
import { useMypageNavigation } from "@/common/router";

/** 오픈소스 라이선스 — 빌드 시 생성하는 목록이 아직 없어 임시로 둔다 */
export default function OpenLicenseView() {
  const navigation = useMypageNavigation();

  return (
    <ComingSoonView
      title="오픈소스 라이선스"
      description="사용 중인 오픈소스 목록을 정리하고 있어요."
      onPressBack={navigation.goBack}
    />
  );
}
