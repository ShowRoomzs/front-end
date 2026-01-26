import { useCallback, useRef } from "react";
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";

import PagingList from "@/common/components/PagingList/PagingList";
import { useBottomTab } from "@/common/hooks/useBottomTab";
import { useTabs } from "@/common/hooks/useTabs";
import { useMainNavigation } from "@/common/router";
import { COMMON_ROUTES, ROOT_ROUTES } from "@/common/router/routes";
import { PageInfo } from "@/common/types/page";
import ProductCard from "@/features/product/components/ProductCard/ProductCard";
import {
  CARD_WIDTH,
  GAP,
  PADDING_BLOCK,
  PADDING_HORIZONTAL,
  SCROLL_THRESHOLD,
} from "@/features/product/components/ProductListView/config";
import { Product } from "@/features/product/types/params";

interface ProductListViewProps {
  data: Array<Product> | undefined;
  pageInfo: PageInfo | undefined;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}
export default function ProductListView(props: ProductListViewProps) {
  const { data, pageInfo, isLoading, onPageChange } = props;
  const navigation = useMainNavigation();
  const scrollY = useRef(0);
  const accumulatedScrollDown = useRef(0);
  const accumulatedScrollUp = useRef(0);

  const { hide: hideBottomTab, show: showBottomTab } = useBottomTab();
  const { hide: hideTabs, show: showTabs } = useTabs();

  const handleScrollDown = useCallback(() => {
    hideBottomTab();
    hideTabs();
  }, [hideBottomTab, hideTabs]);

  const handleScrollUp = useCallback(() => {
    showBottomTab();
    showTabs();
  }, [showBottomTab, showTabs]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
      const currentY = contentOffset.y;
      const maxScrollY = contentSize.height - layoutMeasurement.height;

      if (currentY < -SCROLL_THRESHOLD || currentY > maxScrollY) {
        return;
      }
      const diff = currentY - scrollY.current;

      if (diff > 0) {
        accumulatedScrollDown.current += diff;
        accumulatedScrollUp.current = 0;
        if (accumulatedScrollDown.current >= SCROLL_THRESHOLD) {
          handleScrollDown?.();
          accumulatedScrollDown.current = 0;
        }
      } else if (diff < 0) {
        accumulatedScrollUp.current += Math.abs(diff);
        accumulatedScrollDown.current = 0;
        if (accumulatedScrollUp.current >= SCROLL_THRESHOLD) {
          handleScrollUp?.();
          accumulatedScrollUp.current = 0;
        }
      }
      scrollY.current = currentY;
    },
    [handleScrollDown, handleScrollUp]
  );

  const handlePressProduct = useCallback(
    (product: Product) => {
      navigation.navigate(ROOT_ROUTES.COMMON, {
        screen: COMMON_ROUTES.PRODUCT_DETAIL,
        params: {
          productId: product.id,
        },
      });
    },
    [navigation]
  );

  const renderItem = useCallback(
    ({ item }: { item: Product }) => {
      return (
        <ProductCard product={item} onPress={product => handlePressProduct(product)} width={CARD_WIDTH} />
      );
    },
    [handlePressProduct]
  );

  return (
    <PagingList<Product>
      data={data}
      isLoading={isLoading}
      onPageChange={onPageChange}
      pageInfo={pageInfo}
      renderItem={renderItem}
      onScroll={handleScroll}
      numColumns={2}
      columnWrapperStyle={{
        gap: GAP,
        paddingBlock: PADDING_BLOCK,
        borderBottomWidth: 1,
        borderBottomColor: "#EAEAEF",
      }}
      contentContainerStyle={{
        paddingHorizontal: PADDING_HORIZONTAL,
      }}
    />
  );
}
