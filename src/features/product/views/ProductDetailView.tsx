import { RouteProp, useRoute } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import { Dimensions, FlatList, ListRenderItemInfo, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Spinner from "@/common/components/Spinner/Spinner";
import TabBody from "@/common/components/Tabs/TabBody";
import TabHeader from "@/common/components/Tabs/TabHeader";
import { TabItemType } from "@/common/components/Tabs/Tabs";
import Typography from "@/common/components/Typography/Typography";
import { useMainNavigation } from "@/common/router";
import { COMMON_ROUTES, ROOT_ROUTES } from "@/common/router/routes";
import { CommonStackParamList } from "@/common/router/types";
import ProductDetailBenefitSection from "@/features/product/components/ProductDetailBenefitSection/ProductDetailBenefitSection";
import ProductDetailBrandSection from "@/features/product/components/ProductDetailBrandSection/ProductDetailBrandSection";
import ProductDetailDeliverySection from "@/features/product/components/ProductDetailDeliverySection/ProductDetailDeliverySection";
import ProductDetailHeader from "@/features/product/components/ProductDetailHeader/ProductDetailHeader";
import ProductDetailInfo from "@/features/product/components/ProductDetailInfo/ProductDetailInfo";
import ProductDetailPriceSection from "@/features/product/components/ProductDetailPriceSection/ProductDetailPriceSection";
import ProductDetailShowroomSection from "@/features/product/components/ProductDetailShowroomSection/ProductDetailShowroomSection";
import ProductDetailTabHeader from "@/features/product/components/ProductDetailTabHeader/ProductDetailTabHeader";
import ProductThumbnailCarousel from "@/features/product/components/ProductThumbnailCarousel/ProductThumbnailCarousel";
import { useGetProductDetail } from "@/features/product/hooks/useGetProductDetail";

const WINDOW_WIDTH = Dimensions.get("window").width;

export default function ProductDetailView() {
  const { params } = useRoute<RouteProp<CommonStackParamList, typeof COMMON_ROUTES.PRODUCT_DETAIL>>();
  const { productId } = params;
  const { data: productDetail, isLoading } = useGetProductDetail(productId);

  const [selectedIndex, setSelectedIndex] = useState(0); // tab index
  const [productDetailInfoHeight, setProductDetailInfoHeight] = useState(WINDOW_WIDTH); // info 탭 높이
  const [isExpand, setIsExpand] = useState(false);
  const { bottom } = useSafeAreaInsets();

  const handlePressExpand = useCallback(() => {
    setIsExpand(!isExpand);
  }, [isExpand]);

  const navigation = useMainNavigation();
  const handlePressBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handlePressSearch = useCallback(() => {
    navigation.navigate(ROOT_ROUTES.COMMON, {
      screen: COMMON_ROUTES.SEARCH,
    });
  }, [navigation]);

  const handlePressCart = useCallback(() => {
    navigation.navigate(ROOT_ROUTES.COMMON, {
      screen: COMMON_ROUTES.CART,
    });
  }, [navigation]);

  const handleLayoutProductDetailInfo = useCallback((height: number) => {
    setProductDetailInfoHeight(height);
  }, []);

  const tabItems = useMemo((): Array<TabItemType> => {
    const reviewCount = productDetail?.reviewCount || 0;
    const reviewCountString = reviewCount > 999 ? "999+" : reviewCount;

    return [
      {
        id: "info",
        label: "정보",
        render: () => (
          <ProductDetailInfo
            onLayoutHeight={handleLayoutProductDetailInfo}
            description={productDetail?.description || ""}
            isExpand={isExpand}
            onPressExpand={handlePressExpand}
          />
        ),
      },
      {
        id: "review",
        label: `리뷰 ${reviewCountString}`,
        render: () => (
          <View>
            <Text>리뷰</Text>
          </View>
        ),
      },
      {
        id: "inquiry",
        label: "문의",
        render: () => (
          <View>
            <Text>문의</Text>
          </View>
        ),
      },
    ];
  }, [
    handleLayoutProductDetailInfo,
    handlePressExpand,
    isExpand,
    productDetail?.description,
    productDetail?.reviewCount,
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

  const views = useMemo(
    () => [
      {
        key: "thumbnail",
        component: <ProductThumbnailCarousel key="thumbnail" images={productDetail?.coverImageUrls || []} />,
      },
      {
        key: "brand",
        component: (
          <ProductDetailBrandSection
            key="brand"
            marketName={productDetail?.marketName || ""}
            onPressMarket={handlePressMarket}
            onPressFollow={handlePressFollow}
          />
        ),
      },
      {
        key: "name",
        component: (
          <Typography key="name" className="text-16 text-black font-medium mt-14 px-20">
            {productDetail?.name}
          </Typography>
        ),
      },
      {
        key: "price",
        component: (
          <ProductDetailPriceSection
            key="price"
            containerClassName="mt-10"
            regularPrice={productDetail?.regularPrice || 0}
            salePrice={productDetail?.salePrice || 0}
            onPressCoupon={handlePressCoupon}
          />
        ),
      },
      {
        key: "benefit",
        component: (
          <ProductDetailBenefitSection key="benefit" benefitPrice={103000} containerClassName="mt-20 mb-40" />
        ),
      },
      {
        key: "showroom",
        component: <ProductDetailShowroomSection key="showroom" />,
      },
      {
        key: "delivery",
        component: (
          <ProductDetailDeliverySection
            key="delivery"
            deliveryEstimatedDays={productDetail?.deliveryEstimatedDays || 0}
            deliveryFee={productDetail?.deliveryFee || 0}
            deliveryType={productDetail?.deliveryType || ""}
            containerClassName="mb-40"
          />
        ),
      },
      {
        key: "tab-header",
        component: (
          <TabHeader
            wrapperClassName="bg-white border-b-[1px] border-gray2"
            items={tabItems}
            renderItem={renderTabHeader}
            selectedIndex={selectedIndex}
            keyExtractor={item => item.id}
            onPressTab={setSelectedIndex}
          />
        ),
      },
      {
        key: "tab-body",
        component: (
          <View
            style={{
              flex: 1,
              minHeight: (isExpand && selectedIndex === 0 ? productDetailInfoHeight : WINDOW_WIDTH) + 50, // 더보기 버튼 고려,
            }}
          >
            <TabBody
              items={tabItems}
              selectedIndex={selectedIndex}
              onChangeIndex={setSelectedIndex}
              enableGesture={false}
              skipIntermediateTabs={false}
              enableTabTransitionAnimation={false}
            />
          </View>
        ),
      },
    ],
    [
      handlePressCoupon,
      handlePressFollow,
      handlePressMarket,
      isExpand,
      productDetail?.coverImageUrls,
      productDetail?.deliveryEstimatedDays,
      productDetail?.deliveryFee,
      productDetail?.deliveryType,
      productDetail?.marketName,
      productDetail?.name,
      productDetail?.regularPrice,
      productDetail?.salePrice,
      productDetailInfoHeight,
      renderTabHeader,
      selectedIndex,
      tabItems,
    ]
  );
  const stickyHeaderIndices = views.findIndex(v => v.key === "tab-header");

  return (
    <View className="flex-1">
      <ProductDetailHeader
        onPressBack={handlePressBack}
        onPressSearch={handlePressSearch}
        onPressCart={handlePressCart}
      />
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <Spinner />
        </View>
      ) : (
        <FlatList
          data={views}
          renderItem={({ item }) => item.component}
          stickyHeaderIndices={[stickyHeaderIndices]}
          contentContainerStyle={{ paddingBottom: bottom }}
        />
      )}
    </View>
  );
}
