import { FlatList } from "react-native";

import Typography from "@/common/components/Typography/Typography";
import VStack from "@/common/components/VStack/VStack";
import {
  MARKET_POPULAR_PRODUCT_WIDTH,
  MARKET_POPULAR_PRODUCTS_GAP,
  MARKET_POPULAR_PRODUCTS_PADDING_HORIZONTAL,
} from "@/features/market/components/MarketPopularProducts/config";
import ProductCard from "@/features/product/components/ProductCard/ProductCard";
import { Product } from "@/features/product/types/product";

interface MarketPopularProductsProps {
  products: Array<Product>;
  wrapperClassName?: string;
}
export default function MarketPopularProducts(props: MarketPopularProductsProps) {
  const { products, wrapperClassName } = props;

  return (
    <VStack className={wrapperClassName} gap={25}>
      <Typography className="text-black text-16 font-semibold px-20">쇼룸 인기상품 TOP 10</Typography>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={MARKET_POPULAR_PRODUCT_WIDTH}
        contentContainerStyle={{
          gap: MARKET_POPULAR_PRODUCTS_GAP,
          paddingHorizontal: MARKET_POPULAR_PRODUCTS_PADDING_HORIZONTAL,
        }}
        data={products}
        renderItem={({ item }) => (
          <ProductCard
            sizeRatio={0.945}
            onPress={() => {}}
            width={MARKET_POPULAR_PRODUCT_WIDTH}
            size="sm"
            product={item}
          />
        )}
      />
    </VStack>
  );
}
