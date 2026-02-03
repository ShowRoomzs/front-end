import { View } from "react-native";

import HStack from "@/common/components/HStack/HStack";
import Typography from "@/common/components/Typography/Typography";
import VStack from "@/common/components/VStack/VStack";
import { useUserStore } from "@/common/stores/useUserStore";
import { cn } from "@/common/utils/cn";
import ProductCard from "@/features/product/components/ProductCard/ProductCard";
import { GAP, getCardWidth, PADDING_BLOCK } from "@/features/product/components/ProductListView/config";
import { Product } from "@/features/product/types/product";

interface ProductDetailRelatedProductsProps {
  items: Array<Product>;
  onPressProduct: (product: Product) => void;
  onPressLike: (productId: number, newIsWished: boolean) => void;
  containerClassName?: string;
}
export default function ProductDetailRelatedProducts(props: ProductDetailRelatedProductsProps) {
  const { items, onPressProduct, onPressLike, containerClassName } = props;
  const { user } = useUserStore();
  const numColumns = 2;

  return (
    <View className={cn("px-15", containerClassName)}>
      <Typography className="text-16 text-black font-medium mb-4">비슷한 상품</Typography>
      <VStack>
        {items
          .reduce<Array<Array<Product>>>((acc, item, index) => {
            if (index % 2 === 0) {
              acc.push([item]);
            } else {
              acc[acc.length - 1].push(item);
            }
            return acc;
          }, [])
          .map((row, rowIndex) => (
            <HStack
              key={rowIndex}
              gap={GAP}
              style={{
                paddingVertical: PADDING_BLOCK,
                borderBottomWidth: 1,
                borderBottomColor: "#EAEAEF",
              }}
            >
              {row.map(item => (
                <ProductCard
                  key={item.id}
                  useOptimisticUpdate={!!user}
                  onPressLike={onPressLike}
                  product={item}
                  onPress={onPressProduct}
                  width={getCardWidth(numColumns)}
                />
              ))}
            </HStack>
          ))}
      </VStack>
    </View>
  );
}
