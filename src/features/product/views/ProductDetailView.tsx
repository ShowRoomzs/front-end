import { RouteProp, useRoute } from "@react-navigation/native";
import { AxiosError } from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Linking, ScrollView, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import BusinessFooter from "@/common/components/BusinessFooter/BusinessFooter";
import CollapsibleSection from "@/common/components/CollapsibleSection/CollapsibleSection";
import HeaderActions from "@/common/components/HeaderActions/HeaderActions";
import ScreenHeader from "@/common/components/ScreenHeader/ScreenHeader";
import Spinner from "@/common/components/Spinner/Spinner";
import Typography from "@/common/components/Typography/Typography";
import { useBottomSheet } from "@/common/hooks/useBottomSheet";
import { usePermissionPress } from "@/common/hooks/usePermissionPress";
import { toast } from "@/common/providers/ToastProvider";
import { useCommonNavigation, useMainNavigation } from "@/common/router";
import { COMMON_ROUTES, ROOT_ROUTES } from "@/common/router/routes";
import { CommonStackParamList } from "@/common/router/types";
import { CustomErrorResponse } from "@/common/types/error";
import { useCart } from "@/features/cart/hooks/useCart";
import ProductDeliveryBlock from "@/features/product/components/ProductDeliveryBlock/ProductDeliveryBlock";
import ProductDeliveryPolicy from "@/features/product/components/ProductDeliveryPolicy/ProductDeliveryPolicy";
import ProductDetailBrandSection from "@/features/product/components/ProductDetailBrandSection/ProductDetailBrandSection";
import ProductDetailInfo from "@/features/product/components/ProductDetailInfo/ProductDetailInfo";
import ProductDetailInquiry from "@/features/product/components/ProductDetailInquiry/ProductDetailInquiry";
import ProductGallery from "@/features/product/components/ProductGallery/ProductGallery";
import ProductGroupBuyRow from "@/features/product/components/ProductGroupBuyRow/ProductGroupBuyRow";
import ProductNoticeTable, {
  NoticeRow,
} from "@/features/product/components/ProductNoticeTable/ProductNoticeTable";
import ProductOptionBottomSheet from "@/features/product/components/ProductOptionBottomSheet/ProductOptionBottomSheet";
import ProductPriceBlock from "@/features/product/components/ProductPriceBlock/ProductPriceBlock";
import ProductSellerInfo from "@/features/product/components/ProductSellerInfo/ProductSellerInfo";
import { PRODUCT_OPTION_BOTTOM_SHEET_PROPS } from "@/features/product/constants/optionBottomSheet";
import { useGetProductDetail } from "@/features/product/hooks/useGetProductDetail";
import { useProductVariantSelection } from "@/features/product/stores/useProductVariantSelection";
import { ProductDetail } from "@/features/product/types/product";

/**
 * C7 상품 상세 — 갤러리 · 탭 구조.
 *
 * 1:1 갤러리 → 브랜드 → 상품명·가격 → 배송 → 탭(상세정보 / 문의 / 판매자 정보), 하단 [구매하기] 고정.
 *
 * 찜(♥)이 없다. 찜은 게시물 단위이고 서버도 상품 상세에 그 필드를 내려주지 않는다 —
 * 저장할 가치가 있는 것은 공구 게시물이지 그 안의 낱개 상품이 아니라는 판단이다.
 *
 * 가격 아래의 [공동구매 D-3 + 쇼룸] 줄은 아직 그리지 않는다. 서버가 groupBuyStatus(진행 단계)만
 * 내려주고 마감일도 쇼룸도 주지 않아, 이 상품이 어느 공구에 붙어 있는지 알 수 없다.
 */
/** 상단 여백 12 + 버튼 52 + 하단 여백 26 — 본문이 이 아래로 숨지 않게 같은 값을 비운다 */
const BOTTOM_CTA_HEIGHT = 90;

/** 상세정보 탭 요약 표에 보여줄 고시 항목 수 */
const SPEC_ROW_COUNT = 5;

type ProductTabId = "info" | "inquiry" | "seller";

const TABS: Array<{ id: ProductTabId; label: string }> = [
  { id: "info", label: "상세정보" },
  { id: "inquiry", label: "문의" },
  { id: "seller", label: "판매자 정보" },
];

