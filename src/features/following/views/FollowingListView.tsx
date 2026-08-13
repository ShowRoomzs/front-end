import { useCallback, useEffect } from "react";
import { FlatList, View } from "react-native";

import Icon from "@/common/components/Icon/Icon";
import Typography from "@/common/components/Typography/Typography";
import VStack from "@/common/components/VStack/VStack";
import { useBottomTab } from "@/common/hooks/useBottomTab";
import { usePermissionPress } from "@/common/hooks/usePermissionPress";
import { useMypageNavigation } from "@/common/router";
import { COMMON_ASSETS } from "@/common/utils/assets";
import FollowingListHeader from "@/features/following/components/FollowingListHeader/FollowingListHeader";
import FollowingListItem from "@/features/following/components/FollowingListItem/FollowingListItem";
import { useGetFollowingList } from "@/features/following/hooks/useGetFollowingList";
import { useUpdateFollowing } from "@/features/following/hooks/useUpdateFollowing";
import { FollowingShop } from "@/features/following/types/following";

export default function FollowingListView() {
  const navigation = useMypageNavigation();
  const { show: showBottomTab, hide: hideBottomTab } = useBottomTab();
  const { data, isLoading } = useGetFollowingList();
  const { update: updateFollowing } = useUpdateFollowing(true);

  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  useEffect(() => {
    hideBottomTab();
    return () => {
      showBottomTab();
    };
  }, [hideBottomTab, showBottomTab]);

  const handlePressShop = useCallback((shop: FollowingShop) => {
    // TODO: Shop 상세 페이지 구현 후 네비게이션 추가
    console.log("Shop clicked:", shop.shopId);
  }, []);

  const handlePressFollowing = usePermissionPress((shop: FollowingShop, isFollowed: boolean) => {
    updateFollowing(shop.shopId, !isFollowed);
  });

  const renderItem = useCallback(
    ({ item }: { item: FollowingShop }) => {
      return (
        <FollowingListItem
          shop={item}
          onPressShop={handlePressShop}
          onPressFollowing={handlePressFollowing}
        />
      );
    },
    [handlePressFollowing, handlePressShop]
  );

  const renderEmpty = useCallback(() => {
    if (isLoading) {
      return null;
    }

    return (
      <View className="flex-1 h-[500px] items-center justify-center">
        <VStack gap={10} className="items-center">
          <View
            className="flex items-center justify-center w-40 h-40 rounded-full"
            style={{ backgroundColor: "rgba(13, 12, 17, 0.05)" }}
          >
            <Icon icon={COMMON_ASSETS.empty} />
          </View>
          <Typography className="text-gray12 text-15 font-medium">팔로잉한 쇼룸이 없습니다</Typography>
        </VStack>
      </View>
    );
  }, [isLoading]);

  return (
    <View className="flex-1">
      <FollowingListHeader title="팔로잉" wrapperClassName="px-20" onBackPress={handleBackPress} />
      <FlatList
        contentContainerStyle={{ padding: 20, gap: 10 }}
        className="bg-gray0"
        data={data?.content}
        renderItem={renderItem}
        keyExtractor={item => item.shopId.toString()}
        ListEmptyComponent={renderEmpty}
      />
    </View>
  );
}
