import { useCallback, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ScreenHeader from "@/common/components/ScreenHeader/ScreenHeader";
import Typography from "@/common/components/Typography/Typography";
import { useMypageNavigation } from "@/common/router";
import { MYPAGE_ROUTES } from "@/common/router/routes";
import { useGetInquirySummary } from "@/features/inquiry/hooks/useGetInquirySummary";
import InquiryHistoryTabs, {
  InquiryKind,
} from "@/features/mypage/components/InquiryHistoryTabs/InquiryHistoryTabs";
import OneOnOneInquiryHistoryTab from "@/features/mypage/components/OneOnOneInquiryHistoryTab/OneOnOneInquiryHistoryTab";
import ProductInquiryHistoryTab from "@/features/mypage/components/ProductInquiryHistoryTab/ProductInquiryHistoryTab";

/**
 * C12 문의 내역 — 1:1 · 상품 두 탭.
 *
 * 하단 CTA는 **어느 탭에서든 [1:1 문의하기]**다. 상품 문의는 상품에서 출발해야 등록할 수 있어
 * (서버가 `productId`를 요구한다) 이 화면에서 시작할 수 없고, 내역을 보다 곧장 이어서 할 수 있는
 * 행동은 1:1 문의 하나뿐이다. 상품 문의로 가는 길은 상품 문의 탭의 빈 상태 문구가 안내한다.
 */
export default function InquiryHistoryView() {
  const navigation = useMypageNavigation();
  const { bottom } = useSafeAreaInsets();
  const [kind, setKind] = useState<InquiryKind>("oneToOne");
  const { data: summary } = useGetInquirySummary();

  const handlePressRegister = useCallback(() => {
    navigation.navigate(MYPAGE_ROUTES.INQUIRY_REGISTER, {});
  }, [navigation]);

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader title="문의 내역" onPressBack={navigation.goBack} />

      <InquiryHistoryTabs
        selected={kind}
        oneToOneCount={summary?.oneToOneTotal ?? 0}
        productCount={summary?.productTotal ?? 0}
        onSelect={setKind}
      />

      <View className="flex-1">
        {kind === "oneToOne" ? <OneOnOneInquiryHistoryTab /> : <ProductInquiryHistoryTab />}
      </View>

      <View
        className="border-t-[0.5px] border-divider bg-white px-14 pt-12"
        style={{ paddingBottom: bottom + 26 }}
      >
        <TouchableOpacity
          onPress={handlePressRegister}
          activeOpacity={0.75}
          className="h-52 flex-row items-center justify-center rounded-base bg-rose"
        >
          <Typography variant="buttonPrimary" className="text-white">
            1:1 문의하기
          </Typography>
        </TouchableOpacity>
      </View>
    </View>
  );
}
