import { useRef } from "react";
import { Image, useWindowDimensions, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";

import Dots from "@/common/components/Dots/Dots";

interface ProductThumbnailCarouselProps {
  images: Array<string>;
}
export default function ProductThumbnailCarousel(props: ProductThumbnailCarouselProps) {
  const { images } = props;
  const size = useWindowDimensions().width; // screen width 크기에 맞춘 정방형 사이즈
  const ref = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);

  return (
    <View className="flex-1">
      <Carousel<string>
        width={size}
        ref={ref}
        style={{ width: size, height: size }}
        data={images}
        renderItem={({ item }) => <Image source={{ uri: item }} style={{ width: size, height: size }} />}
        onProgressChange={progress}
        enabled={images.length > 1} // swipe 활성상태
      />
      {images.length > 1 && (
        <View className="absolute bottom-20 left-0 right-0">
          <Dots itemCount={images.length} progress={progress} />
        </View>
      )}
    </View>
  );
}
