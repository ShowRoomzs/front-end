import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useCallback, useMemo, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Typography from "@/common/components/Typography/Typography";
import { SheetApi } from "@/common/providers/BottomSheetProvider/context";
import { formatPrice } from "@/common/utils/formatPrice";
import {
  OPTION_SHEET_ITEM_GAP,
  PRODUCT_OPTION_BOTTOM_SHEET_PADDING,
} from "@/features/product/components/ProductOptionBottomSheet/config";
import ProductOptionDropdown from "@/features/product/components/ProductOptionDropdown/ProductOptionDropdown";
import { PRODUCT_OPTION_BOTTOM_SHEET_MAX_HEIGHT } from "@/features/product/constants/optionBottomSheet";
import { useGetProductDetail } from "@/features/product/hooks/useGetProductDetail";
import { useOptionSelection } from "@/features/product/hooks/useOptionSelection";
import { ProductDetail } from "@/features/product/types/product";
import { getEnabledVariants } from "@/features/product/utils/option";

interface CartOptionBottomSheetProps {
  sheetApi?: SheetApi;
  cartId: number;
  productId: number;
  /** 담긴 공구 — 옵션 가격·재고를 그 공구 계약으로 읽는다 */
  groupBuyId: number | null;
  variantId: number;
  quantity: number;
  onConfirm: (cartId: number, newVariantId: number, newQuantity: number, sheetApi?: SheetApi) => void;
}

/**
 * C8 옵션 변경 시트.
 *
 * 상품 상세의 옵션 시트(여러 조합을 담는 시트)와 달리 **담긴 한 줄의 조합 하나를 바꾸는** 시트다.
 * 지금 조합이 처음부터 채워져 있고, 그룹을 다시 열면 그 그룹과 아래 그룹이 비워져
 * [변경하기]가 잠긴다 — 끝까지 다시 골라야 켜진다. 수량은 그대로 둔다(수량은 장바구니 행의 스테퍼).
 */
export default function CartOptionBottomSheet(props: CartOptionBottomSheetProps) {
  const { productId, groupBuyId } = props;
  const { data: productDetail } = useGetProductDetail(productId, groupBuyId ?? undefined);

  if (!productDetail) {
    return null;
  }

  // 상품을 받은 뒤에 마운트해야 지금 조합이 초기 선택으로 들어간다
  return <CartOptionSheetBody {...props} productDetail={productDetail} />;
}

