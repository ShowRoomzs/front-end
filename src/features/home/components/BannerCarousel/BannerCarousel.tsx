import { useCallback, useRef, useState } from "react";
import { useWindowDimensions, View } from "react-native";
import { runOnJS, useAnimatedReaction, useSharedValue } from "react-native-reanimated";
import Carousel, { CarouselRenderItem, ICarouselInstance } from "react-native-reanimated-carousel";

import dummyBanner from "@/common/assets/dummy/dummy-banner.png";
import BannerItem, { BannerItemType } from "@/features/home/components/BannerCarousel/BannerItem";
import BannerNavigation from "@/features/home/components/BannerCarousel/BannerNavigation";
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
  const [currentIndex, setCurrentIndex] = useState(0);

  const renderItem: CarouselRenderItem<BannerItemType> = useCallback(bannerItemInfo => {
    return <BannerItem {...bannerItemInfo} key={bannerItemInfo.item.id} />;
  }, []);

  const syncIndexWithProgress = useCallback(
    (progress: number) => {
      const index = Math.round(progress);

      if (currentIndex === index) {
        return;
      }
      if (index === DUMMY_BANNER_ITEMS.length) {
        setCurrentIndex(0);
        return;
      }

      setCurrentIndex(index);
    },
    [currentIndex]
  );

  useAnimatedReaction(
    () => progress.value,
    value => {
      runOnJS(syncIndexWithProgress)(Math.round(value));
    },
    []
  );

  return (
    <View className="relative" style={{ width, height: getBannerCarouselHeight(width) }}>
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
      <BannerNavigation
        currentIndex={currentIndex}
        maxIndex={DUMMY_BANNER_ITEMS.length}
        containerClassName="absolute bottom-10 right-10 z-10"
      />
    </View>
  );
}
