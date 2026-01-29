import { produce } from "immer";
import { useCallback, useEffect, useState } from "react";
import {
  Image,
  Pressable,
  PressableStateCallbackType,
  StyleProp,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

import HStack from "@/common/components/HStack/HStack";
import Icon from "@/common/components/Icon/Icon";
import Typography from "@/common/components/Typography/Typography";
import VStack from "@/common/components/VStack/VStack";
import { COMMON_ASSETS } from "@/common/utils/assets";
import { likeHaptic } from "@/common/utils/haptics";
import { Product } from "@/features/product/types/product";

type ProductCardSize = "sm" | "md";
interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
  width: number;
  onPressLike?: (productId: number, newIsWished: boolean) => void;
  useOptimisticUpdate?: boolean;
  size?: ProductCardSize;
}

const SIZE_RATIO = 0.923;

export default function ProductCard(props: ProductCardProps) {
  const { product: originProduct, onPress, width, onPressLike, useOptimisticUpdate, size = "md" } = props;
  const [product, setProduct] = useState(originProduct);
  const height = width * SIZE_RATIO;

  // 외부 상태와 동기화(ex. 리스트 리패치 시)
  useEffect(() => {
    setProduct(originProduct);
  }, [originProduct]);

  const handlePress = useCallback(() => {
    onPress(product);
  }, [onPress, product]);

  const handlePressLike = useCallback(() => {
    likeHaptic();
    const newIsWished = !product.isWished;

    if (useOptimisticUpdate) {
      setProduct(
        produce(draft => {
          draft.isWished = newIsWished;
        })
      );
    }

    onPressLike?.(product.id, newIsWished);
  }, [onPressLike, product.id, product.isWished, useOptimisticUpdate]);

  const pressableStyle = useCallback((info: PressableStateCallbackType) => {
    const { pressed } = info;

    return {
      transform: [{ scale: pressed ? 0.9 : 1 }],
      position: "absolute",
      top: 4,
      right: 4,
      width: 30,
      height: 30,
      alignItems: "center",
      justifyContent: "center",
      zIndex: 10,
    } as StyleProp<ViewStyle>;
  }, []);

  return (
    <TouchableOpacity className="relative" onPress={handlePress} activeOpacity={0.7}>
      <Pressable onPress={handlePressLike} style={pressableStyle}>
        <Icon icon={COMMON_ASSETS.bigLikeIcon} variant={product.isWished ? "active" : "default"} />
      </Pressable>
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
