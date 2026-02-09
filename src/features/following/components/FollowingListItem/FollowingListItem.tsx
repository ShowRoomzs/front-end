import { useCallback, useState } from "react";
import { Image, Pressable, View } from "react-native";

import Button from "@/common/components/Button/Button";
import HStack from "@/common/components/HStack/HStack";
import Typography from "@/common/components/Typography/Typography";
import { FollowingShop } from "@/features/following/types/following";

interface FollowingListItemProps {
  shop: FollowingShop;
  onPressShop: (shop: FollowingShop) => void;
  onPressFollowing: (shop: FollowingShop, isFollowed: boolean) => Promise<void>;
}
// TODO: 디자인 QA - 간격/색상/크기 조정 필요
export default function FollowingListItem(props: FollowingListItemProps) {
  const { shop, onPressShop, onPressFollowing } = props;
  const [isFollowed, setIsFollowed] = useState(true);

  const handlePressShop = useCallback(() => {
    onPressShop(shop);
  }, [onPressShop, shop]);

  const handlePressFollowing = useCallback(async () => {
    const newIsFollowed = !isFollowed;

    setIsFollowed(newIsFollowed);

    try {
      await onPressFollowing(shop, isFollowed);
    } catch (error) {
      setIsFollowed(isFollowed);
    }
  }, [isFollowed, onPressFollowing, shop]);

  return (
    <Pressable onPress={handlePressShop}>
      <View className="bg-white rounded-[8px] border border-gray2 p-20">
        <HStack gap={12} className="items-center">
          <Image source={{ uri: shop.shopImageUrl }} className="w-48 h-48 rounded-full bg-gray2" />
          <Typography className="flex-1 text-15 font-medium text-black" numberOfLines={1}>
            {shop.shopName}
          </Typography>
          <Button
            onPress={handlePressFollowing}
            size="sm"
            variant={isFollowed ? "secondary-black" : "outline"}
            className="w-80"
          >
            {isFollowed ? "팔로잉" : "팔로우"}
          </Button>
        </HStack>
      </View>
    </Pressable>
  );
}
