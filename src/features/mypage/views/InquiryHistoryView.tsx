import { useCallback, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ScreenHeader from "@/common/components/ScreenHeader/ScreenHeader";
import Typography from "@/common/components/Typography/Typography";
import { toast } from "@/common/providers/ToastProvider";
import { useMainNavigation, useMypageNavigation } from "@/common/router";
import { COMMON_ROUTES, MYPAGE_ROUTES, ROOT_ROUTES } from "@/common/router/routes";
import { useGetInquirySummary } from "@/features/inquiry/hooks/useGetInquirySummary";
import InquiryHistoryTabs, {
  InquiryKind,
} from "@/features/mypage/components/InquiryHistoryTabs/InquiryHistoryTabs";
import OneOnOneInquiryHistoryTab from "@/features/mypage/components/OneOnOneInquiryHistoryTab/OneOnOneInquiryHistoryTab";
import ProductInquiryHistoryTab from "@/features/mypage/components/ProductInquiryHistoryTab/ProductInquiryHistoryTab";

/**
 * C12 문의 내역 — 1:1 · 상품 두 탭.
 *
 * 하단 CTA는 **탭을 따라간다** — 상품 문의 탭에서 [1:1 문의하기]가 나오면, 상품에 대해 물으려던
 * 사람이 엉뚱한 곳에 글을 남기게 된다.
 *
 * 다만 상품 문의는 **상품이 정해져야 등록할 수 있다**(서버가 `productId`를 요구한다). 그래서
 * [상품 문의하기]는 작성 화면으로 바로 가지 않고 상품을 고르러 카테고리로 보낸다 — 상품 상세의
 * 문의 탭이 실제 작성 입구다.
 */
export default function InquiryHistoryView() {
  const navigation = useMypageNavigation();
  const mainNavigation = useMainNavigation();
  const { bottom } = useSafeAreaInsets();
  const [kind, setKind] = useState<InquiryKind>("oneToOne");
  const { data: summary } = useGetInquirySummary();

  const isProductTab = kind === "product";

  const handlePressCta = useCallback(() => {
    if (isProductTab) {
      toast.show("문의할 상품을 골라 주세요");
      mainNavigation.navigate(ROOT_ROUTES.COMMON, { screen: COMMON_ROUTES.CATEGORY });
      return;
    }
    navigation.navigate(MYPAGE_ROUTES.INQUIRY_REGISTER, {});
  }, [isProductTab, mainNavigation, navigation]);

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
        {isProductTab ? <ProductInquiryHistoryTab /> : <OneOnOneInquiryHistoryTab />}
      </View>

      <View
        className="border-t-[0.5px] border-divider bg-white px-14 pt-12"
        style={{ paddingBottom: bottom + 26 }}
      >
        <TouchableOpacity
          onPress={handlePressCta}
          activeOpacity={0.75}
          className="h-52 flex-row items-center justify-center rounded-base bg-rose"
        >
          <Typography variant="buttonPrimary" className="text-white">
            {isProductTab ? "상품 문의하기" : "1:1 문의하기"}
          </Typography>
        </TouchableOpacity>
      </View>
    </View>
  );
}
