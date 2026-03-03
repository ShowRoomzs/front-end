import { useCallback } from "react";
import { FlatList, ListRenderItemInfo, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BOTTOM_TABS_HEIGHT } from "@/common/components/BottomTabs/config";
import VStack from "@/common/components/VStack/VStack";
import { usePermissionPress } from "@/common/hooks/usePermissionPress";
import { modal } from "@/common/providers/ModalProvider";
import { useMainNavigation, useMypageNavigation } from "@/common/router";
import { MYPAGE_ROUTES, ROOT_ROUTES } from "@/common/router/routes";
import { useUserStore } from "@/common/stores/useUserStore";
import AuthEntryBanner from "@/features/mypage/components/AuthEntryBanner/AuthEntryBanner";
import MypageHeader from "@/features/mypage/components/MypageHeader/MypageHeader";
import MypageProfile from "@/features/mypage/components/MypageProfile/MypageProfile";
import MypageSection, {
  MypageSectionItem,
  MypageSectionProps,
} from "@/features/mypage/components/MypageSection/MypageSection";
import { MYPAGE_MENUS } from "@/features/mypage/constants/menus";

export default function MypageView() {
  const { user } = useUserStore();
  const mainNavigation = useMainNavigation();
  const inset = useSafeAreaInsets();
  const mypageNavigation = useMypageNavigation();
  const handlePressSetting = usePermissionPress(() => {
    mypageNavigation.navigate(MYPAGE_ROUTES.SETTINGS);
  });

  const handlePressCart = useCallback(() => {
    console.log("cart");
  }, []);

  const handlePressAuth = useCallback(() => {
    mainNavigation.navigate(ROOT_ROUTES.AUTH, {
      params: {},
    });
  }, [mainNavigation]);

  const handlePressSectionItem = useCallback(
    (item: MypageSectionItem) => {
      if (!item.routeName) {
        return;
      }
      mypageNavigation.navigate(item.routeName);
    },
    [mypageNavigation]
  );

  const handlePressProfile = useCallback(() => {
    modal.alert({
      title: "test",
      message: "testtest",
      confirmLabel: "확인",
      centered: true,
    });
  }, []);

  const handlePressFollowing = useCallback(() => {
    mypageNavigation.navigate(MYPAGE_ROUTES.FOLLOWING_LIST);
  }, [mypageNavigation]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<MypageSectionProps>) => {
      // TODO : app version 가져오기
      return <MypageSection {...item} onPressItem={handlePressSectionItem} />;
    },
    [handlePressSectionItem]
  );
  const handlePressCoupon = useCallback(() => {
    mypageNavigation.navigate(MYPAGE_ROUTES.COUPON);
  }, [mypageNavigation]);

  const renderListHeaderComponent = useCallback(() => {
    if (user) {
      return (
        <MypageProfile
          user={user}
          onPressProfile={handlePressProfile}
          onPressFollowing={handlePressFollowing}
          onPressCoupon={handlePressCoupon}
        />
      );
    }
    return <AuthEntryBanner onPressAuth={handlePressAuth} />;
  }, [handlePressAuth, handlePressCoupon, handlePressFollowing, handlePressProfile, user]);

  return (
    <VStack style={{ paddingBottom: inset.bottom }} gap={20} className="flex-1">
      <MypageHeader
        wrapperClassName="px-20"
        onPressCart={handlePressCart}
        onPressSetting={handlePressSetting}
      />
      <FlatList
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: BOTTOM_TABS_HEIGHT }}
        ListHeaderComponentStyle={{ marginBottom: 40 }}
        ListHeaderComponent={renderListHeaderComponent}
        ItemSeparatorComponent={() => <View className="h-25" />}
        data={MYPAGE_MENUS}
        renderItem={renderItem}
      />
    </VStack>
  );
}
