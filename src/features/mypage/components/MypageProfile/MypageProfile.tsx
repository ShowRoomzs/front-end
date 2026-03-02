import { useMemo } from "react";
import { Image, Pressable, View } from "react-native";

import defaultProfileImage from "@/common/assets/common/profile-default.png";
import HStack from "@/common/components/HStack/HStack";
import Icon from "@/common/components/Icon/Icon";
import Typography from "@/common/components/Typography/Typography";
import VStack from "@/common/components/VStack/VStack";
import { COMMON_ASSETS } from "@/common/utils/assets";
import { User } from "@/features/user/types/user";

interface MypageProfileProps {
  user: User;
  onPressProfile: () => void;
  onPressFollowing: () => void;
  onPressCoupon: () => void;
}

export default function MypageProfile(props: MypageProfileProps) {
  const { user, onPressFollowing, onPressProfile, onPressCoupon } = props;

  const cardItems = useMemo(
    () => [
      {
        id: "coupon",
        count: user.couponCount,
        suffix: "개",
        label: "쿠폰",
        onPress: onPressCoupon,
      },
      {
        id: "point",
        count: user.point,
        suffix: "P",
        label: "포인트",
        onPress: () => {},
      },
      {
        id: "review",
        count: user.reviewCount,
        suffix: "개",
        label: "리뷰",
        onPress: () => {},
      },
    ],
    [onPressCoupon, user.couponCount, user.point, user.reviewCount]
  );

  // TODO : 분리 해야할 것 있다면 분리
  return (
    <VStack gap={26}>
      <View className="flex flex-row justify-between items-center">
        {/* 프로필 버튼 */}
        <Pressable onPointerCancel={onPressProfile}>
          <HStack className="items-center" gap={10}>
            <Image
              source={user.profileImageUrl ? { uri: user.profileImageUrl } : defaultProfileImage}
              className="w-40 h-40 rounded-full"
            />
            <Typography className="text-black font-semibold text-22">{user.nickname}</Typography>
          </HStack>
        </Pressable>
        {/* 팔로잉 버튼 */}
        <Pressable onPress={onPressFollowing}>
          <HStack gap={4} className="items-center">
            <Icon icon={COMMON_ASSETS.followingIcon} />
            <Typography className="text-black font-medium text-13">{`팔로잉${user.followingCount}`}</Typography>
            <Icon icon={COMMON_ASSETS.arrowRight} />
          </HStack>
        </Pressable>
      </View>
      <HStack gap={4}>
        {cardItems.map(cardItem => (
          <Pressable onPress={cardItem.onPress} key={cardItem.id} className="flex-1">
            <VStack
              gap={4}
              key={cardItem.id}
              className="flex-1 flex h-75 rounded-4 bg-gray0 items-center justify-center"
            >
              <HStack gap={4} className="items-center">
                <Typography className="text-14 font-semibold text-black">
                  {cardItem.count.toLocaleString()}
                </Typography>
                <Typography className="text-12 font-medium text-black">{cardItem.suffix}</Typography>
              </HStack>
              <Typography className="text-12 font-normal text-gray9">{cardItem.label}</Typography>
            </VStack>
          </Pressable>
        ))}
      </HStack>
    </VStack>
  );
}
