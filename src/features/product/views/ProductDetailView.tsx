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
import ProductBundleSection from "@/features/product/components/ProductBundleSection/ProductBundleSection";
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
import PurchaseBlockedModal from "@/features/product/components/PurchaseBlockedModal/PurchaseBlockedModal";
import { PRODUCT_OPTION_BOTTOM_SHEET_PROPS } from "@/features/product/constants/optionBottomSheet";
import { useGetProductDetail } from "@/features/product/hooks/useGetProductDetail";
// ⚠️ 임시 — 공구가 목업이라 묶음 상품도 서버가 알 길이 없다
import { buildBundleMock } from "@/features/product/mocks/productMock";
import { useProductVariantSelection } from "@/features/product/stores/useProductVariantSelection";
import { ProductSaleState, resolveSaleState, saleStateMessage } from "@/features/product/utils/saleState";

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

  const { data: productDetail, isLoading, refetch: refetchProductDetail } = useGetProductDetail(productId);
  const { create: createCart } = useCart();
  const { clearSelectedVariants, selectedVariantsByProductId } = useProductVariantSelection();

  const mainNavigation = useMainNavigation();
  const commonNavigation = useCommonNavigation();

  const [selectedTab, setSelectedTab] = useState<ProductTabId>("info");
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  /** 판매중 / 공구 마감 / 품절 — 갤러리 딤·배지·하단 CTA·차단 모달이 모두 이 값에서 갈린다 */
  const saleState = productDetail ? resolveSaleState(productDetail) : "ON_SALE";
  const isUnavailable = saleState !== "ON_SALE";

  /** 결제 직전 차단 — 판정은 서버가 하고, 화면은 결과만 띄운다 */
  const [blockedBy, setBlockedBy] = useState<Exclude<ProductSaleState, "ON_SALE"> | null>(null);
  const [blockedOptionLabel, setBlockedOptionLabel] = useState<string>("");

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

  /**
   * [바로 구매] — 누른 시점에 **상품을 다시 읽어** 아직 살 수 있는지 확인한다.
   *
   * 상세는 5분 동안 캐시되므로 화면을 열어 둔 사이에 공구가 마감되거나 마지막 수량이 팔릴 수
   * 있다. 그 상태로 결제로 넘기면 "결제는 됐는데 주문은 없는" 구간이 생긴다. 판정은 서버가
   * 내려준 값으로만 하고(클라이언트 재고 캐시로 미리 막지 않는다), 막힌 이유를 모달로 알린다.
   *
   * 주문·결제 API가 아직 없어, 통과한 경우는 안내 토스트까지만 이어진다.
   */
  const handlePressBottomSheetBuy = usePermissionPress(async () => {
    const variants = selectedVariantsByProductId[productId] ?? [];
    const { data: latest } = await refetchProductDetail();
    const latestState = latest ? resolveSaleState(latest) : saleState;

    if (latestState !== "ON_SALE") {
      // 무엇이 사라졌는지 되짚어 주려면 방금 고른 조합의 이름이 필요하다
      setBlockedOptionLabel(variants.at(-1)?.name ?? "");
      setBlockedBy(latestState);
      return;
    }

    toast.show("주문·결제 기능을 준비하고 있어요. 장바구니에 담아 두시면 열릴 때 알려드릴게요.");
  });

  const { open: openProductOptionBottomSheet } = useBottomSheet({
    id: "product-option",
    render: (
      <ProductOptionBottomSheet
        productId={productId}
        productName={productDetail?.name ?? ""}
        optionGroups={productDetail?.optionGroups || []}
        variants={productDetail?.variants || []}
        onPressCart={handlePressBottomSheetCart}
        onPressBuy={handlePressBottomSheetBuy}
      />
    ),
    sheetProps: PRODUCT_OPTION_BOTTOM_SHEET_PROPS,
  });

  /**
   * 시트를 닫으면 고른 것은 사라진다(시안 C7 `closeOptions`) — 열 때 비워 같은 결과를 만든다.
   *
   * 닫힐 때 지우지 않는 이유는 [장바구니]가 시트를 먼저 닫고 그 목록으로 담기 때문이다 —
   * 닫는 순간 비우면 담기서 읽을 것이 사라진다.
   */
  const handleOpenOptionSheet = useCallback(() => {
    clearSelectedVariants(productId);
    openProductOptionBottomSheet();
  }, [clearSelectedVariants, openProductOptionBottomSheet, productId]);

  const handlePressShowroom = useCallback(
    (showroomId: number) => {
      mainNavigation.navigate(ROOT_ROUTES.COMMON, {
        screen: COMMON_ROUTES.SHOWROOM_DETAIL,
        params: { showroomId },
      });
    },
    [mainNavigation]
  );

  /**
   * 판매가 끝난 화면의 유일한 다음 행동.
   *
   * 여기서 바로 팔로우 API를 부르지 않고 쇼룸으로 보내는 이유는, 팔로우가 "이 쇼룸을 계속
   * 보겠다"는 결정이라 무엇을 파는 곳인지 확인할 자리가 함께 있어야 하기 때문이다.
   */
  const handlePressFollowShowroom = useCallback(() => {
    const showroomId = productDetail?.groupBuy?.showroomId;

    if (showroomId === undefined) {
      return;
    }
    handlePressShowroom(showroomId);
  }, [handlePressShowroom, productDetail]);

  const handlePressBrandSite = useCallback(() => {
    if (!productDetail?.brandSiteUrl) {
      return;
    }
    void Linking.openURL(productDetail.brandSiteUrl);
  }, [productDetail?.brandSiteUrl]);

  /**
   * 같은 공구의 다른 상품.
   *
   * ⚠️ 서버 미제공 — 상세는 이 상품이 어느 공구에 묶여 있는지를 알려주지 않는다.
   * 공구 자체가 목업이라 묶음도 목업으로 둔다 — `groupBuy`가 없으면 섹션 자체를 그리지 않는다.
   */
  const bundleProducts = useMemo(
    () => (productDetail?.groupBuy ? buildBundleMock(productId) : []),
    [productDetail?.groupBuy, productId]
  );

  const handlePressBundleProduct = useCallback(
    (targetProductId: number) => {
      commonNavigation.push(COMMON_ROUTES.PRODUCT_DETAIL, { productId: targetProductId });
    },
    [commonNavigation]
  );

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
              beforeExpandButton={
                <View className="px-14 pt-16">
                  <ProductNoticeTable rows={specRows} variant="spec" />
                </View>
              }
            />

            <View className="h-5 bg-band" />

            <ProductBundleSection
              products={bundleProducts}
              showroomImageUrl={productDetail?.groupBuy?.showroomImageUrl}
              onPressProduct={handlePressBundleProduct}
            />

            <View className="h-30" />

            <BusinessFooter defaultExpanded />
          </View>
        );
      case "inquiry":
        return <ProductDetailInquiry productId={productId} sellerName={productDetail?.marketName ?? ""} />;
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

            <CollapsibleSection
              title="배송 / 교환 / 반품 안내"
              bodyStyle={{ paddingTop: 16, paddingBottom: 16 }}
            >
              <ProductDeliveryPolicy delivery={productDetail?.delivery} />
            </CollapsibleSection>

            <CollapsibleSection title="판매자 정보" bodyStyle={{ paddingTop: 6 }}>
              <ProductSellerInfo sellerInfo={productDetail?.sellerInfo} />
            </CollapsibleSection>

            {/*
              사업자 푸터는 이 탭에 두지 않는다(시안 C7) — 바로 위의 [판매자 정보]와
              항목이 거의 같아서, 둘을 거듭 놓으면 어느 쪽이 이 상품을 파는 사람인지 헷갈린다.
              고지는 상세정보 탭 맨 아래에서 한 번 닿는다.
            */}
            <View className="h-26" />
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
          stickyHeaderIndices={[6]}
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
                <ProductGroupBuyRow
                  groupBuy={productDetail.groupBuy}
                  saleState={saleState}
                  onPressShowroom={handlePressShowroom}
                />
              ) : null
            }
          />
          <View className="mt-18 h-5 bg-band" />
          <ProductDeliveryBlock delivery={productDetail.delivery} />
          {/* 배송 블록과 탭 사이에도 밴드가 들어간다 — 상품 정보와 탭은 읽는 단위가 다르다(시안 C7) */}
          <View className="h-5 bg-band" />

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
        {isUnavailable ? (
          /*
            살 수 없다고 화면을 막고 끝내지 않는다 — 이 공구는 끝났어도 같은 쇼룸의 다음 공구가
            남아 있고, 그때 알림을 받을 유일한 방법이 팔로우다(시안 C7 판매 종료).
          */
          <View style={{ gap: 9 }}>
            <View className="h-38 flex-row items-center justify-center">
              <Typography
                style={{ fontSize: 12.5, fontWeight: "500", lineHeight: 12.5 }}
                className="text-gray45"
              >
                {saleStateMessage(saleState)}
              </Typography>
            </View>
            <TouchableOpacity
              onPress={handlePressFollowShowroom}
              activeOpacity={0.75}
              className="h-52 flex-row items-center justify-center rounded-base bg-rose"
              style={{ gap: 7 }}
            >
              <Typography variant="buttonPrimary" className="text-white">
                쇼룸 팔로우하고 다음 공구 받기
              </Typography>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={handleOpenOptionSheet}
            activeOpacity={0.8}
            className="h-52 flex-row items-center justify-center rounded-base bg-rose"
          >
            <Typography variant="buttonPrimary" className="text-white">
              구매하기
            </Typography>
          </TouchableOpacity>
        )}
      </View>

      <PurchaseBlockedModal
        blockedBy={blockedBy}
        optionLabel={blockedOptionLabel}
        onClose={() => setBlockedBy(null)}
        onPickAnotherOption={() => {
          setBlockedBy(null);
          clearSelectedVariants(productId);
          openProductOptionBottomSheet();
        }}
      />
    </View>
  );
}
