import { RouteProp, useRoute } from "@react-navigation/native";
import { produce } from "immer";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LayoutChangeEvent, ListRenderItemInfo, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Spinner from "@/common/components/Spinner/Spinner";
import StretchTabHeaderItem from "@/common/components/Tabs/StretchTabHeaderItem";
import TabBody from "@/common/components/Tabs/TabBody";
import TabHeader from "@/common/components/Tabs/TabHeader";
import { TabItemType } from "@/common/components/Tabs/Tabs";
import Typography from "@/common/components/Typography/Typography";
import { useBottomSheet } from "@/common/hooks/useBottomSheet";
import { usePermissionPress } from "@/common/hooks/usePermissionPress";
import { useTabIndex } from "@/common/hooks/useTabIndex";
import { useCommonNavigation, useMainNavigation } from "@/common/router";
import { COMMON_ROUTES, ROOT_ROUTES } from "@/common/router/routes";
import { CommonStackParamList } from "@/common/router/types";
import ProductDetailActions from "@/features/product/components/ProductDetailActions/ProductDetailActions";
import ProductDetailBenefitSection from "@/features/product/components/ProductDetailBenefitSection/ProductDetailBenefitSection";
import ProductDetailBrandSection from "@/features/product/components/ProductDetailBrandSection/ProductDetailBrandSection";
import ProductDetailDeliverySection from "@/features/product/components/ProductDetailDeliverySection/ProductDetailDeliverySection";
import ProductDetailHeader from "@/features/product/components/ProductDetailHeader/ProductDetailHeader";
import ProductDetailInfo from "@/features/product/components/ProductDetailInfo/ProductDetailInfo";
import ProductDetailPriceSection from "@/features/product/components/ProductDetailPriceSection/ProductDetailPriceSection";
import ProductDetailRelatedProducts from "@/features/product/components/ProductDetailRelatedProducts/ProductDetailRelatedProducts";
import ProductDetailShowroomSection from "@/features/product/components/ProductDetailShowroomSection/ProductDetailShowroomSection";
import { PRODUCT_OPTION_BOTTOM_SHEET_MAX_HEIGHT } from "@/features/product/components/ProductOptionBottomSheet/config";
import ProductOptionBottomSheet from "@/features/product/components/ProductOptionBottomSheet/ProductOptionBottomSheet";
import ProductThumbnailCarousel from "@/features/product/components/ProductThumbnailCarousel/ProductThumbnailCarousel";
import { useGetProductDetail } from "@/features/product/hooks/useGetProductDetail";
import { useGetRelatedProducts } from "@/features/product/hooks/useGetRelatedProducts";
import { useProductVariantSelection } from "@/features/product/stores/useProductVariantSelection";
import { Product, ProductDetail } from "@/features/product/types/product";
import { useUpdateWishlist } from "@/features/wishlist/hooks/useUpdateWishlist";

const BOTTOM_TAB_HEIGHT = 59;