export default function ProductDetailView() {
  const { params } = useRoute<RouteProp<CommonStackParamList, typeof COMMON_ROUTES.PRODUCT_DETAIL>>();
  const { productId } = params;
  const { bottom } = useSafeAreaInsets();

  const { data: productDetail, isLoading } = useGetProductDetail(productId);
  const { create: createCart } = useCart();
  const { clearSelectedVariants, selectedVariantsByProductId } = useProductVariantSelection();

  const mainNavigation = useMainNavigation();
  const commonNavigation = useCommonNavigation();

  const [selectedTab, setSelectedTab] = useState<ProductTabId>("info");
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  /** 전 옵션이 소진되면 상품 전체가 판매 종료로 올라간다 */
  const isUnavailable = !!productDetail && isProductUnavailable(productDetail);

  const handlePressToast = useCallback(() => {
    mainNavigation.navigate(ROOT_ROUTES.COMMON, { screen: COMMON_ROUTES.CART });
    toast.hide();
  }, [mainNavigation]);

  const handlePressBottomSheetCart = usePermissionPress(async () => {
    const variants = selectedVariantsByProductId[productId];

    try {
      await createCart(
        variants.map(variant => ({
          productId,
          variantId: variant.variantId,
          quantity: variant.count,
        }))
      );

      toast.show({
        type: "point",
        fullWidth: true,
        offset: { bottom: 70 },
        message: (
          <View className="flex-row justify-between">
            <Typography className="text-13 font-medium text-white">장바구니에 상품을 담았습니다</Typography>
            <Typography onPress={handlePressToast} className="text-13 font-semibold text-white underline">
              바로 가기
            </Typography>
          </View>
        ),
      });
      clearSelectedVariants(productId);
    } catch (error) {
      const axiosError = error as AxiosError<CustomErrorResponse<string, { message?: string }>>;

      toast.show(axiosError.response?.data?.message || "장바구니에 추가에 실패했습니다.");
    }
  });

  /** 주문·결제 API가 아직 없어 [바로 구매]는 장바구니 담기까지만 이어진다 */
  const handlePressBottomSheetBuy = usePermissionPress(() => {
    toast.show("주문·결제 기능을 준비하고 있어요. 장바구니에 담아 두시면 열릴 때 알려드릴게요.");
  });

  const { open: openProductOptionBottomSheet } = useBottomSheet({
    id: "product-option",
    render: (
      <ProductOptionBottomSheet
        productId={productId}
        optionGroups={productDetail?.optionGroups || []}
        variants={productDetail?.variants || []}
        onPressCart={handlePressBottomSheetCart}
        onPressBuy={handlePressBottomSheetBuy}
      />
    ),
    sheetProps: PRODUCT_OPTION_BOTTOM_SHEET_PROPS,
  });

  const handlePressShowroom = useCallback(
    (showroomId: number) => {
      mainNavigation.navigate(ROOT_ROUTES.COMMON, {
        screen: COMMON_ROUTES.SHOWROOM_DETAIL,
        params: { showroomId },
      });
    },
    [mainNavigation]
  );

  const handlePressBrandSite = useCallback(() => {
    if (!productDetail?.brandSiteUrl) {
      return;
    }
    void Linking.openURL(productDetail.brandSiteUrl);
  }, [productDetail?.brandSiteUrl]);

  const noticeRows = useMemo((): Array<NoticeRow> => {
    const notice = productDetail?.productNotice;

    if (!notice) {
      return [];
    }
    return Object.entries(notice)
      .filter(([, value]) => !!value)
      .map(([key, value]) => ({ key, value: String(value) }));
  }, [productDetail?.productNotice]);

  /**
   * 상세정보 탭의 요약 표 — 고시 전체에서 **구매 판단에 바로 쓰이는 항목만** 앞에서 다섯 줄.
   *
   * 열두 항목을 여기에 다 펼치면 상세 이미지 아래에서 읽는 흐름이 끊긴다. 전체는 판매자 정보
   * 탭의 [상품 정보 제공 고시]가 맡는다.
   */
  const specRows = useMemo((): Array<NoticeRow> => noticeRows.slice(0, SPEC_ROW_COUNT), [noticeRows]);

  useEffect(() => {
    return () => {
      clearSelectedVariants(productId);
    };
  }, [clearSelectedVariants, productId]);

  const renderTabBody = () => {
    switch (selectedTab) {
      case "info":
        return (
          <View>
            <ProductDetailInfo
              description={productDetail?.description || ""}
              isExpand={isDescriptionExpanded}
              onPressExpand={() => setIsDescriptionExpanded(prev => !prev)}
            />
            <View className="px-14 pb-20 pt-16">
              <ProductNoticeTable rows={specRows} variant="spec" />
            </View>
            <BusinessFooter defaultExpanded />
          </View>
        );
      case "inquiry":
        return <ProductDetailInquiry productId={productId} />;
      case "seller":
        /*
          세 섹션을 모두 접어 두면 탭에 들어왔을 때 빈 목록처럼 보이므로 첫 항목만 펼쳐 둔다.
          순서는 **구매 판단에 쓰이는 순**이다 — 고시가 가장 자주 확인되고, 판매자 신원 확인은
          빈도가 낮아 맨 아래다.
        */
        return (
          <View>
            <CollapsibleSection title="상품 정보 제공 고시" defaultExpanded>
              <ProductNoticeTable rows={noticeRows} variant="notice" />
            </CollapsibleSection>

            <CollapsibleSection title="배송 / 교환 / 반품 안내" bodyStyle={{ paddingTop: 16 }}>
              <ProductDeliveryPolicy delivery={productDetail?.delivery} />
            </CollapsibleSection>

            <CollapsibleSection title="판매자 정보" bodyStyle={{ paddingTop: 6 }}>
              <ProductSellerInfo sellerInfo={productDetail?.sellerInfo} />
            </CollapsibleSection>

            <BusinessFooter defaultExpanded />
          </View>
        );
    }
  };

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader onPressBack={commonNavigation.goBack} renderRight={<HeaderActions />} />

      {isLoading || !productDetail ? (
        <View className="flex-1 items-center justify-center">
          <Spinner />
        </View>
      ) : (
        <ScrollView
          stickyHeaderIndices={[5]}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: bottom + BOTTOM_CTA_HEIGHT }}
        >
          <ProductGallery
            representativeImageUrl={productDetail.representativeImageUrl}
            coverImageUrls={productDetail.coverImageUrls}
          />
          <ProductDetailBrandSection
            marketName={productDetail.marketName}
            brandSiteUrl={productDetail.brandSiteUrl}
            onPressBrandSite={handlePressBrandSite}
          />
          <ProductPriceBlock
            name={productDetail.name}
            regularPrice={productDetail.regularPrice}
            discountRate={productDetail.discountRate}
            salePrice={productDetail.salePrice}
            isUnavailable={isUnavailable}
            belowPrice={
              productDetail.groupBuy ? (
                <ProductGroupBuyRow groupBuy={productDetail.groupBuy} onPressShowroom={handlePressShowroom} />
              ) : null
            }
          />
          <View className="mt-18 h-5 bg-band" />
          <ProductDeliveryBlock delivery={productDetail.delivery} />

          {/*
            상세정보 본문이 WebView라, 안드로이드에서는 네이티브 뷰 순서상 WebView가 이 줄 위로
            올라와 탭이 눌리지 않는다. zIndex(iOS)와 elevation(Android)으로 위에 고정한다.
          */}
          <View
            className="flex-row border-b-[0.5px] border-divider bg-white"
            style={{ zIndex: 2, elevation: 2 }}
          >
            {TABS.map(tab => {
              const isActive = tab.id === selectedTab;

              return (
                <TouchableOpacity
                  key={tab.id}
                  onPress={() => setSelectedTab(tab.id)}
                  activeOpacity={0.7}
                  className="h-46 flex-1 items-center justify-center"
                  style={isActive ? { borderBottomWidth: 2, borderBottomColor: "#0F0F0F" } : undefined}
                >
                  <Typography
                    style={{ fontSize: 14, fontWeight: isActive ? "600" : "400", lineHeight: 14 }}
                    className={isActive ? "text-ink" : "text-gray55"}
                  >
                    {tab.label}
                  </Typography>
                </TouchableOpacity>
              );
            })}
          </View>

          {renderTabBody()}
        </ScrollView>
      )}

      <View
        className="absolute bottom-0 left-0 right-0 border-t-[0.5px] border-divider bg-white px-14 pt-12"
        style={{ paddingBottom: bottom + 26 }}
      >
        <TouchableOpacity
          onPress={openProductOptionBottomSheet}
          disabled={isUnavailable}
          activeOpacity={0.8}
          className={`h-52 flex-row items-center justify-center rounded-base ${
            isUnavailable ? "bg-fill" : "bg-rose"
          }`}
        >
          <Typography variant="buttonPrimary" className={isUnavailable ? "text-gray62" : "text-white"}>
            {isUnavailable ? "판매가 종료된 상품이에요" : "구매하기"}
          </Typography>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/** 재고 품절이거나 운영자가 강제 품절로 내렸으면 살 수 없다 */
function isProductUnavailable(product: ProductDetail): boolean {
  return !!product.status?.isOutOfStock || !!product.status?.isOutOfStockForced;
}
