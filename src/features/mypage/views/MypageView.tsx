import { useCallback } from "react";
import { FlatList, ListRenderItemInfo, View } from "react-native";

import VStack from "@/common/components/VStack/VStack";
import { useMainNavigation } from "@/common/router";
import { ROOT_ROUTES } from "@/common/router/routes";
import { useUserStore } from "@/common/stores/useUserStore";
import AuthEntryBanner from "@/features/mypage/components/AuthEntryBanner/AuthEntryBanner";
import MypageHeader from "@/features/mypage/components/MypageHeader/MypageHeader";
import MypageProfile from "@/features/mypage/components/MypageProfile/MypageProfile";
import MypageSection, {
  MypageSectionItem,
  MypageSectionProps,
} from "@/features/mypage/components/MypageSection/MypageSection";
import { MYPAGE_SECTIONS } from "@/features/mypage/constants/sections";

export default function MypageView() {
  const { user } = useUserStore();
  const mainNavigation = useMainNavigation();

  const handlePressSetting = useCallback(() => {
    console.log("setting");
  }, []);

  const handlePressCart = useCallback(() => {
    console.log("cart");
  }, []);

  const handlePressAuth = useCallback(() => {
    mainNavigation.navigate(ROOT_ROUTES.AUTH, {
      params: {},
    });
  }, [mainNavigation]);

  const handlePressSectionItem = useCallback((item: MypageSectionItem) => {
    console.log("click section item", item);
  }, []);

  const handlePressProfile = useCallback(() => {
    console.log("profile");
  }, []);

  const handlePressFollowing = useCallback(() => {
    console.log("following");
  }, []);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<MypageSectionProps>) => {
      // TODO : app version 가져오기
      return <MypageSection {...item} onPressItem={handlePressSectionItem} />;
    },
    [handlePressSectionItem]
  );

  const renderListHeaderComponent = useCallback(() => {
    if (user) {
      return (
        <MypageProfile
          user={user}
          onPressProfile={handlePressProfile}
          onPressFollowing={handlePressFollowing}
        />
      );
    }
    return <AuthEntryBanner onPressAuth={handlePressAuth} />;
  }, [handlePressAuth, handlePressFollowing, handlePressProfile, user]);

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
        ListHeaderComponent={renderListHeaderComponent}
        ItemSeparatorComponent={() => <View className="h-25" />}
        data={MYPAGE_SECTIONS}
        renderItem={renderItem}
      />
    </VStack>
  );
}
