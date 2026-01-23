import { Image, TouchableOpacity } from "react-native";

import HStack from "@/common/components/HStack/HStack";
import Icon from "@/common/components/Icon/Icon";
import Typography from "@/common/components/Typography/Typography";
import VStack from "@/common/components/VStack/VStack";
import { COMMON_ASSETS } from "@/common/utils/assets";
import { Product } from "@/features/product/types/params";

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  width: number;
}

const SIZE_RATIO = 0.923;

export default function ProductCard(props: ProductCardProps) {
  const { product, onPress, width } = props;

  const height = width * SIZE_RATIO;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <VStack style={{ width }}>
        <Image style={{ height: height }} source={{ uri: product.thumbnailUrl }} />
        <VStack className="mt-15">
          <Typography className="text-12 text-gray10 font-normal">{product.marketName}</Typography>
          <Typography className="mt-6 text-15 text-black font-medium">{product.name}</Typography>
          <HStack className="mt-8" gap={6}>
            {product.price.discountRate > 0 && (
              <Typography className="text-16 text-pointColor font-medium">
                {product.price.discountRate}%
              </Typography>
            )}
            <Typography className="text-16 text-black font-semibold">
              ₩ {product.price.salePrice.toLocaleString()}
            </Typography>
          </HStack>
          <HStack className="mt-10" gap={10}>
            <HStack className="items-center" gap={4}>
              <Icon icon={COMMON_ASSETS.likeIcon} />
              <Typography className="text-11 text-gray10 font-normal">{product.likeCount}</Typography>
            </HStack>
            <HStack className="items-center" gap={4}>
              <Icon icon={COMMON_ASSETS.commentIcon} />
              <Typography className="text-11 text-gray10 font-normal">{product.reviewCount}</Typography>
            </HStack>
          </HStack>
        </VStack>
      </VStack>
    </TouchableOpacity>
  );
}
