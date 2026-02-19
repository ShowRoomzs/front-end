import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import TabBody from "@/common/components/Tabs/TabBody";
import TabHeader from "@/common/components/Tabs/TabHeader";
import { TabItemType } from "@/common/components/Tabs/Tabs";
import { SORT_FILTER_KEY } from "@/common/constants/filterKey";
import { useBottomSheet } from "@/common/hooks/useBottomSheet";
import { cn } from "@/common/utils/cn";
import { useCategory } from "@/features/category/hooks/useCategory";
import { DEFAULT_SORT_VALUE_PREFIX_LABEL } from "@/features/filter/constants/filter";
import { useGetFilters } from "@/features/filter/hooks/useGetFilters";
import { Filter } from "@/features/filter/types/filter";
import { MARKET_DETAIL_HEADER_HEIGHT } from "@/features/market/components/MarketDetailHeader/config";
import MarketDetailProfileSection from "@/features/market/components/MarketDetailProfileSection/MarketDetailProfileSection";
import MarketDetailSearch from "@/features/market/components/MarketDetailSearch/MarketDetailSearch";
import MarketPopularProducts from "@/features/market/components/MarketPopularProducts/MarketPopularProducts";
import MarketProductList, {
  MarketProductListRef,
} from "@/features/market/components/MarketProductList/MarketProductList";
import SortBottomSheetView from "@/features/market/components/SortBottomSheetView/SortBottomSheetView";
import { Market } from "@/features/market/types/market";
import { Product } from "@/features/product/types/product";

const LOAD_MORE_THRESHOLD = 200;

