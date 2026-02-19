import { BottomSheetView } from "@gorhom/bottom-sheet";
import { useCallback, useState } from "react";
import { View } from "react-native";

import Button from "@/common/components/Button/Button";
import HStack from "@/common/components/HStack/HStack";
import { SheetApi } from "@/common/providers/BottomSheetProvider/context";
import FilterSelectView from "@/features/filter/components/FilterBottomSheetItemView/FilterSelectView";
import { Filter } from "@/features/filter/types/filter";

interface SortBottomSheetViewProps {
  filter: Filter;
  selectedValues: Array<string>;
  onConfirm: (newSortValues: Array<string>) => void;
  sheetApi?: SheetApi;
}
export default function SortBottomSheetView(props: SortBottomSheetViewProps) {
  const { filter, selectedValues: originalSelectedValues, onConfirm, sheetApi } = props;

  const [selectedValues, setSelectedValues] = useState<Array<string>>(originalSelectedValues);

  const handleChange = (value: string) => {
    setSelectedValues([value]);
  };
  const handleCancel = useCallback(() => {
    setSelectedValues(originalSelectedValues);
    sheetApi?.close();
  }, [originalSelectedValues, sheetApi]);

  const handleConfirm = useCallback(() => {
    onConfirm(selectedValues);
    sheetApi?.close();
  }, [onConfirm, selectedValues, sheetApi]);

  return (
    <BottomSheetView style={{ paddingHorizontal: 20 }}>
      <View className="h-[240px]">
        <FilterSelectView filter={filter} selectedValues={selectedValues} onChange={handleChange} />
      </View>
      <HStack gap={6} className="items-center w-full">
        <Button onPress={handleCancel} activeOpacity={0.7} size="xl" variant="secondary" className="flex-1">
          취소
        </Button>
        <Button onPress={handleConfirm} activeOpacity={0.7} size="xl" variant="primary" className="flex-1">
          확인
        </Button>
      </HStack>
    </BottomSheetView>
  );
}
