import { useCallback, useState } from "react";
import { FlatList, Image, NativeScrollEvent, NativeSyntheticEvent, View } from "react-native";

import CarouselDots from "@/common/components/MediaCarousel/CarouselDots";

/**
 * 게시물·상품 미디어 캐러셀.
 *
 * 미디어는 풀블리드(여백 0)다. 높이는 서버가 내려준 `aspectRatio`(가로/세로, 1.91 ~ 0.8)로
 * 잡는다 — 게시물마다 높이가 다르므로 고정 높이 카드로 구현하면 안 되고, 첫 사진을 받아 재기 전에
 * 자리를 잡을 수 있어야 피드가 튀지 않는다.
 */
interface MediaCarouselProps {
  imageUrls: Array<string>;
  width: number;
  /** 가로/세로 비율. 없으면 1:1 */
  aspectRatio?: number;
  dotsPlacement?: "below" | "inside";
  onPress?: () => void;
}

export default function MediaCarousel(props: MediaCarouselProps) {
  const { imageUrls, width, aspectRatio = 1, dotsPlacement = "below" } = props;
  const [activeIndex, setActiveIndex] = useState(0);

  const height = width / (aspectRatio || 1);

  const handleMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const nextIndex = Math.round(e.nativeEvent.contentOffset.x / width);

      setActiveIndex(prev => (prev === nextIndex ? prev : nextIndex));
    },
    [width]
  );

  if (imageUrls.length === 0) {
    return null;
  }

  return (
    <View>
      <FlatList
        data={imageUrls}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(uri, ix) => `${uri}-${ix}`}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={{ width, height }} resizeMode="cover" />
        )}
      />
      <CarouselDots count={imageUrls.length} activeIndex={activeIndex} placement={dotsPlacement} />
    </View>
  );
}
