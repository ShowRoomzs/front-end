import { AxiosError } from "axios";
import { useCallback, useMemo, useState } from "react";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Checkbox from "@/common/components/Checkbox/Checkbox";
import { EmptyBagIcon } from "@/common/components/DsIcon/icons";
import EmptyState from "@/common/components/EmptyState/EmptyState";
import GroupBand from "@/common/components/GroupBand/GroupBand";
import ScreenHeader from "@/common/components/ScreenHeader/ScreenHeader";
import SectionLabel from "@/common/components/SectionLabel/SectionLabel";
import Spinner from "@/common/components/Spinner/Spinner";
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
/** 요약 3줄 + 버튼 52 + 상하 여백 — 본문이 이 아래로 숨지 않게 같은 값을 비운다 */
const BOTTOM_CTA_HEIGHT = 146;

export default function CartView() {
  const { bottom } = useSafeAreaInsets();
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
    async (cartIds: Array<number>) => {
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
        { label: "삭제하기", onPress: () => handleRemove(Array.from(effectiveSelectedIds)) },
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
        toast.show("옵션이 변경되었습니다.");
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

  /** 주문·결제 API가 아직 없어 여기서 동선이 끊긴다 */
  const handlePressOrder = useCallback(() => {
    toast.show("주문·결제 기능을 준비하고 있어요. 열리면 알려드릴게요.");
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 bg-white">
        <ScreenHeader title="장바구니" onPressBack={navigation.goBack} />
        <View className="flex-1 items-center justify-center">
          <Spinner />
        </View>
      </View>
    );
  }

  const isEmpty = allItems.length === 0;

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader title="장바구니" onPressBack={navigation.goBack} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: isEmpty ? 24 : bottom + BOTTOM_CTA_HEIGHT }}
      >
        {isEmpty ? (
          <EmptyState
            icon={<EmptyBagIcon size={52} />}
            title="장바구니가 비어 있어요"
            description={"진행 중인 공동구매를 둘러보고\n마음에 드는 상품을 담아보세요"}
            paddingTop={110}
            actionLabel="공동구매 둘러보기"
            onPressAction={handlePressBrowse}
          />
        ) : (
          <>
            <View className="flex-row items-center justify-between border-b-[0.5px] border-divider px-14 py-12">
              <TouchableOpacity
                onPress={handleToggleAll}
                activeOpacity={0.6}
                className="flex-row items-center"
                style={{ gap: 8 }}
              >
                <Checkbox isChecked={isAllSelected} onChange={handleToggleAll} />
                <Typography style={{ fontSize: 13, fontWeight: "500", lineHeight: 18 }} className="text-ink">
                  전체 선택 {selectedCount}/{selectableIds.length}
                </Typography>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handlePressRemoveSelected}
                disabled={selectedCount === 0}
                activeOpacity={0.6}
                style={{ paddingVertical: 8, marginVertical: -8 }}
              >
                <Typography
                  style={{ fontSize: 12.5, fontWeight: "600", lineHeight: 18 }}
                  className={selectedCount === 0 ? "text-gray62" : "text-gray45"}
                >
                  선택 삭제
                </Typography>
              </TouchableOpacity>
            </View>

            {groups.map((group, ix) => (
              <View key={group.marketId}>
                {ix > 0 && <GroupBand height={5} />}
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

        {!!recommendations?.products.length && (
          <>
            <GroupBand height={8} />
            <SectionLabel label="팔로우한 쇼룸의 공구" className="pb-4 pt-18" />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 14, paddingVertical: 10, gap: 12 }}
            >
              {recommendations.products.map(product => (
                <TouchableOpacity
                  key={product.productId}
                  onPress={() => handlePressRecommendation(product.productId)}
                  activeOpacity={0.8}
                  style={{ width: 116 }}
                >
                  <Image
                    source={{ uri: product.thumbnailUrl }}
                    style={{ width: 116, height: 116, borderRadius: 4 }}
                    resizeMode="cover"
                  />
                  <Typography variant="caption" className="mt-8 text-gray45" numberOfLines={1}>
                    {product.marketName}
                  </Typography>
                  <Typography variant="productName" className="text-ink80" numberOfLines={2}>
                    {product.productName}
                  </Typography>
                  <View className="mt-4 flex-row items-baseline" style={{ gap: 6 }}>
                    {product.price.discountRate > 0 && (
                      <Typography
                        style={{ fontSize: 13, fontWeight: "700", lineHeight: 13 }}
                        className="text-rose"
                      >
                        {product.price.discountRate}%
                      </Typography>
                    )}
                    <Typography
                      style={{ fontSize: 13, fontWeight: "700", lineHeight: 13 }}
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

      {!isEmpty && (
        <View
          className="absolute bottom-0 left-0 right-0 border-t-[0.5px] border-divider bg-white px-14 pt-12"
          style={{ paddingBottom: bottom + 26 }}
        >
          <SummaryRow label="상품 금액" value={`${formatPrice(cart?.summary.saleTotal ?? 0)}원`} />
          <SummaryRow label="배송비" value={`${formatPrice(cart?.summary.deliveryFeeTotal ?? 0)}원`} />
          <View className="mt-8 flex-row items-center justify-between border-t-[0.5px] border-dividerProduct pt-10">
            <Typography style={{ fontSize: 13.5, fontWeight: "600", lineHeight: 18 }} className="text-ink">
              총 결제 금액
            </Typography>
            <Typography style={{ fontSize: 17, fontWeight: "700", lineHeight: 20 }} className="text-ink">
              {formatPrice(cart?.summary.finalTotal ?? 0)}원
            </Typography>
          </View>

          <TouchableOpacity
            onPress={handlePressOrder}
            disabled={selectedCount === 0}
            activeOpacity={0.8}
            className={`mt-12 h-52 flex-row items-center justify-center rounded-base ${
              selectedCount === 0 ? "bg-fill" : "bg-rose"
            }`}
          >
            <Typography
              variant="buttonPrimary"
              className={selectedCount === 0 ? "text-gray62" : "text-white"}
            >
              {selectedCount === 0
                ? "주문할 상품을 선택해 주세요"
                : `${formatPrice(cart?.summary.finalTotal ?? 0)}원 주문하기 (${selectedCount})`}
            </Typography>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

function SummaryRow(props: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between py-3">
      <Typography style={{ fontSize: 12.5, lineHeight: 18 }} className="text-gray45">
        {props.label}
      </Typography>
      <Typography style={{ fontSize: 12.5, fontWeight: "500", lineHeight: 18 }} className="text-ink76">
        {props.value}
      </Typography>
    </View>
  );
}

function resolveErrorMessage(error: unknown, fallback: string): string {
  const axiosError = error as AxiosError<CustomErrorResponse<string, { message?: string }>>;

  return axiosError.response?.data?.message || fallback;
}
