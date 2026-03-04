import { useCallback } from "react";
import { View } from "react-native";

import { DropdownItem } from "@/common/components/Dropdown/Dropdown";
import Dropdown from "@/common/components/Dropdown/Dropdown";
import { useTooltip } from "@/common/hooks/useTooltip";

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
      renderContent: "문의 유형을 선택해주세요.",
      placement: "bottomRight",
    });
    const timer = setTimeout(() => hideTooltip(), 2000);

    return () => clearTimeout(timer);
  }, [showTooltip, hideTooltip]);

  return (
    <View ref={ref}>
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
