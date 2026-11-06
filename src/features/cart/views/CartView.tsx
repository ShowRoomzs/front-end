import { AxiosError } from "axios";
import { useCallback, useMemo, useState } from "react";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Checkbox from "@/common/components/Checkbox/Checkbox";
import { EmptyBagIcon } from "@/common/components/DsIcon/icons";
import EmptyState from "@/common/components/EmptyState/EmptyState";
import GroupBand from "@/common/components/GroupBand/GroupBand";
import ScreenHeader from "@/common/components/ScreenHeader/ScreenHeader";
import { SkeletonOverlay } from "@/common/components/Skeleton/Skeleton";
import Typography from "@/common/components/Typography/Typography";
import { useBottomSheet } from "@/common/hooks/useBottomSheet";
import { useBottomTab } from "@/common/hooks/useBottomTab";
import { SheetApi } from "@/common/providers/BottomSheetProvider/context";
import { useModal } from "@/common/providers/ModalProvider/context";
import { toast } from "@/common/providers/ToastProvider";
import { HOME_ROUTES, useCommonNavigation, useMainNavigation } from "@/common/router";
import { COMMON_ROUTES, ROOT_ROUTES } from "@/common/router/routes";
import { useUserStore } from "@/common/stores/useUserStore";
import { CustomErrorResponse } from "@/common/types/error";
import { formatPrice } from "@/common/utils/formatPrice";
import CartGroupSection from "@/features/cart/components/CartGroupSection/CartGroupSection";
import CartOptionBottomSheet from "@/features/cart/components/CartOptionBottomSheet/CartOptionBottomSheet";
import CartSkeleton from "@/features/cart/components/CartSkeleton/CartSkeleton";
import { useDeleteCartManyMutation } from "@/features/cart/hooks/useDeleteManyCartMutation";
import { useGetCart } from "@/features/cart/hooks/useGetCart";
import { useGetCartRecommendations } from "@/features/cart/hooks/useGetCartRecommendations";
import { useUpdateCartMutation } from "@/features/cart/hooks/useUpdateCartMutation";
import { CartItem } from "@/features/cart/types/cart";

/**
 * C8 장바구니.
 *
 * 공구 단위로 묶여 오고 배송비도 공구별로 계산된다. 하단 요약과 [주문하기]는 체크된 항목만
 * 합산하며, 버튼 라벨에 총 결제 금액과 선택 개수를 함께 넣어("62,200원 주문하기 (3)")
 * 위 요약을 다시 올려다보지 않아도 얼마를 결제하는지 확인된다.
 *
 * 선택 상태는 서버로 보낸다 — 무료배송 조건이 공구 단위라 클라이언트가 따로 계산하면 어긋난다.
 */
const OPTION_SHEET_ID = "cartOptionSheet";
/**
 * 하단 바가 실제로 그려지기 전에 쓸 **첫 추정값**.
 *
 * 예전에는 이 상수 하나로 본문 아래 여백을 잡았는데, 요약 줄이나 버튼이 바뀔 때마다 값이
 * 어긋나 마지막 줄이 바 아래로 숨었다(추천 상품 이름 두 번째 줄이 잘렸다).
 * 지금은 `onLayout`으로 **바를 직접 재서** 그 높이만큼 비운다 — 문구가 바뀌어도 따라간다.
 */
const BOTTOM_CTA_ESTIMATE = 190;

/** 마지막 줄이 바에 딱 붙지 않도록 두는 숨 */
const BOTTOM_CTA_GAP = 16;

