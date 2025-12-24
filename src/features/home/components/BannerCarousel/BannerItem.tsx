import { Image, ImageSourcePropType, View } from "react-native";
import { CarouselRenderItemInfo } from "react-native-reanimated-carousel/lib/typescript/types";

// TODO : 타입 분리
export interface BannerItemType {
  id: number;
  imageUrl: string | ImageSourcePropType;
}

type BannerItemProps = CarouselRenderItemInfo<BannerItemType>;

export default function BannerItem(props: BannerItemProps) {
  const { item } = props;

  const imageSource = typeof item.imageUrl === "string" ? { uri: item.imageUrl } : item.imageUrl;

  return (
    <View className="flex-1">
      <Image className="w-full h-full" source={imageSource} resizeMode="cover" />
    </View>
  );
}