function CartOptionSheetBody(props: CartOptionBottomSheetProps & { productDetail: ProductDetail }) {
  const { cartId, productId, groupBuyId, variantId, quantity, sheetApi, onConfirm, productDetail } = props;
  const { bottom } = useSafeAreaInsets();
  const [footerHeight, setFooterHeight] = useState(0);
  const { optionGroups, variants } = productDetail;

  const initialSelectedOptions = useMemo(() => {
    const current = variants.find(variant => variant.variantId === variantId);
    const options: Record<number, number> = {};

    if (!current) {
      return options;
    }
    optionGroups.forEach(group => {
      const matched = group.options.find(option => current.optionIds.includes(option.optionId));

      if (matched) {
        options[group.optionGroupId] = matched.optionId;
      }
    });

    return options;
  }, [optionGroups, variantId, variants]);

  const { selectedOptions, openGroupId, handleToggleGroup, handleChangeOption } = useOptionSelection({
    optionGroups,
    initialSelectedOptions,
    keepFinalPick: true,
  });

  const isAllPicked = optionGroups.every(group => selectedOptions[group.optionGroupId] !== undefined);
  const pickedVariant = isAllPicked ? getEnabledVariants(variants, selectedOptions)[0] : undefined;
  const canSave = !!pickedVariant;

  // 시안: 고른 옵션 이름을 「 · 」로 잇고, 오른쪽에 그 조합의 단가
  const pickedLabel = optionGroups
    .map(
      group => group.options.find(option => option.optionId === selectedOptions[group.optionGroupId])?.name
    )
    .filter(Boolean)
    .join(" · ");

  const handleChangeOptionInternal = useCallback(
    (optionGroupId: number, optionId: number) => {
      handleChangeOption(optionGroupId, optionId);
    },
    [handleChangeOption]
  );

  const handlePressCancel = useCallback(() => {
    sheetApi?.close();
  }, [sheetApi]);

  const handlePressSave = useCallback(() => {
    if (!pickedVariant) {
      return;
    }
    // 같은 조합 그대로면 바꿀 것이 없다
    if (pickedVariant.variantId === variantId) {
      sheetApi?.close();
      return;
    }
    onConfirm(cartId, pickedVariant.variantId, quantity, sheetApi);
  }, [cartId, onConfirm, pickedVariant, quantity, sheetApi, variantId]);

  return (
    <View style={{ maxHeight: PRODUCT_OPTION_BOTTOM_SHEET_MAX_HEIGHT }}>
      <BottomSheetScrollView contentContainerStyle={{ paddingBottom: 12 + footerHeight }}>
        <Typography
          style={{ fontSize: 15, fontWeight: "600", lineHeight: 21, paddingHorizontal: 20, paddingBottom: 6 }}
          className="text-center text-ink"
        >
          옵션 변경
        </Typography>
        <Typography
          numberOfLines={1}
          style={{ fontSize: 12.5, lineHeight: 18.75, paddingHorizontal: 20, paddingBottom: 14 }}
          className="text-center text-gray45"
        >
          {productDetail.name}
        </Typography>

        <View style={{ paddingHorizontal: 20, gap: OPTION_SHEET_ITEM_GAP }}>
          {optionGroups.map((optionGroup, ix) => (
            <ProductOptionDropdown
              key={optionGroup.optionGroupId}
              optionGroup={optionGroup}
              index={ix}
              optionGroups={optionGroups}
              variants={variants}
              selectedOptions={selectedOptions}
              openGroupId={openGroupId}
              onToggleGroup={handleToggleGroup}
              onChangeOption={handleChangeOptionInternal}
              productId={productId}
              groupBuyId={groupBuyId}
            />
          ))}

          {!!pickedVariant && (
            <View
              className="flex-row items-center justify-between rounded-base bg-band"
              style={{ padding: 13, gap: 12 }}
            >
              <Typography
                style={{ fontSize: 13, fontWeight: "500", lineHeight: 18.85 }}
                className="min-w-0 flex-1 text-ink76"
              >
                {pickedLabel || pickedVariant.name}
              </Typography>
              <Typography
                style={{ fontSize: 15, fontWeight: "600", lineHeight: 15, letterSpacing: -0.3 }}
                className="text-ink"
              >
                {`${formatPrice(pickedVariant.salePrice)}원`}
              </Typography>
            </View>
          )}
        </View>
      </BottomSheetScrollView>

      <View
        onLayout={e => setFooterHeight(e.nativeEvent.layout.height)}
        className="absolute bottom-0 left-0 right-0 flex-row border-t-[0.5px] border-divider bg-white px-20 pt-14"
        style={{ gap: 8, paddingBottom: bottom + PRODUCT_OPTION_BOTTOM_SHEET_PADDING }}
      >
        <TouchableOpacity
          onPress={handlePressCancel}
          activeOpacity={0.55}
          className="h-52 flex-1 flex-row items-center justify-center rounded-base border border-borderButtonStrong bg-white"
        >
          <Typography style={{ fontSize: 15, fontWeight: "600", lineHeight: 15 }} className="text-ink76">
            취소
          </Typography>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handlePressSave}
          disabled={!canSave}
          activeOpacity={canSave ? 0.75 : 1}
          className={`h-52 flex-1 flex-row items-center justify-center rounded-base ${canSave ? "bg-rose" : "bg-fill"}`}
        >
          <Typography
            style={{ fontSize: 15, fontWeight: "600", lineHeight: 15 }}
            className={canSave ? "text-white" : "text-gray8"}
          >
            변경하기
          </Typography>
        </TouchableOpacity>
      </View>
    </View>
  );
}
