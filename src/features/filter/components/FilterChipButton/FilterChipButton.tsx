import { useCallback, useMemo } from "react";
import { View } from "react-native";

import HStack from "@/common/components/HStack/HStack";
import Icon from "@/common/components/Icon/Icon";
import Typography from "@/common/components/Typography/Typography";
import { COMMON_ASSETS } from "@/common/utils/assets";
import { FilterType } from "@/features/filter/types/filter";

export interface FilterChipContent {
  filterType: FilterType;
  value: string;
  extra?: string;
}

interface FilterChipButtonProps {
  filter: FilterChipContent;
  onRemove: () => void;
}
export default function FilterChipButton(props: FilterChipButtonProps) {
  const { filter, onRemove } = props;

  const renderText = useCallback((str: string) => {
    return <Typography className="text-black text-13 font-medium">{str}</Typography>;
  }, []);

  const renderContent = useMemo(() => {
    switch (filter.filterType) {
      case "COLOR":
        return (
          <HStack gap={4}>
            <View className="w-14 h-14 rounded-full" style={{ backgroundColor: filter.extra }} />
            {renderText(filter.value)}
          </HStack>
        );

      // TODO : 선택된 필터 chip button render type 구현
      default:
        return renderText(filter.value);
    }
  }, [filter.extra, filter.filterType, filter.value, renderText]);

  return (
    <HStack gap={4} className="items-center">
      {renderContent}
      <Icon onPress={onRemove} icon={COMMON_ASSETS.closeGray} />
    </HStack>
  );
}