interface MarketContentProps {
  market: Market | undefined;
  wrapperClassName?: string;
  onPressFollow: (newIsFollowed: boolean) => void;
}
const DUMMY_PRODUCTS: Array<Product> = [
  {
    id: 1,
    categoryId: 1,
    categoryName: "의류",
    createdAt: "2025-01-15T10:00:00Z",
    deliveryEstimatedDays: 3,
    deliveryFee: 3000,
    deliveryFreeThreshold: 50000,
    deliveryType: "PARCEL",
    description: "편안한 코튼 기본 티셔츠",
    gender: "FEMALE",
    isDisplay: true,
    isRecommended: true,
    isWished: false,
    wishCount: 42,
    marketId: 1,
    marketName: "number",
    name: "베이직 오버핏 티셔츠",
    price: { regularPrice: 29000, discountRate: 15, salePrice: 24650, maxBenefitPrice: 24650 },
    productNotice: "상세페이지 참조",
    productNumber: "PRD-001",
    purchasePrice: 15000,
    representativeImageUrl: "https://picsum.photos/400/400?random=1",
    reviewCount: 128,
    sellerProductCode: "SELLER-001",
    status: { isOutOfStock: false, isOutOfStockForced: false },
    tags: ["베이직", "오버핏", "티셔츠"],
    thumbnailUrl: "https://picsum.photos/400/400?random=1",
  },
  {
    id: 2,
    categoryId: 1,
    categoryName: "의류",
    createdAt: "2025-01-16T10:00:00Z",
    deliveryEstimatedDays: 2,
    deliveryFee: 0,
    deliveryFreeThreshold: 30000,
    deliveryType: "PARCEL",
    description: "가벼운 린넨 스트레이트 팬츠",
    gender: "FEMALE",
    isDisplay: true,
    isRecommended: false,
    isWished: true,
    wishCount: 89,
    marketId: 1,
    marketName: "number",
    name: "",
    price: { regularPrice: 45000, discountRate: 20, salePrice: 36000, maxBenefitPrice: 36000 },
    productNotice: "상세페이지 참조",
    productNumber: "PRD-002",
    purchasePrice: 22000,
    representativeImageUrl: "https://picsum.photos/400/400?random=2",
    reviewCount: 56,
    sellerProductCode: "SELLER-002",
    status: { isOutOfStock: false, isOutOfStockForced: false },
    tags: ["린넨", "와이드", "여름"],
    thumbnailUrl: "https://picsum.photos/400/400?random=2",
  },
  {
    id: 3,
    categoryId: 2,
    categoryName: "가방",
    createdAt: "2025-01-17T10:00:00Z",
    deliveryEstimatedDays: 5,
    deliveryFee: 5000,
    deliveryFreeThreshold: 100000,
    deliveryType: "PARCEL",
    description: "데일리로 쓰기 좋은 크로스백",
    gender: "FEMALE",
    isDisplay: true,
    isRecommended: true,
    isWished: false,
    wishCount: 156,
    marketId: 1,
    marketName: "number",
    name: "레더 크로스백",
    price: { regularPrice: 89000, discountRate: 10, salePrice: 80100, maxBenefitPrice: 80100 },
    productNotice: "상세페이지 참조",
    productNumber: "PRD-003",
    purchasePrice: 45000,
    representativeImageUrl: "https://picsum.photos/400/400?random=3",
    reviewCount: 234,
    sellerProductCode: "SELLER-003",
    status: { isOutOfStock: false, isOutOfStockForced: false },
    tags: ["가방", "크로스백", "레더"],
    thumbnailUrl: "https://picsum.photos/400/400?random=3",
  },
  {
    id: 4,
    categoryId: 1,
    categoryName: "의류",
    createdAt: "2025-01-18T10:00:00Z",
    deliveryEstimatedDays: 3,
    deliveryFee: 3000,
    deliveryFreeThreshold: 50000,
    deliveryType: "PARCEL",
    description: "부드러운 니트 카디건",
    gender: "FEMALE",
    isDisplay: true,
    isRecommended: true,
    isWished: false,
    wishCount: 203,
    marketId: 1,
    marketName: "number",
    name: "캐시미어 블렌드 카디건",
    price: { regularPrice: 78000, discountRate: 25, salePrice: 58500, maxBenefitPrice: 58500 },
    productNotice: "상세페이지 참조",
    productNumber: "PRD-004",
    purchasePrice: 35000,
    representativeImageUrl: "https://picsum.photos/400/400?random=4",
    reviewCount: 89,
    sellerProductCode: "SELLER-004",
    status: { isOutOfStock: false, isOutOfStockForced: false },
    tags: ["니트", "카디건", "가을"],
    thumbnailUrl: "https://picsum.photos/400/400?random=4",
  },
  {
    id: 5,
    categoryId: 3,
    categoryName: "신발",
    createdAt: "2025-01-19T10:00:00Z",
    deliveryEstimatedDays: 4,
    deliveryFee: 0,
    deliveryFreeThreshold: 50000,
    deliveryType: "PARCEL",
    description: "가벼운 스니커즈",
    gender: "FEMALE",
    isDisplay: true,
    isRecommended: false,
    isWished: true,
    wishCount: 312,
    marketId: 1,
    marketName: "number",
    name: "캔버스 스니커즈",
    price: { regularPrice: 65000, discountRate: 0, salePrice: 65000, maxBenefitPrice: 65000 },
    productNotice: "상세페이지 참조",
    productNumber: "PRD-005",
    purchasePrice: 28000,
    representativeImageUrl: "https://picsum.photos/400/400?random=5",
    reviewCount: 445,
    sellerProductCode: "SELLER-005",
    status: { isOutOfStock: false, isOutOfStockForced: false },
    tags: ["스니커즈", "캔버스", "데일리"],
    thumbnailUrl: "https://picsum.photos/400/400?random=5",
  },
];

