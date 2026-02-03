import { BottomSheetView } from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, View } from "react-native";

import Button from "@/common/components/Button/Button";
import HStack from "@/common/components/HStack/HStack";
import Icon from "@/common/components/Icon/Icon";
import Tabs, { TabItemType } from "@/common/components/Tabs/Tabs";
import Typography from "@/common/components/Typography/Typography";
import VStack from "@/common/components/VStack/VStack";
import { SheetApi } from "@/common/providers/BottomSheetProvider/context";
import { COMMON_ASSETS } from "@/common/utils/assets";
import FilterBottomSheetItemView from "@/features/filter/components/FilterBottomSheetItemView/FilterBottomSheetItemView";
import FilterChipButton, {
  FilterChipContent,
} from "@/features/filter/components/FilterChipButton/FilterChipButton";
import { Filter } from "@/features/filter/types/filter";
import { useGetProducts } from "@/features/product/hooks/useGetProducts";
import { FilterParam, ProductListParams } from "@/features/product/types/params";

interface FilterBottomSheetViewProps {
  filters: Array<Filter>;
  selectedId: number | null;
  appliedFilters: Array<FilterParam>;
  previewParams: ProductListParams;
  onPressReset: () => void;
  onPressApply: (filters: Array<FilterParam>) => void;
  sheetApi?: SheetApi;
}
export const FILTER_BOTTOM_SHEET_HEIGHT = 550;

export default function FilterBottomSheetView(props: FilterBottomSheetViewProps) {
  const { filters, selectedId, appliedFilters, previewParams, onPressReset, onPressApply, sheetApi } = props;
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(undefined);
  const [tempFilters, setTempFilters] = useState<Array<FilterParam>>(appliedFilters);

  const { data: previewData } = useGetProducts({ ...previewParams, filters: tempFilters });

  useEffect(() => {
    setTempFilters(appliedFilters);
  }, [appliedFilters]);

  useEffect(() => {
    if (!selectedId || selectedIndex !== undefined) {
      return;
    }
    const index = filters.findIndex(f => f.id === selectedId);

    setSelectedIndex(index);
  }, [filters, selectedId, selectedIndex]);

  const handleItemChange = useCallback(
    (filterId: number, value: string) => {
      const filter = filters.find(f => f.id === filterId);

      if (!filter) {
        return;
      }

      setTempFilters(prev => {
        const updated = [...prev];
        const existingIndex = updated.findIndex(f => f.key === filter.filterKey);

        const newFilter: FilterParam = {
          key: filter.filterKey,
          values: [value],
        };

        if (existingIndex !== -1) {
          updated[existingIndex] = newFilter;
        } else {
          updated.push(newFilter);
        }

        return updated;
      });
    },
    [filters]
  );

  const handlePressApply = useCallback(() => {
    onPressApply(tempFilters);
    sheetApi?.close();
  }, [onPressApply, tempFilters, sheetApi]);

  const tabItems: Array<TabItemType> = useMemo(() => {
    return filters.map(filter => {
      const selectedFilter = tempFilters.find(f => f.key === filter.filterKey);
      const selectedValues = selectedFilter?.values || [];

      return {
        id: filter.id.toString(),
        label: filter.label,
        render: () => (
          <FilterBottomSheetItemView
            filter={filter}
            selectedValues={selectedValues}
            onChange={handleItemChange}
          />
        ),
      };
    });
  }, [filters, tempFilters, handleItemChange]);

  // values를 기준으로 flatten된 배열 생성
  const flattenedFiltersByValues: Array<FilterChipContent | null> = useMemo(() => {
    return tempFilters.flatMap(f =>
      f.values.map(v => {
        const targetFilter = filters.find(filter => filter.filterKey === f.key);

        if (!targetFilter) {
          return null;
        }
        const targetValue = targetFilter.values.find(value => value.value === v);

        if (!targetValue) {
          return null;
        }

        return {
          filterType: targetFilter.filterType,
          value: targetValue?.label,
          extra: targetValue?.extra || "",
        };
      })
    );
  }, [filters, tempFilters]);

  const renderFilterChipButton = useCallback(({ item }: { item: FilterChipContent | null }) => {
    if (!item) {
      return null;
    }
    return <FilterChipButton filter={item} onRemove={() => {}} />;
  }, []);

  return (
    <BottomSheetView className="relative">
      <Typography className="text-black text-15 font-semibold text-center py-15">필터</Typography>
      <View className="h-full">
        <Tabs
          headerClassName="h-45 border-b border-gray2"
          selectedIndex={selectedIndex}
          bodyClassName="min-h-[160px]"
          onSelect={setSelectedIndex}
          items={tabItems}
          enableTabTransitionAnimation={false}
          scrollable={false}
        />
      </View>
      <VStack gap={10}>
        {/* TODO : 선택된 필터 표출 */}
        <FlatList
          data={flattenedFiltersByValues || []}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ opacity: tempFilters.length > 1 ? 1 : 0 }}
          className="px-20 py-15 bg-gray2"
          renderItem={renderFilterChipButton}
          contentContainerStyle={{ gap: 20 }}
        />
        <HStack gap={6} className="px-10 items-center w-full">
          <Button onPress={onPressReset} activeOpacity={0.7} size="xl" variant="ghost">
            <HStack className="items-center" gap={8}>
              <Icon icon={COMMON_ASSETS.reset} />
              <Typography className="text-black text-16 font-medium">재설정</Typography>
            </HStack>
          </Button>
          <Button
            onPress={handlePressApply}
            activeOpacity={0.7}
            className="flex-1"
            size="xl"
            variant="primary"
          >
            {`${previewData?.products?.length || 0}개의 상품 보기`}
          </Button>
        </HStack>
      </VStack>
    </BottomSheetView>
  );
}
