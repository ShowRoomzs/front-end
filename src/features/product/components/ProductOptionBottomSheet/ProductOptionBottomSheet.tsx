import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { produce } from "immer";
import { useCallback, useEffect, useMemo, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Typography from "@/common/components/Typography/Typography";
import { SheetApi } from "@/common/providers/BottomSheetProvider/context";
import {
  BOTTOM_SHEET_GAP,
  OPTION_SHEET_ITEM_GAP,
  PRODUCT_OPTION_BOTTOM_SHEET_PADDING,
} from "@/features/product/components/ProductOptionBottomSheet/config";
import ProductOptionDropdown from "@/features/product/components/ProductOptionDropdown/ProductOptionDropdown";
import VariantCard from "@/features/product/components/VariantCard/VariantCard";
import { PRODUCT_OPTION_BOTTOM_SHEET_MAX_HEIGHT } from "@/features/product/constants/optionBottomSheet";
import { useOptionSelection } from "@/features/product/hooks/useOptionSelection";
import { useProductVariantSelection } from "@/features/product/stores/useProductVariantSelection";
import { OptionGroup, Variant } from "@/features/product/types/product";
import { getEnabledVariants } from "@/features/product/utils/option";

interface ProductOptionBottomSheetProps {
  sheetApi?: SheetApi;
  productId: number;
  /** 옵션이 없는 상품의 유일한 줄에 적는 이름 — 그 상품은 고를 것이 없어 조합명이 없다 */
  productName: string;
  optionGroups: Array<OptionGroup>;
  variants: Array<Variant>;
  onPressCart: (sheetApi?: SheetApi) => void;
  onPressBuy: () => void;
}

export default function ProductOptionBottomSheet(props: ProductOptionBottomSheetProps) {
  const { productId, productName, optionGroups, variants, sheetApi, onPressCart, onPressBuy } = props;
  const { bottom } = useSafeAreaInsets();
  const { selectedVariantsByProductId, setSelectedVariants } = useProductVariantSelection();
  const { selectedOptions, openGroupId, handleToggleGroup, handleChangeOption } = useOptionSelection({
    optionGroups,
  });
  const [footerHeight, setFooterHeight] = useState(0);

  const selectedVariants = useMemo(
    () => selectedVariantsByProductId[productId] || [],
    [selectedVariantsByProductId, productId]
  );

  const hasOptionGroups = optionGroups.length > 0;

  /**
   * 옵션이 없는 상품 — 드롭다운을 하나도 그리지 않고 **상품명 + 수량 스테퍼만** 띄운다.
   *
   * 고를 것이 없는데 "옵션을 선택하세요" 칸을 하나 세우면 무엇을 해야 하는지 잠시 멈추게 된다.
   * 열자마자 담을 수 있어야 하므로 대표 조합을 미리 한 줄 올려 둔다 — 그러면 두 버튼도 바로 활성이다.
   */
  useEffect(() => {
    if (hasOptionGroups || selectedVariants.length > 0) {
      return;
    }

    const onlyVariant = variants.find(variant => variant.isRepresentative) ?? variants[0];

    if (!onlyVariant) {
      return;
    }
    setSelectedVariants(productId, [{ ...onlyVariant, name: productName, count: 1 }]);
  }, [hasOptionGroups, selectedVariants.length, variants, productId, productName, setSelectedVariants]);

  const handleChangeOptionInternal = useCallback(
    (optionGroupId: number, optionId: number) => {
      const newSelectOptions = handleChangeOption(optionGroupId, optionId);

      // 모든 option이 선택된 경우 > selectedVariants 배열에 담음
      if (Object.keys(newSelectOptions).length === optionGroups.length) {
        const targetVariant = getEnabledVariants(variants, newSelectOptions)[0];

        const newVariants = produce(selectedVariants, draft => {
          const exist = draft.find(v => v.variantId === targetVariant.variantId);

          // 이미 존재하는 조합이라면 개수 증가
          if (exist) {
            exist.count += 1;
            return;
          }

          // 존재하지 않는 조합이라면 배열에 추가
          return [...draft, { ...targetVariant, count: 1 }];
        });

        setSelectedVariants(productId, newVariants);
      }
    },
    [productId, optionGroups, selectedVariants, setSelectedVariants, variants, handleChangeOption]
  );

  const handleChangeVariantCount = useCallback(
    (variantId: number, count: number) => {
      const newVariants = selectedVariants.map(variant =>
        variant.variantId === variantId ? { ...variant, count } : variant
      );

      setSelectedVariants(productId, newVariants);
    },
    [productId, selectedVariants, setSelectedVariants]
  );

  const handleRemoveVariant = useCallback(
    (variantId: number) => {
      const newVariants = selectedVariants.filter(variant => variant.variantId !== variantId);

      setSelectedVariants(productId, newVariants);
    },
    [productId, selectedVariants, setSelectedVariants]
  );

  const totalPrice = useMemo(
    () => selectedVariants.reduce((sum, variant) => sum + variant.salePrice * variant.count, 0),
    [selectedVariants]
  );

  const hasSelectedVariants = useMemo(() => selectedVariants.length > 0, [selectedVariants]);

  /**
   * 미선택이면 **버튼 자체가 비활성**이다(시안 C7).
   *
   * 눌렀을 때 토스트로 알리던 방식은 "누를 수 있는데 거절당했다"로 읽힌다. 시안은 고를 것이
   * 남아 있는 동안 두 버튼을 회색으로 잠가, 아직 할 일이 위에 있다는 걸 버튼 모양으로 말한다.
   */
  const handlePressCart = useCallback(() => {
    sheetApi?.close();
    onPressCart(sheetApi);
  }, [onPressCart, sheetApi]);

  const handlePressBuy = useCallback(() => {
    sheetApi?.close();
    onPressBuy();
  }, [onPressBuy, sheetApi]);

  return (
    <View style={{ maxHeight: PRODUCT_OPTION_BOTTOM_SHEET_MAX_HEIGHT }}>
      <BottomSheetScrollView
        contentContainerStyle={{
          paddingBottom: BOTTOM_SHEET_GAP + footerHeight,
        }}
      >
        {/*
          VStack을 쓰지 않는다 — VStack은 자식을 각각 감싸서 여백을 주므로 드롭다운처럼
          펼쳐졌다 접혔다 하는 자식이 있을 때 랩퍼 층이 한 겹 더 끼어 측정이 어긋난다.
        */}
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
            />
          ))}
          {selectedVariants.map(variant => (
            <VariantCard
              key={variant.variantId}
              variant={variant}
              canRemove={hasOptionGroups}
              onRemove={() => handleRemoveVariant(variant.variantId)}
              onChangeCount={count => handleChangeVariantCount(variant.variantId, count)}
            />
          ))}
        </View>
      </BottomSheetScrollView>
      <View
        onLayout={e => setFooterHeight(e.nativeEvent.layout.height)}
        className="absolute bottom-0 left-0 right-0 bg-white"
        style={{ paddingBottom: bottom + PRODUCT_OPTION_BOTTOM_SHEET_PADDING }}
      >
        {/* 고르기 전에는 총액 줄 자체를 그리지 않는다 — 0원을 보여주면 무료로 읽힌다 */}
        {hasSelectedVariants && (
          <View className="flex-row items-baseline justify-between px-20 pt-14">
            <Typography style={{ fontSize: 13, fontWeight: "600", lineHeight: 13 }} className="text-ink76">
              총 결제 금액
            </Typography>
            <Typography
              style={{ fontSize: 21, fontWeight: "700", lineHeight: 21, letterSpacing: -0.6 }}
              className="text-ink"
            >
              {`${totalPrice.toLocaleString()}원`}
            </Typography>
          </View>
        )}

        <View className="flex-row px-20 pt-14" style={{ gap: 8 }}>
          <TouchableOpacity
            onPress={handlePressCart}
            disabled={!hasSelectedVariants}
            activeOpacity={hasSelectedVariants ? 0.75 : 1}
            className="h-52 flex-1 flex-row items-center justify-center rounded-base border bg-white"
            style={{ borderColor: hasSelectedVariants ? "#E3E3E5" : "#F4F4F5" }}
          >
            <Typography
              style={{ fontSize: 15, fontWeight: "600", lineHeight: 15 }}
              className={hasSelectedVariants ? "text-ink76" : "text-gray8"}
            >
              장바구니
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handlePressBuy}
            disabled={!hasSelectedVariants}
            activeOpacity={hasSelectedVariants ? 0.75 : 1}
            className="h-52 flex-1 flex-row items-center justify-center rounded-base"
            style={{ backgroundColor: hasSelectedVariants ? "#F2456E" : "#F4F4F5" }}
          >
            <Typography
              style={{ fontSize: 15, fontWeight: "600", lineHeight: 15 }}
              className={hasSelectedVariants ? "text-white" : "text-gray8"}
            >
              바로 구매
            </Typography>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
