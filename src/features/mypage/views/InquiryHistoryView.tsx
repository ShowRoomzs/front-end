import { useCallback } from "react";
import { View } from "react-native";

import ScreenHeader from "@/common/components/ScreenHeader/ScreenHeader";
import { TabItemType } from "@/common/components/Tabs/Tabs";
import { useTabIndex } from "@/common/hooks/useTabIndex";
import { useMypageNavigation } from "@/common/router";
import InquiryHistoryTabs from "@/features/mypage/components/InquiryHistoryTabs/InquiryHistoryTabs";
import OneOnOneInquiryHistoryTab from "@/features/mypage/components/OneOnOneInquiryHistoryTab/OneOnOneInquiryHistoryTab";
import ProductInquiryHistoryTab from "@/features/mypage/components/ProductInquiryHistoryTab/ProductInquiryHistoryTab";

const INQUIRY_HISTORY_TABS: Array<TabItemType> = [
  {
    id: "product-inquiry",
    label: "상품 문의 내역",
    render: () => <ProductInquiryHistoryTab />,
  },
  {
    id: "one-on-one-inquiry",
    label: "1:1 문의 내역",
    render: () => <OneOnOneInquiryHistoryTab />,
  },
];

export default function InquiryHistoryView() {
  const navigation = useMypageNavigation();
  const { selectedTabIndex, updateTabIndex } = useTabIndex(0);

  const handlePressBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader title="문의 내역" onPressBack={handlePressBack} />
      <InquiryHistoryTabs
        items={INQUIRY_HISTORY_TABS}
        selectedIndex={selectedTabIndex}
        onSelect={updateTabIndex}
      />
    </View>
  );
}
