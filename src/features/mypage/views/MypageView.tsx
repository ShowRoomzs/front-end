import { FlatList, ListRenderItemInfo, View } from "react-native";

import VStack from "@/common/components/VStack/VStack";
import { useMainNavigation } from "@/common/router";
import { ROOT_ROUTES } from "@/common/router/routes";
import AuthEntryBanner from "@/features/mypage/components/AuthEntryBanner/AuthEntryBanner";
import MypageHeader from "@/features/mypage/components/MypageHeader/MypageHeader";
import MypageSection, {
  MypageSectionItem,
  MypageSectionProps,
} from "@/features/mypage/components/MypageSection/MypageSection";
import { MYPAGE_SECTIONS } from "@/features/mypage/constants/sections";

export default function MypageView() {
  const mainNavigation = useMainNavigation();
  const handlePressSetting = () => {
    console.log("setting");
  };
  const handlePressCart = () => {
    console.log("cart");
  };

  const handlePressAuth = () => {
    mainNavigation.navigate(ROOT_ROUTES.AUTH, {
      params: {},
    });
  };

  const handlePressSectionItem = (item: MypageSectionItem) => {
    console.log("click section item", item);
  };

  const renderItem = ({ item }: ListRenderItemInfo<MypageSectionProps>) => {
    // TODO : app version 가져오기
    return <MypageSection {...item} onPressItem={handlePressSectionItem} />;
  };

  return (
    <VStack gap={20} className="flex-1">
      <MypageHeader
        wrapperClassName="px-20"
        onPressCart={handlePressCart}
        onPressSetting={handlePressSetting}
      />
      <FlatList
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20 }}
        ListHeaderComponentStyle={{ marginBottom: 40 }}
        ListHeaderComponent={
          <VStack className="w-full" gap={40}>
            <AuthEntryBanner onPressAuth={handlePressAuth} />
          </VStack>
        }
        ItemSeparatorComponent={() => <View className="h-25" />}
        data={MYPAGE_SECTIONS}
        renderItem={renderItem}
      />
    </VStack>
  );
}
