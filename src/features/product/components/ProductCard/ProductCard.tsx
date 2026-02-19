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
import { cn } from "@/common/utils/cn";
import { likeHaptic } from "@/common/utils/haptics";
import { parseCount, SIZE_CLASSES, SIZE_RATIO } from "@/features/product/components/ProductCard/config";
import { Product } from "@/features/product/types/product";

export type ProductCardSize = "sm" | "md";
interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
  width: number;
  onPressLike?: (productId: number, newIsWished: boolean) => void;
  useOptimisticUpdate?: boolean;
  size?: ProductCardSize;
  sizeRatio?: number;
}

export default function ProductCard(props: ProductCardProps) {
  const {
    product: originProduct,
    onPress,
    width,
    onPressLike,
    useOptimisticUpdate,
    size = "md",
    sizeRatio = SIZE_RATIO,
  } = props;
  const [product, setProduct] = useState(originProduct);
  const height = width * sizeRatio;

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

    // 낙관적 업데이트 여부
    if (useOptimisticUpdate) {
      setProduct(
        produce(draft => {
          const newWishCount = Math.max(0, draft.wishCount + (newIsWished ? 1 : -1));

          draft.isWished = newIsWished;
          draft.wishCount = newWishCount;
        })
      );
    }

    // 좋아요 상태 업데이트
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

  const classes = SIZE_CLASSES[size];
  const showCountSection = product.wishCount > 0 || product.reviewCount > 0;

  return (
    <TouchableOpacity className="relative" onPress={handlePress} activeOpacity={0.7}>
      <Pressable onPress={handlePressLike} style={pressableStyle}>
        <Icon icon={COMMON_ASSETS.bigLikeIcon} variant={product.isWished ? "active" : "default"} />
      </Pressable>
      <VStack style={{ width }}>
        <Image style={{ height: height }} source={{ uri: product.thumbnailUrl }} />
        <VStack className="mt-15">
          <Typography className={cn("font-normal", classes.marketName)}>{product.marketName}</Typography>
          <Typography
            className={cn("mt-6 font-medium", classes.productName)}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {product.name}
          </Typography>
          <HStack className="mt-8" gap={6}>
            {product.price.discountRate > 0 && (
              <Typography className={cn("font-medium", classes.discountRate)}>
                {product.price.discountRate}%
              </Typography>
            )}
            <Typography className={cn("font-semibold", classes.salePrice)}>
              ₩ {product.price.salePrice.toLocaleString()}
            </Typography>
          </HStack>
          {showCountSection && (
            <HStack className="mt-10" gap={10}>
              {product.wishCount > 0 && (
                <HStack className="items-center" gap={4}>
                  <Icon icon={COMMON_ASSETS.likeIcon} />
                  <Typography className="text-11 text-gray10 font-normal">
                    {parseCount(product.wishCount)}
                  </Typography>
                </HStack>
              )}
              {product.reviewCount > 0 && (
                <HStack className="items-center" gap={4}>
                  <Icon icon={COMMON_ASSETS.commentIcon} />
                  <Typography className="text-11 text-gray10 font-normal">
                    {parseCount(product.reviewCount)}
                  </Typography>
                </HStack>
              )}
            </HStack>
          )}
        </VStack>
      </VStack>
    </TouchableOpacity>
  );
}
