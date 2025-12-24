import { useCallback, useRef } from "react";
import { useWindowDimensions, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, { CarouselRenderItem, ICarouselInstance } from "react-native-reanimated-carousel";

import dummyBanner from "@/common/assets/dummy/dummy-banner.png";
import BannerItem, { BannerItemType } from "@/features/home/components/BannerCarousel/BannerItem";
import { getBannerCarouselHeight } from "@/features/home/components/BannerCarousel/config";

const DUMMY_BANNER_ITEMS: Array<BannerItemType> = [
  {
    id: 1,
    imageUrl: dummyBanner,
  },
  {
    id: 2,
    imageUrl: dummyBanner,
  },
  {
    id: 3,
    imageUrl: dummyBanner,
  },
  {
    id: 4,
    imageUrl: dummyBanner,
  },
];

export default function BannerCarousel() {
  const ref = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const width = useWindowDimensions().width;

  const renderItem: CarouselRenderItem<BannerItemType> = useCallback(bannerItemInfo => {
    return <BannerItem {...bannerItemInfo} key={bannerItemInfo.item.id} />;
  }, []);

  return (
    <View className="flex-1" style={{ width, height: getBannerCarouselHeight(width) }}>
      <Carousel<BannerItemType>
        width={width}
        ref={ref}
        style={{ width, height: getBannerCarouselHeight(width) }}
        data={DUMMY_BANNER_ITEMS}
        onProgressChange={progress}
        renderItem={renderItem}
        autoPlay
        autoPlayInterval={5000}
      />
    </View>
  );
}
