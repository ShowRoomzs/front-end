import { Pressable, View } from "react-native";

import Button from "@/common/components/Button/Button";
import HStack from "@/common/components/HStack/HStack";
import Icon from "@/common/components/Icon/Icon";
import Typography from "@/common/components/Typography/Typography";
import { COMMON_ASSETS } from "@/common/utils/assets";

interface ProductDetailBrandSectionProps {
  marketName: string;
  onPressFollow: () => void;
  onPressMarket: () => void;
}
export default function ProductDetailBrandSection(props: ProductDetailBrandSectionProps) {
  const { marketName, onPressFollow, onPressMarket } = props;

  return (
    <View className="flex flex-row items-center justify-between px-20 py-8 flex-1 border-b-[1px] border-t-[1px] border-gray2">
      <Pressable onPress={onPressMarket}>
        <HStack>
          <Typography className="text-14 text-black font-normal">{marketName}</Typography>
          <Icon icon={COMMON_ASSETS.arrowRight} />
        </HStack>
      </Pressable>
      <Button onPress={onPressFollow} size="xs" className="px-10 py-6" variant="outline">
        <Typography className="text-12 text-gray15 font-normal">팔로잉</Typography>
      </Button>
    </View>
  );
}
