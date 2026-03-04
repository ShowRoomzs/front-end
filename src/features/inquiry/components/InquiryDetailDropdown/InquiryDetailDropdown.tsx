import { useCallback } from "react";
import { View } from "react-native";

import { DropdownItem } from "@/common/components/Dropdown/Dropdown";
import Dropdown from "@/common/components/Dropdown/Dropdown";
import HStack from "@/common/components/HStack/HStack";
import Icon from "@/common/components/Icon/Icon";
import Typography from "@/common/components/Typography/Typography";
import { useTooltip } from "@/common/hooks/useTooltip";
import { COMMON_ASSETS } from "@/common/utils/assets";

interface InquiryDetailDropdownProps {
  items: Array<DropdownItem>;
  value: string;
  onChange: (value: string) => void;
  hasCategory: boolean;
}

export default function InquiryDetailDropdown(props: InquiryDetailDropdownProps) {
  const { items, value, onChange, hasCategory } = props;
  const { ref, show: showTooltip, hide: hideTooltip } = useTooltip("inquiry-detail-tooltip");

  const handlePressDisabled = useCallback(() => {
    showTooltip({
      renderContent: (
        <HStack gap={6} className="items-center px-16 py-10">
          <Icon icon={COMMON_ASSETS.checkBlack} />
          <Typography className="text-13 font-normal text-black">문의 카테고리를 선택해주세요.</Typography>
        </HStack>
      ),
      placement: "bottom",
      gap: -35,
      wrapperClassName: "bg-white/90 rounded-full shadow-sm border border-gray2",
      showArrow: false,
    });
    const timer = setTimeout(() => hideTooltip(), 2000);

    return () => clearTimeout(timer);
  }, [showTooltip, hideTooltip]);

  return (
    <View ref={ref} collapsable={false}>
      <Dropdown
        id="inquiry-detail"
        items={items}
        value={value}
        onChange={onChange}
        placeholder="문의 유형을 선택해 주세요"
        disabled={!hasCategory}
        onPressDisabled={handlePressDisabled}
      />
    </View>
  );
}
