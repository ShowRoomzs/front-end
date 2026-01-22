import { BottomSheetView } from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, Text, View } from "react-native";

import Button from "@/common/components/Button/Button";
import HStack from "@/common/components/HStack/HStack";
import Icon from "@/common/components/Icon/Icon";
import Tabs, { TabItemType } from "@/common/components/Tabs/Tabs";
import Typography from "@/common/components/Typography/Typography";
import VStack from "@/common/components/VStack/VStack";
import { COMMON_ASSETS } from "@/common/utils/assets";
import FilterBottomSheetItemView from "@/features/category/components/FilterBottomSheetItemView/FilterBottomSheetItemView";
import { Filter } from "@/features/category/types/category";
import { FilterParam } from "@/features/product/types/params";

interface FilterBottomSheetViewProps {
  filters: Array<Filter>;
  selectedId: number | null;
  selectedFilters: Array<FilterParam>;
  onChange: (filters: Array<FilterParam>) => void;
}
export const FILTER_BOTTOM_SHEET_HEIGHT = 550;

export default function FilterBottomSheetView(props: FilterBottomSheetViewProps) {
  const { filters, selectedId, selectedFilters, onChange } = props;
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  useEffect(() => {
    if (!selectedId) {
      return;
    }
    const index = filters.findIndex(f => f.id === selectedId);

    setSelectedIndex(index);
  }, [filters, selectedId]);

  const handleItemChange = useCallback(
    (filterId: number, value: string) => {
      const filter = filters.find(f => f.id === filterId);

      if (!filter) {
        return;
      }

      const filterParam: FilterParam = {
        key: filter.filterKey,
        values: [value],
      };

      onChange([filterParam]);
    },
    [filters, onChange]
  );

  const tabItems: Array<TabItemType> = useMemo(() => {
    return filters.map(filter => {
      const selectedFilter = selectedFilters.find(f => f.key === filter.filterKey);
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
  }, [filters, selectedFilters, handleItemChange]);

  return (
    <BottomSheetView className="relative">
      <Typography className="text-black text-15 font-semibold text-center py-15">필터</Typography>
      <View className="h-full">
        <Tabs
          headerClassName="border-b border-gray2"
          selectedIndex={selectedIndex}
          bodyClassName="min-h-[200px]"
          onSelect={setSelectedIndex}
          items={tabItems}
          enableTabTransitionAnimation={false}
        />
      </View>
      <VStack gap={10}>
        {/* TODO : 선택된 필터 표출 */}
        <FlatList
          data={[]}
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-20 py-15 bg-gray2"
          renderItem={({ item }) => <Text>d</Text>}
        />
        <HStack gap={6} className="px-10 items-center w-full">
          <Button activeOpacity={0.7} size="xl" variant="ghost">
            <HStack className="items-center" gap={8}>
              <Icon icon={COMMON_ASSETS.reset} />
              <Typography className="text-black text-16 font-medium">재설정</Typography>
            </HStack>
          </Button>
          <Button activeOpacity={0.7} className="flex-1" size="xl" variant="primary">
            0개의 상품 보기
          </Button>
        </HStack>
      </VStack>
    </BottomSheetView>
  );
}
