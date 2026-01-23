import { useCallback, useRef } from "react";
import { FlatList, NativeScrollEvent, NativeSyntheticEvent } from "react-native";

import ProductCard from "@/features/product/components/ProductCard/ProductCard";
import {
  CARD_WIDTH,
  GAP,
  PADDING_HORIZONTAL,
  SCROLL_THRESHOLD,
} from "@/features/product/components/ProductListView/config";
import { Product } from "@/features/product/types/params";

interface ProductListViewProps {
  products: Array<Product>;
  onEndReached: () => void;
  onRefresh: () => void;
  isLoading: boolean;
  onScrollDown?: () => void;
  onScrollUp?: () => void;
}
export default function ProductListView(props: ProductListViewProps) {
  const { products, onEndReached, isLoading, onScrollDown, onScrollUp } = props;

  const scrollY = useRef(0);
  const accumulatedScrollDown = useRef(0);
  const accumulatedScrollUp = useRef(0);

  const renderItem = useCallback(({ item }: { item: Product }) => {
    return <ProductCard product={item} onPress={() => {}} width={CARD_WIDTH} />;
  }, []);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
      const currentY = contentOffset.y;
      const maxScrollY = contentSize.height - layoutMeasurement.height;

      if (currentY < -10 || currentY > maxScrollY) {
        return;
      }

      const diff = currentY - scrollY.current;

      if (diff > 0) {
        accumulatedScrollDown.current += diff;
        accumulatedScrollUp.current = 0;

        if (accumulatedScrollDown.current >= SCROLL_THRESHOLD) {
          onScrollDown?.();
          accumulatedScrollDown.current = 0;
        }
      } else if (diff < 0) {
        accumulatedScrollUp.current += Math.abs(diff);
        accumulatedScrollDown.current = 0;

        if (accumulatedScrollUp.current >= SCROLL_THRESHOLD) {
          onScrollUp?.();
          accumulatedScrollUp.current = 0;
        }
      }

      scrollY.current = currentY;
    },
    [onScrollDown, onScrollUp]
  );

  return (
    <FlatList
      data={products}
      renderItem={renderItem}
      numColumns={2}
      onScroll={handleScroll}
      columnWrapperStyle={{
        paddingHorizontal: PADDING_HORIZONTAL,
        gap: GAP,
        borderBottomWidth: 1,
        borderBottomColor: "#EAEAEF",
        paddingBlock: 25,
      }}
      onEndReached={onEndReached}
    />
  );
}
