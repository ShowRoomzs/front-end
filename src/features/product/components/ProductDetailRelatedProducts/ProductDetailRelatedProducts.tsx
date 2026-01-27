import { View } from "react-native";

import HStack from "@/common/components/HStack/HStack";
import Typography from "@/common/components/Typography/Typography";
import VStack from "@/common/components/VStack/VStack";
import { cn } from "@/common/utils/cn";
import ProductCard from "@/features/product/components/ProductCard/ProductCard";
import { CARD_WIDTH, GAP, PADDING_BLOCK } from "@/features/product/components/ProductListView/config";
import { Product } from "@/features/product/types/product";

interface ProductDetailRelatedProductsProps {
  items: Array<Product>;
  onPressProduct: (product: Product) => void;
  onPressLike: (product: Product, newIsWished: boolean) => void;
  containerClassName?: string;
}
export default function ProductDetailRelatedProducts(props: ProductDetailRelatedProductsProps) {
  const { items, onPressProduct, onPressLike, containerClassName } = props;

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
                  showLike
                  onPressLike={onPressLike}
                  product={item}
                  onPress={onPressProduct}
                  width={CARD_WIDTH}
                />
              ))}
            </HStack>
          ))}
      </VStack>
    </View>
  );
}