export default function MarketContent(props: MarketContentProps) {
  const { market, wrapperClassName, onPressFollow } = props;
  const { categoryMap } = useCategory();
  const { data: filters } = useGetFilters();
  const inset = useSafeAreaInsets();
  const [keyword, setKeyword] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [tabContentHeights, setTabContentHeights] = useState<Record<string, number>>({});
  const listRefs = useRef<Map<string, MarketProductListRef>>(new Map());
  const sortFilter = useMemo(() => filters?.find(f => f.filterKey === SORT_FILTER_KEY), [filters]);
  const isMounted = useRef(false);
  const [selectedSortValues, setSelectedSortValues] = useState<Array<string>>([]);

  const getInitialSortValues = useCallback(() => {
    const initialSortValues = sortFilter?.values.find(v => v.extra === "default");

    if (!initialSortValues) {
      return [];
    }
    return [initialSortValues.value];
  }, [sortFilter?.values]);

  useEffect(() => {
    const initialSortValues = getInitialSortValues();

    if (!initialSortValues || isMounted.current) {
      return;
    }

    setSelectedSortValues(initialSortValues);
    isMounted.current = true;
  }, [getInitialSortValues]);

  const handleConfirm = useCallback(
    (newSortValues: Array<string>) => {
      setSelectedSortValues(newSortValues);
    },
    [setSelectedSortValues]
  );

  const sortBottomSheetRender = useMemo(
    () => (
      <SortBottomSheetView
        filter={sortFilter as Filter}
        selectedValues={selectedSortValues}
        onConfirm={handleConfirm}
      />
    ),
    [handleConfirm, selectedSortValues, sortFilter]
  );

  const { open: openSortBottomSheet } = useBottomSheet({
    id: "sort-bottom-sheet",
    render: sortBottomSheetRender,
    sheetProps: {
      snapPoints: ["40%"],
    },
  });

  const subCategories = useMemo(() => {
    if (!categoryMap || !market?.mainCategoryId) {
      return [];
    }

    return categoryMap.byParentId.get(market.mainCategoryId);
  }, [categoryMap, market?.mainCategoryId]);

  const setTabHeight = useCallback((id: string, height: number) => {
    setTabContentHeights(prev => {
      if (prev[id] === height) {
        return prev;
      }
      return { ...prev, [id]: height };
    });
  }, []);

  const tabItems = useMemo(
    (): Array<TabItemType> => [
      {
        id: "all",
        label: "전체",
        render: () => (
          <MarketProductList
            ref={ref => {
              if (ref) {
                listRefs.current.set("all", ref);
              } else {
                listRefs.current.delete("all");
              }
            }}
            onContentHeightChange={h => setTabHeight("all", h)}
            categoryId={null}
            keyword={keyword}
            selectedSortValues={selectedSortValues}
            marketId={market?.shopId as number}
          />
        ),
      },
      ...(subCategories || []).map(category => ({
        id: category.categoryId.toString(),
        label: category.name,
        render: () => (
          <MarketProductList
            ref={ref => {
              if (ref) {
                listRefs.current.set(category.categoryId.toString(), ref);
              } else {
                listRefs.current.delete(category.categoryId.toString());
              }
            }}
            onContentHeightChange={h => setTabHeight(category.categoryId.toString(), h)}
            categoryId={category.categoryId}
            keyword={keyword}
            marketId={market?.shopId as number}
            selectedSortValues={selectedSortValues}
          />
        ),
      })),
    ],
    [subCategories, keyword, selectedSortValues, market?.shopId, setTabHeight]
  );

  const handlePressTab = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
      const isNearBottom =
        layoutMeasurement.height + contentOffset.y >= contentSize.height - LOAD_MORE_THRESHOLD;

      if (!isNearBottom) {
        return;
      }

      const activeTabId = tabItems[selectedIndex]?.id;
      const activeList = activeTabId ? listRefs.current.get(activeTabId) : undefined;

      if (activeList && !activeList.isLoading && activeList.hasNext) {
        activeList.loadMore();
      }
    },
    [selectedIndex, tabItems]
  );

  const sortLabel = useMemo(() => {
    const targetValue = sortFilter?.values.find(v => v.value === selectedSortValues[0]);

    return targetValue?.label.replace(DEFAULT_SORT_VALUE_PREFIX_LABEL, "").trim();
  }, [selectedSortValues, sortFilter?.values]);

  if (!market) {
    return null;
  }

  return (
    <ScrollView
      stickyHeaderIndices={[3]}
      scrollEventThrottle={16}
      onScroll={handleScroll}
      className={cn(wrapperClassName)}
    >
      <MarketDetailProfileSection
        thumbnailUrl={market.shopImageUrl}
        marketName={market.shopName}
        categoryName={market.mainCategoryName}
        followerCount={market.followerCount}
        shopDescription={market.shopDescription}
        snsLinks={market.snsLinks}
        onPressFollow={onPressFollow}
        isFollowed={market.followed}
        wrapperClassName="px-20"
      />
      <MarketPopularProducts wrapperClassName="mt-25 pb-36" products={DUMMY_PRODUCTS} />
      {/* divider */}
      <View className="w-full h-10 bg-gray1 mb-15" />
      <TabHeader
        items={tabItems}
        keyExtractor={item => item.id}
        selectedIndex={selectedIndex}
        wrapperClassName="border-b-[1px] border-gray2 bg-white"
        onPressTab={handlePressTab}
      />
      <MarketDetailSearch
        onPressSearch={setKeyword}
        wrapperClassName="px-20 mt-20"
        onPressChipButton={openSortBottomSheet}
        sortLabel={sortLabel ?? ""}
      />
      <TabBody
        scrollable={false}
        items={tabItems}
        selectedIndex={selectedIndex}
        onChangeIndex={handlePressTab}
        skipIntermediateTabs
        style={{
          height: tabContentHeights[tabItems[selectedIndex]?.id] + inset.bottom + MARKET_DETAIL_HEADER_HEIGHT,
        }}
      />
    </ScrollView>
  );
}
