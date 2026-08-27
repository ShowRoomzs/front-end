import { useWindowDimensions, View } from "react-native";

import MediaCarousel from "@/common/components/MediaCarousel/MediaCarousel";
import Typography from "@/common/components/Typography/Typography";

/**
 * C7 갤러리 — 1:1 정방형. 도트는 이미지 안 하단(흰 도트 + 옅은 그림자)이다.
 * 피드 게시물이 미디어 아래 중앙에 도트를 두는 것과 의도적으로 다르다.
 *
 * 첫 장은 representativeImageUrl이고 coverImageUrls가 2번째 장부터다 — 서버가 둘을 나눠 주는 것은
 * 목록·장바구니가 대표 이미지만 쓰기 때문이다.
 */
interface ProductGalleryProps {
  representativeImageUrl?: string;
  coverImageUrls?: Array<string>;
}

export default function ProductGallery(props: ProductGalleryProps) {
  const { representativeImageUrl, coverImageUrls = [] } = props;
  const { width } = useWindowDimensions();

  const images = [representativeImageUrl, ...coverImageUrls].filter(Boolean) as Array<string>;

  // 빈 회색만 두면 로딩 중인지 사진이 없는 상품인지 알 수 없다
  if (images.length === 0) {
    return (
      <View className="items-center justify-center bg-fill" style={{ width, height: width }}>
        <Typography style={{ fontSize: 12, lineHeight: 12 }} className="text-gray62">
          상품 이미지
        </Typography>
      </View>
    );
  }

  return <MediaCarousel imageUrls={images} width={width} aspectRatio={1} dotsPlacement="inside" />;
}
