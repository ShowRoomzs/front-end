import { BottomSheetView } from "@gorhom/bottom-sheet";
import { useCallback, useMemo, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Dropdown from "@/common/components/Dropdown/Dropdown";
import VStack from "@/common/components/VStack/VStack";
import { SheetApi } from "@/common/providers/BottomSheetProvider/context";
import { PRODUCT_OPTION_BOTTOM_SHEET_PADDING } from "@/features/product/components/ProductOptionBottomSheet/config";
import { OptionGroup, Variant } from "@/features/product/types/product";
import { parseOption } from "@/features/product/utils/parseOption";

interface ProductOptionBottomSheetProps {
  sheetApi?: SheetApi;
  optionGroups: Array<OptionGroup>;
  variants: Array<Variant>;
}

export default function ProductOptionBottomSheet(props: ProductOptionBottomSheetProps) {
  const { optionGroups, variants, sheetApi } = props;
  const { bottom } = useSafeAreaInsets();
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});

  const handleChangeOption = useCallback((optionGroupId: number, optionId: number) => {
    setSelectedOptions(prev => {
      const updated = { ...prev };

      updated[optionGroupId] = optionId;
      return updated;
    });
  }, []);

  // 현재 선택된 option값들로 조합 가능한 variants 필터링
  const enableVariants = useMemo(() => {
    if (!Object.keys(selectedOptions).length) {
      return variants;
    }
    const optionIds = Object.values(selectedOptions).map(Number);

    return variants.filter(variant => optionIds.every(optionId => variant.optionIds.includes(optionId)));
  }, [selectedOptions, variants]);

  console.log("selected option ids", Object.values(selectedOptions).map(Number));
  console.log("enableVariants", enableVariants);

  return (
    <BottomSheetView>
      <VStack
        gap={20}
        style={{
          paddingBottom: bottom + PRODUCT_OPTION_BOTTOM_SHEET_PADDING,
          paddingTop: PRODUCT_OPTION_BOTTOM_SHEET_PADDING,
        }}
        className="px-20 pt-15"
      >
        {optionGroups.map(optionGroup => (
          <Dropdown
            placeholder={`(${optionGroup.name})옵션을 선택해 보세요`}
            value={selectedOptions[optionGroup.optionGroupId]?.toString() || ""}
            onChange={optionId => handleChangeOption(optionGroup.optionGroupId, Number(optionId))}
            key={optionGroup.optionGroupId}
            items={parseOption(optionGroup)}
          />
        ))}
      </VStack>
    </BottomSheetView>
  );
}