export default function CartView() {
  const { bottom } = useSafeAreaInsets();
  const [ctaHeight, setCtaHeight] = useState(BOTTOM_CTA_ESTIMATE);
  const navigation = useCommonNavigation();
  const mainNavigation = useMainNavigation();
  const { navigate } = useBottomTab();
  const { show: showModal } = useModal();
  const { user } = useUserStore();

  /** null이면 "아직 손대지 않음" — 서버가 기본 선택(구매 가능한 전체)을 정한다 */
  const [selectedIds, setSelectedIds] = useState<Set<number> | null>(null);
  const [optionTarget, setOptionTarget] = useState<CartItem | null>(null);

  const selectedIdList = useMemo(() => (selectedIds ? Array.from(selectedIds) : undefined), [selectedIds]);

  const { data: cart, isLoading } = useGetCart(!!user, selectedIdList);
  const { data: recommendations } = useGetCartRecommendations(!!user);
  const { mutateAsync: updateCart } = useUpdateCartMutation();
  const { mutateAsync: deleteCartItems } = useDeleteCartManyMutation();

  const groups = useMemo(() => cart?.groups ?? [], [cart?.groups]);
  const allItems = useMemo(() => groups.flatMap(group => group.items), [groups]);
  const selectableIds = useMemo(
    () => allItems.filter(item => item.availability.isPurchasable).map(item => item.cartId),
    [allItems]
  );

  /** 손대기 전에는 서버가 내려준 isSelected가 곧 선택 상태다 */
  const effectiveSelectedIds = useMemo(
    () => selectedIds ?? new Set(allItems.filter(item => item.isSelected).map(item => item.cartId)),
    [allItems, selectedIds]
  );

  const selectedCount = effectiveSelectedIds.size;
  const isAllSelected = selectableIds.length > 0 && selectedCount === selectableIds.length;

  const applySelection = useCallback((next: Set<number>) => {
    setSelectedIds(next);
  }, []);

  const handleToggleSelect = useCallback(
    (cartId: number) => {
      const next = new Set(effectiveSelectedIds);

      if (next.has(cartId)) {
        next.delete(cartId);
      } else {
        next.add(cartId);
      }
      applySelection(next);
    },
    [applySelection, effectiveSelectedIds]
  );

  const handleToggleGroup = useCallback(
    (cartIds: Array<number>, nextSelected: boolean) => {
      const next = new Set(effectiveSelectedIds);

      cartIds.forEach(id => (nextSelected ? next.add(id) : next.delete(id)));
      applySelection(next);
    },
    [applySelection, effectiveSelectedIds]
  );

  // 전체 선택도 구매 불가 항목은 건너뛴다
  const handleToggleAll = useCallback(() => {
    applySelection(isAllSelected ? new Set() : new Set(selectableIds));
  }, [applySelection, isAllSelected, selectableIds]);

  const handleRemove = useCallback(
    async (cartIds: Array<number>, doneMessage?: string) => {
      try {
        await deleteCartItems({
          cartItemIds: cartIds,
          selectedCartItemIds: selectedIdList,
        });
        if (selectedIds) {
          const next = new Set(selectedIds);

          cartIds.forEach(id => next.delete(id));
          setSelectedIds(next);
        }
        if (doneMessage) {
          toast.show(doneMessage);
        }
      } catch (error) {
        toast.show(resolveErrorMessage(error, "삭제에 실패했습니다."));
      }
    },
    [deleteCartItems, selectedIdList, selectedIds]
  );

  /**
   * [선택 삭제]는 되돌릴 수 없고 여러 건을 한 번에 지우므로 한 단계 확인을 둔다.
   *
   * 항목 우측의 X는 무엇을 지우는지 손가락이 이미 가리키고 있어 확인 없이 바로 지운다 —
   * 같은 일에 확인을 두 형태로 두면 어느 쪽이 위험한 조작인지가 흐려진다.
   */
  const handlePressRemoveSelected = useCallback(() => {
    if (selectedCount === 0) {
      return;
    }
    showModal({
      title: "선택한 상품을 삭제할까요?",
      message: `${selectedCount}개 상품이 장바구니에서 빠집니다`,
      buttons: [
        { label: "취소", variant: "outline" },
        {
          label: "삭제하기",
          // 시안 C8: 여러 건을 한꺼번에 지웠을 때만 결과를 알린다(행의 X는 그 자리에서 사라지는 것으로 충분하다)
          onPress: () => handleRemove(Array.from(effectiveSelectedIds), "선택한 상품을 삭제했어요"),
        },
      ],
    });
  }, [effectiveSelectedIds, handleRemove, selectedCount, showModal]);

  const handleChangeQuantity = useCallback(
    async (cartId: number, quantity: number) => {
      const target = allItems.find(item => item.cartId === cartId);

      if (!target) {
        return;
      }
      try {
        await updateCart({
          cartId,
          data: { variantId: target.variantId, quantity },
          selectedCartItemIds: selectedIdList,
        });
      } catch (error) {
        toast.show(resolveErrorMessage(error, "수량 변경에 실패했습니다."));
      }
    },
    [allItems, selectedIdList, updateCart]
  );

  const handleConfirmOption = useCallback(
    async (cartId: number, newVariantId: number, newQuantity: number, sheetApi?: SheetApi) => {
      try {
        await updateCart({
          cartId,
          data: { variantId: newVariantId, quantity: newQuantity },
          selectedCartItemIds: selectedIdList,
        });
        toast.success("옵션을 변경했어요");
        sheetApi?.close();
      } catch (error) {
        toast.show(resolveErrorMessage(error, "옵션 변경에 실패했습니다."));
      }
    },
    [selectedIdList, updateCart]
  );

  const { open: openOptionSheet } = useBottomSheet({
    id: OPTION_SHEET_ID,
    render: optionTarget ? (
      <CartOptionBottomSheet
        cartId={optionTarget.cartId}
        productId={optionTarget.productId}
        groupBuyId={
          groups.find(group => group.items.some(item => item.cartId === optionTarget.cartId))?.groupBuyId ??
          null
        }
        variantId={optionTarget.variantId}
        quantity={optionTarget.quantity}
        onConfirm={handleConfirmOption}
      />
    ) : (
      <></>
    ),
  });

  const handlePressChangeOption = useCallback(
    (item: CartItem) => {
      setOptionTarget(item);
      openOptionSheet();
    },
    [openOptionSheet]
  );

  const handlePressBrowse = useCallback(() => {
    navigation.popToTop();
    navigate(HOME_ROUTES.HOME);
  }, [navigate, navigation]);

  const handlePressRecommendation = useCallback(
    async (productId: number) => {
      mainNavigation.navigate(ROOT_ROUTES.COMMON, {
        screen: COMMON_ROUTES.PRODUCT_DETAIL,
        params: { productId },
      });
    },
    [mainNavigation]
  );

  /**
   * 체크된 항목만 결제로 넘긴다.
   *
   * 구매 불가 항목은 이미 선택에서 빠져 있다(마감·품절이 섞이면 서버가 주문서 전체를 막는다 —
   * `CART_ITEM_NOT_PURCHASABLE`). 손대기 전의 기본 선택도 서버가 정한 것이라 같은 기준이다.
   */
  const handlePressOrder = useCallback(() => {
    const purchasable = new Set(selectableIds);
    const cartItemIds = Array.from(effectiveSelectedIds).filter(id => purchasable.has(id));

    if (cartItemIds.length === 0) {
      return;
    }
    navigation.navigate(COMMON_ROUTES.CHECKOUT, { cartItemIds });
  }, [effectiveSelectedIds, navigation, selectableIds]);

  const isEmpty = allItems.length === 0;
  const deliveryFeeTotal = cart?.summary.deliveryFeeTotal ?? 0;

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader title="장바구니" onPressBack={navigation.goBack} />

      {/* 받는 동안은 비운 채 위에 스켈레톤을 겹친다 — 받은 뒤 같은 부모 안에서 크로스페이드된다 */}
      <View className="flex-1">
        {/* 시안 C8: 전체 선택 줄은 목록과 함께 흘러가지 않고 머리말 아래에 머문다 */}
        {!isLoading && !isEmpty && (
          <View className="flex-row items-center justify-between border-b-[0.5px] border-divider px-14 py-12">
            <TouchableOpacity
              onPress={handleToggleAll}
              activeOpacity={0.55}
              className="flex-row items-center"
              style={{ gap: 9 }}
            >
              <Checkbox isChecked={isAllSelected} onChange={handleToggleAll} />
              <Typography
                style={{ fontSize: 13.5, fontWeight: "500", lineHeight: 18 }}
                className="text-ink76"
              >
                전체 선택 {selectedCount}/{selectableIds.length}
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handlePressRemoveSelected}
              disabled={selectedCount === 0}
              activeOpacity={0.55}
              style={{ paddingVertical: 8, marginVertical: -8 }}
            >
              <Typography
                style={{ fontSize: 12.5, fontWeight: "500", lineHeight: 18 }}
                className={selectedCount === 0 ? "text-gray8" : "text-ink76"}
              >
                선택 삭제
              </Typography>
            </TouchableOpacity>
          </View>
        )}

        {!isLoading && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: isEmpty ? 24 : ctaHeight + BOTTOM_CTA_GAP }}
          >
            {isEmpty ? (
              <EmptyState
                fill
                icon={<EmptyBagIcon size={52} />}
                title="장바구니가 비어 있어요"
                description={"진행 중인 공동구매를 둘러보고\n마음에 드는 상품을 담아보세요"}
                actionLabel="공동구매 둘러보기"
                onPressAction={handlePressBrowse}
              />
            ) : (
              <>
                {groups.map(group => (
                  <View key={group.groupBuyId ?? `market-${group.marketId}`}>
                    {/* 첫 그룹도 밴드로 연다 — 전체 선택 줄과 첫 그룹 머리가 한 덩어리로 붙어 보이지 않게 */}
                    <GroupBand height={5} />
                    <CartGroupSection
                      group={group}
                      selectedIds={effectiveSelectedIds}
                      onToggleSelect={handleToggleSelect}
                      onToggleGroup={handleToggleGroup}
                      onChangeQuantity={handleChangeQuantity}
                      onPressChangeOption={handlePressChangeOption}
                      onPressRemove={cartId => handleRemove([cartId])}
                    />
                  </View>
                ))}
              </>
            )}

            {/* 시안 C8: 담긴 상품이 있을 때만 — 빈 장바구니는 [공동구매 둘러보기] 하나로 길을 낸다 */}
            {!isEmpty && !!recommendations?.products.length && (
              <>
                <GroupBand height={5} />
                <Typography
                  style={{
                    fontSize: 15,
                    fontWeight: "700",
                    lineHeight: 15,
                    letterSpacing: -0.2,
                    paddingHorizontal: 14,
                    paddingTop: 18,
                    paddingBottom: 12,
                  }}
                  className="text-ink"
                >
                  팔로우한 쇼룸의 공구
                </Typography>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 14, paddingBottom: 20, gap: 10 }}
                >
                  {recommendations.products.map(product => (
                    <TouchableOpacity
                      key={product.productId}
                      onPress={() => handlePressRecommendation(product.productId)}
                      activeOpacity={0.55}
                      style={{ width: 130 }}
                    >
                      <Image
                        source={{ uri: product.thumbnailUrl }}
                        style={{ width: 130, height: 130, borderRadius: 4 }}
                        resizeMode="cover"
                      />
                      <Typography
                        style={{ fontSize: 11.5, lineHeight: 14.95, marginTop: 8 }}
                        className="text-gray45"
                        numberOfLines={1}
                      >
                        {product.marketName}
                      </Typography>
                      <Typography
                        style={{
                          fontSize: 12.5,
                          lineHeight: 17.5,
                          marginTop: 3,
                          minHeight: 35,
                          paddingRight: 4,
                        }}
                        className="text-ink80"
                        numberOfLines={2}
                      >
                        {product.productName}
                      </Typography>
                      <View className="mt-5 flex-row items-baseline" style={{ gap: 5 }}>
                        {product.price.discountRate > 0 && (
                          <Typography
                            style={{ fontSize: 13.5, fontWeight: "700", lineHeight: 13.5 }}
                            className="text-rose"
                          >
                            {product.price.discountRate}%
                          </Typography>
                        )}
                        <Typography
                          style={{ fontSize: 13.5, fontWeight: "700", lineHeight: 13.5, letterSpacing: -0.2 }}
                          className="text-ink"
                        >
                          {formatPrice(product.price.salePrice)}원
                        </Typography>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            )}
          </ScrollView>
        )}

        <SkeletonOverlay visible={isLoading}>
          <CartSkeleton />
        </SkeletonOverlay>
      </View>

      {!isLoading && !isEmpty && (
        <View
          className="absolute bottom-0 left-0 right-0 border-t-[0.5px] border-divider bg-white px-14 pt-12"
          style={{ paddingBottom: bottom + 26 }}
          onLayout={event => setCtaHeight(event.nativeEvent.layout.height)}
        >
          <SummaryRow label="상품 금액" value={`${formatPrice(cart?.summary.saleTotal ?? 0)}원`} />
          <SummaryRow
            label="배송비"
            // 시안 C8: 낼 배송비가 없으면 0원이 아니라 「무료배송」
            value={deliveryFeeTotal === 0 ? "무료배송" : `${formatPrice(deliveryFeeTotal)}원`}
            className="mt-5"
          />
          <View className="mt-11 flex-row items-baseline justify-between border-t-[0.5px] border-divider pt-11">
            <Typography style={{ fontSize: 13.5, fontWeight: "600", lineHeight: 13.5 }} className="text-ink">
              총 결제 금액
            </Typography>
            <Typography
              style={{ fontSize: 21, fontWeight: "700", lineHeight: 21, letterSpacing: -0.6 }}
              className="text-ink"
            >
              {formatPrice(cart?.summary.finalTotal ?? 0)}원
            </Typography>
          </View>

          <TouchableOpacity
            onPress={handlePressOrder}
            disabled={selectedCount === 0}
            activeOpacity={0.75}
            className={`mt-14 h-52 flex-row items-center justify-center rounded-base ${
              selectedCount === 0 ? "bg-fill" : "bg-rose"
            }`}
          >
            <Typography variant="buttonPrimary" className={selectedCount === 0 ? "text-gray8" : "text-white"}>
              {selectedCount === 0
                ? "주문하기"
                : `${formatPrice(cart?.summary.finalTotal ?? 0)}원 주문하기 (${selectedCount})`}
            </Typography>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

function SummaryRow(props: { label: string; value: string; className?: string }) {
  return (
    <View className={`flex-row items-baseline justify-between ${props.className ?? ""}`}>
      <Typography style={{ fontSize: 13, lineHeight: 19.5 }} className="text-gray45">
        {props.label}
      </Typography>
      <Typography style={{ fontSize: 13, lineHeight: 19.5 }} className="text-ink76">
        {props.value}
      </Typography>
    </View>
  );
}

function resolveErrorMessage(error: unknown, fallback: string): string {
  const axiosError = error as AxiosError<CustomErrorResponse<string, { message?: string }>>;

  return axiosError.response?.data?.message || fallback;
}
