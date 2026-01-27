import { RouteProp, useRoute } from "@react-navigation/native";
import { produce } from "immer";
import { useCallback, useMemo, useRef, useState } from "react";
import { LayoutChangeEvent, ListRenderItemInfo, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Spinner from "@/common/components/Spinner/Spinner";
import TabBody from "@/common/components/Tabs/TabBody";
import TabHeader from "@/common/components/Tabs/TabHeader";
import { TabItemType } from "@/common/components/Tabs/Tabs";
import Typography from "@/common/components/Typography/Typography";
import { useBottomSheet } from "@/common/hooks/useBottomSheet";
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
import ProductDetailTabHeader from "@/features/product/components/ProductDetailTabHeader/ProductDetailTabHeader";
import ProductOptionBottomSheet from "@/features/product/components/ProductOptionBottomSheet/ProductOptionBottomSheet";
import ProductThumbnailCarousel from "@/features/product/components/ProductThumbnailCarousel/ProductThumbnailCarousel";
import { useGetProductDetail } from "@/features/product/hooks/useGetProductDetail";
import { useGetRelatedProducts } from "@/features/product/hooks/useGetRelatedProducts";
import { Product } from "@/features/product/types/product";

const BOTTOM_TAB_HEIGHT = 59;

export default function ProductDetailView() {
  const { params } = useRoute<RouteProp<CommonStackParamList, typeof COMMON_ROUTES.PRODUCT_DETAIL>>();
  const { productId } = params;
  const { data: productDetail, isLoading: isProductDetailLoading } = useGetProductDetail(productId);
  const { data: relatedProducts } = useGetRelatedProducts(productId);
  const [tabHeaderY, setTabHeaderY] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const { open: openProductOptionBottomSheet } = useBottomSheet({
    id: "product-option",
    render: (
      <ProductOptionBottomSheet
        optionGroups={productDetail?.optionGroups || []}
        variants={productDetail?.variants || []}
      />
    ),
    sheetProps: {
      enableDynamicSizing: true,
    },
  });
  const [contentHeightMap, setContentHeightMap] = useState<Record<string, number>>({
    info: 0,
    review: 0,
    inquiry: 0,
  });
  const mainNavigation = useMainNavigation();
  const commonNavigation = useCommonNavigation();

  const [selectedIndex, setSelectedIndex] = useState(0); // tab index

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

  const handlePressLike = useCallback((product: Product, newIsWished: boolean) => {
    // TODO : 좋아요 처리
    console.log("product", product);
    console.log("newIsWished", newIsWished);
  }, []);

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
              items={relatedProducts?.products || []}
              onPressProduct={handlePressProduct}
              onPressLike={handlePressLike}
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
    handlePressExpand,
    handlePressLike,
    handlePressProduct,
    isExpand,
    productDetail?.description,
    productDetail?.reviewCount,
    relatedProducts?.products,
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
        <ProductDetailTabHeader
          item={item}
          itemCount={tabItems.length}
          isActive={item.index === selectedIndex}
        />
      );
    },
    [selectedIndex, tabItems.length]
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
      setSelectedIndex(index);
      requestAnimationFrame(() => {
        scrollViewRef.current?.scrollTo({
          y: tabHeaderY,
          animated: true,
        });
      });
    },
    [tabHeaderY]
  );

  const handlePressPurchase = useCallback(() => {
    openProductOptionBottomSheet();
  }, [openProductOptionBottomSheet]);

  return (
    <View className="flex-1">
      <ProductDetailHeader
        onPressBack={handlePressBack}
        onPressSearch={handlePressSearch}
        onPressCart={handlePressCart}
      />
      {isProductDetailLoading ? (
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
              selectedIndex={selectedIndex}
              keyExtractor={item => item.id}
              onPressTab={handleChangeSelectedIndex}
            />
          </View>
          <TabBody
            wrapperClassName="flex-1"
            items={tabItems}
            selectedIndex={selectedIndex}
            onChangeIndex={handleChangeSelectedIndex}
            onLayout={handleLayoutTabBodyContent}
            style={{ height: contentHeightMap[tabItems[selectedIndex].id] }}
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
          isWished={productDetail?.isWished || false}
          likeCount="7.2천"
          onPressLike={() => {}}
          onPressPurchase={handlePressPurchase}
        />
      </View>
    </View>
  );
}