export default function ProductDetailView() {
  const { params } = useRoute<RouteProp<CommonStackParamList, typeof COMMON_ROUTES.PRODUCT_DETAIL>>();
  const { productId } = params;
  const { data: productDetail, isLoading, isStale } = useGetProductDetail(productId);
  const { data: relatedProducts } = useGetRelatedProducts(productId);
  const { update: updateWishlist, cleanupFns } = useUpdateWishlist();
  const { clearSelectedVariants } = useProductVariantSelection();
  const { selectedTabIndex, updateTabIndex } = useTabIndex(0);
  const [tabHeaderY, setTabHeaderY] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  // 낙관적 업데이트를 위한 상태
  const [localProduct, setLocalProduct] = useState<ProductDetail | undefined>(undefined);

  useEffect(() => {
    if (productDetail && !isStale) {
      setLocalProduct(productDetail);
    }
  }, [isStale, productDetail]);

  const { open: openProductOptionBottomSheet } = useBottomSheet({
    id: "product-option",
    render: (
      <ProductOptionBottomSheet
        productId={productId}
        optionGroups={productDetail?.optionGroups || []}
        variants={productDetail?.variants || []}
      />
    ),
    sheetProps: {
      enableDynamicSizing: true,
      enableContentPanningGesture: false, // 내부 콘텐츠 패닝 금지
      enableHandlePanningGesture: false, // 핸들 패닝 금지
      snapPoints: ["80%"], // 최대 높이 화면 80%
      maxDynamicContentSize: PRODUCT_OPTION_BOTTOM_SHEET_MAX_HEIGHT,
    },
  });
  const [contentHeightMap, setContentHeightMap] = useState<Record<string, number>>({
    info: 0,
    review: 0,
    inquiry: 0,
  });
  const mainNavigation = useMainNavigation();
  const commonNavigation = useCommonNavigation();

  const [isExpand, setIsExpand] = useState(false);
  const { bottom } = useSafeAreaInsets();

  const handlePressExpand = useCallback(() => {
    setIsExpand(!isExpand);
  }, [isExpand]);

  const handlePressBack = useCallback(() => {
    mainNavigation.goBack();
  }, [mainNavigation]);

  const handlePressSearch = useCallback(() => {
    mainNavigation.navigate(ROOT_ROUTES.COMMON, {
      screen: COMMON_ROUTES.SEARCH,
    });
  }, [mainNavigation]);

  const handlePressCart = useCallback(() => {
    mainNavigation.navigate(ROOT_ROUTES.COMMON, {
      screen: COMMON_ROUTES.CART,
    });
  }, [mainNavigation]);

  // product detail 좋아요 처리 권한 체크
  const handlePermissionLike = usePermissionPress((productId: number, newIsWished: boolean) => {
    // ui 낙관적 업데이트 이후 좋아요 상태 업데이트
    if (productId === productDetail?.id) {
      setLocalProduct(
        produce(draft => {
          if (!draft) {
            return;
          }
          draft.isWished = newIsWished;
        })
      );
    }
    updateWishlist(productId, newIsWished);
  });

  const handlePressProduct = useCallback(
    (product: Product) => {
      commonNavigation.push(COMMON_ROUTES.PRODUCT_DETAIL, { productId: product.id });
    },
    [commonNavigation]
  );

  const tabItems = useMemo((): Array<TabItemType> => {
    const reviewCount = productDetail?.reviewCount || 0;
    const reviewCountString = reviewCount > 999 ? "999+" : reviewCount;

    return [
      {
        id: "info",
        label: "정보",
        render: () => (
          <>
            <ProductDetailInfo
              description={productDetail?.description || ""}
              isExpand={isExpand}
              onPressExpand={handlePressExpand}
            />
            <ProductDetailRelatedProducts
              containerClassName="mt-40"
              items={relatedProducts?.content || []}
              onPressProduct={handlePressProduct}
              onPressLike={handlePermissionLike}
            />
          </>
        ),
      },
      {
        id: "review",
        label: `리뷰 ${reviewCountString}`,
        render: () => (
          <View style={{ height: 500 }}>
            <Text>리뷰</Text>
          </View>
        ),
      },
      {
        id: "inquiry",
        label: "문의",
        render: () => (
          <View style={{ height: 500 }}>
            <Text>문의</Text>
          </View>
        ),
      },
    ];
  }, [
    handlePermissionLike,
    handlePressExpand,
    handlePressProduct,
    isExpand,
    productDetail?.description,
    productDetail?.reviewCount,
    relatedProducts?.content,
  ]);

  const handlePressMarket = useCallback(() => {
    console.log("market");
  }, []);

  const handlePressFollow = useCallback(() => {
    console.log("follow");
  }, []);

  const handlePressCoupon = useCallback(() => {
    console.log("coupon");
  }, []);

  const renderTabHeader = useCallback(
    (item: ListRenderItemInfo<TabItemType>) => {
      return (
        <StretchTabHeaderItem
          item={item.item}
          itemCount={tabItems.length}
          isActive={item.index === selectedTabIndex}
        />
      );
    },
    [selectedTabIndex, tabItems.length]
  );

  const handleLayoutTabBodyContent = useCallback((key: string, e: LayoutChangeEvent) => {
    const height = e.nativeEvent.layout.height;

    setContentHeightMap(
      produce(draft => {
        draft[key] = height;
      })
    );
  }, []);

  const handleChangeSelectedIndex = useCallback(
    (index: number) => {
      updateTabIndex(index);
      requestAnimationFrame(() => {
        scrollViewRef.current?.scrollTo({
          y: tabHeaderY,
          animated: true,
        });
      });
    },
    [tabHeaderY, updateTabIndex]
  );

  const handlePressPurchase = useCallback(() => {
    openProductOptionBottomSheet();
  }, [openProductOptionBottomSheet]);

  useEffect(() => {
    return () => {
      if (!cleanupFns?.length) {
        return;
      }
      console.log("ASDf");
      cleanupFns.forEach((fn: () => void) => fn());
    };
  }, [cleanupFns]);

  useEffect(() => {
    return () => {
      clearSelectedVariants(productId);
    };
  }, [clearSelectedVariants, productId]);
  return (
    <View className="flex-1">
      <ProductDetailHeader
        onPressBack={handlePressBack}
        onPressSearch={handlePressSearch}
        onPressCart={handlePressCart}
      />
      {isLoading || isStale ? (
        <View className="flex-1 items-center justify-center">
          <Spinner />
        </View>
      ) : (
        <ScrollView
          ref={scrollViewRef}
          stickyHeaderIndices={[7]}
          contentContainerStyle={{ paddingBottom: bottom + BOTTOM_TAB_HEIGHT }}
        >
          <ProductThumbnailCarousel images={productDetail?.coverImageUrls || []} />
          <ProductDetailBrandSection
            marketName={productDetail?.marketName || ""}
            onPressMarket={handlePressMarket}
            onPressFollow={handlePressFollow}
          />
          <Typography className="text-16 text-black font-medium mt-14 px-20">
            {productDetail?.name}
          </Typography>
          <ProductDetailPriceSection
            containerClassName="mt-10"
            regularPrice={productDetail?.regularPrice || 0}
            salePrice={productDetail?.salePrice || 0}
            onPressCoupon={handlePressCoupon}
          />
          <ProductDetailBenefitSection benefitPrice={103000} containerClassName="mt-20 mb-40" />
          <ProductDetailShowroomSection />
          <ProductDetailDeliverySection
            deliveryEstimatedDays={productDetail?.deliveryEstimatedDays || 0}
            deliveryFee={productDetail?.deliveryFee || 0}
            deliveryType={productDetail?.deliveryType || ""}
            containerClassName="mb-40"
          />
          <View onLayout={e => setTabHeaderY(e.nativeEvent.layout.y)}>
            <TabHeader
              wrapperClassName="bg-white border-b-[1px] border-gray2"
              items={tabItems}
              renderItem={renderTabHeader}
              selectedIndex={selectedTabIndex}
              keyExtractor={item => item.id}
              onPressTab={handleChangeSelectedIndex}
            />
          </View>
          <TabBody
            scrollable={false}
            wrapperClassName="flex-1"
            items={tabItems}
            selectedIndex={selectedTabIndex}
            onChangeIndex={handleChangeSelectedIndex}
            onLayout={handleLayoutTabBodyContent}
            style={{ height: contentHeightMap[tabItems[selectedTabIndex].id] }}
            enableGesture={false}
            enableTabTransitionAnimation={false}
          />
        </ScrollView>
      )}
      <View
        style={{
          height: BOTTOM_TAB_HEIGHT + bottom,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.1,
          shadowRadius: 20,
          elevation: 10,
        }}
        className="p-10 bg-white absolute bottom-0 left-0 right-0 h-50"
      >
        <ProductDetailActions
          isWished={localProduct?.isWished || false}
          likeCount="7.2천" // TODO : 좋아요 수 표시
          onPressLike={(newIsWished: boolean) => handlePermissionLike(productId, newIsWished)}
          onPressPurchase={handlePressPurchase}
        />
      </View>
    </View>
  );
}
