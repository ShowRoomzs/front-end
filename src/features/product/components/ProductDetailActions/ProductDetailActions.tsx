import { useCallback } from "react";

import Button from "@/common/components/Button/Button";
import HStack from "@/common/components/HStack/HStack";
import Icon from "@/common/components/Icon/Icon";
import Typography from "@/common/components/Typography/Typography";
import VStack from "@/common/components/VStack/VStack";
import { COMMON_ASSETS } from "@/common/utils/assets";
import { likeHaptic } from "@/common/utils/haptics";

interface ProductDetailActionsProps {
  isWished: boolean;
  likeCount: string;
  onPressLike?: (newIsWished: boolean) => void;
  onPressPurchase?: () => void;
}

export default function ProductDetailActions(props: ProductDetailActionsProps) {
  const { isWished, likeCount, onPressLike, onPressPurchase } = props;

  const handlePressLike = useCallback(() => {
    likeHaptic();

    onPressLike?.(!isWished);
  }, [isWished, onPressLike]);

  return (
    <HStack gap={6} className="px-10 items-center w-full">
      <Button className="w-60" onPress={handlePressLike} activeOpacity={0.7} size="xl" variant="ghost">
        <VStack className="items-center" gap={8}>
          <Icon
            width={23}
            height={20}
            icon={COMMON_ASSETS.bigLikeOutlineIcon}
            variant={isWished ? "active" : "default"}
          />
          <Typography className="text-gray9 text-12 font-medium">{likeCount}</Typography>
        </VStack>
      </Button>
      <Button onPress={onPressPurchase} activeOpacity={0.7} className="flex-1" size="xl" variant="primary">
        구매하기
      </Button>
    </HStack>
  );
}
