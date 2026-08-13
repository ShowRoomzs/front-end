import { useCallback, useEffect, useState } from "react";
import { Image, Pressable, TouchableOpacity, View } from "react-native";

import Button from "@/common/components/Button/Button";
import HStack from "@/common/components/HStack/HStack";
import Icon from "@/common/components/Icon/Icon";
import Typography from "@/common/components/Typography/Typography";
import VStack from "@/common/components/VStack/VStack";
import { RecommendedMarket } from "@/common/types/recommendation";
import { COMMON_ASSETS } from "@/common/utils/assets";

interface RecommendedShowroomProps {
  item: RecommendedMarket | undefined;
  isLoading: boolean;
  onPressMore: () => void;
  onPressFollow: (marketId: number, newIsFollowed: boolean) => void;
  onPressProduct: (productId: number) => void;
  onPressProfile: (marketId: number) => void;
  containerClassName?: string;
}
export default function RecommendedShowroom(props: RecommendedShowroomProps) {
  const { item, onPressFollow, onPressMore, onPressProduct, onPressProfile, containerClassName, isLoading } =
    props;

  const [isFollowed, setIsFollowed] = useState(item?.isFollowing);

  useEffect(() => {
    setIsFollowed(item?.isFollowing);
  }, [item?.isFollowing]);

  const handlePressFollow = useCallback(() => {
    if (!item) {
      return;
    }

    const newIsFollowed = !isFollowed;

    setIsFollowed(newIsFollowed);
    onPressFollow(item.marketId, newIsFollowed);
  }, [isFollowed, item, onPressFollow]);

  const handlePressProfile = useCallback(() => {
    if (!item) {
      return;
    }
    onPressProfile(item.marketId);
  }, [item, onPressProfile]);

  return (
    <View className={containerClassName}>
      <View className="flex flex-row items-center justify-between">
        <Typography className="text-black text-16 font-semibold">회원님을 위한 추천 쇼룸</Typography>
        <Typography onPress={onPressMore} className="text-gray9 text-12 font-normal">
          더 보기
        </Typography>
      </View>
      <View className="mt-15 flex flex-col px-15 py-20 bg-gray1">
        <View className="flex flex-row items-center justify-between">
          <Pressable onPress={handlePressProfile}>
            <HStack gap={10}>
              <Image className="w-40 h-40 rounded-full" source={{ uri: item?.marketImageUrl }} />
              <VStack gap={4}>
                <Typography className="text-gray15 text-14 font-semibold">{item?.marketName}</Typography>
                <Typography className="text-gray9 text-12 font-normal">{item?.marketDescription}</Typography>
                <HStack gap={4} className="items-center">
                  <Icon icon={COMMON_ASSETS.followingGrayIcon} />
                  <Typography className="text-gray10 text-11 font-normal">{item?.followCount}</Typography>
                </HStack>
              </VStack>
            </HStack>
          </Pressable>
          <Button onPress={handlePressFollow} variant="primary" className="px-10" size="xs">
            {isFollowed ? "팔로잉" : "팔로우"}
          </Button>
        </View>
        <VStack
          style={{
            paddingHorizontal: 15,
          }}
          className="mt-5 py-10 w-full"
          gap={10}
        >
          <Typography className="text-black text-12 font-medium">쇼룸 내 대표 제품</Typography>
          <View className="flex flex-row items-center gap-x-10">
            {item?.representativeProducts?.map(product => (
              <TouchableOpacity
                activeOpacity={0.7}
                style={{ aspectRatio: 1 }}
                className="border-[1px] border-[#0D0C110D] flex-1"
                onPress={() => onPressProduct(product.productId)}
                key={product.productId}
              >
                <Image style={{ flex: 1 }} source={{ uri: product.imageUrl }} />
              </TouchableOpacity>
            ))}
          </View>
        </VStack>
      </View>
    </View>
  );
}
