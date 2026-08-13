import { useEffect, useRef } from "react";
import { Pressable, ScrollView, View } from "react-native";

import Icon from "@/common/components/Icon/Icon";
import Typography from "@/common/components/Typography/Typography";
import { useDropdown } from "@/common/hooks/useDropdown";
import { COMMON_ASSETS } from "@/common/utils/assets";
import { cn } from "@/common/utils/cn";

export interface DropdownItem {
  label: string;
  value: string;
  disabled?: boolean;
}
interface DropdownProps {
  id: string;
  items: Array<DropdownItem>;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  closeOnDisabled?: boolean;
  onPressDisabled?: () => void;
}
export default function Dropdown(props: DropdownProps) {
  const {
    items,
    value,
    onChange,
    placeholder,
    disabled,
    id,
    closeOnDisabled = true,
    onPressDisabled,
  } = props;
  const scrollViewRef = useRef<ScrollView>(null);

  const { openStatus, open, close } = useDropdown();
  const itemOffsetMap = useRef<Map<string, number>>(new Map());
  const isOpen = openStatus[id];

  // 선택된 아이템 존재한다면 자동 스크롤 이동
  useEffect(() => {
    if (!isOpen || !scrollViewRef.current || !value) {
      return;
    }
    const y = itemOffsetMap.current.get(value);

    if (y === undefined) {
      return;
    }
    scrollViewRef.current.scrollTo({ y, animated: false });
  }, [isOpen, value]);

  const handlePress = () => {
    if (disabled) {
      // disabled 상태일 때 비지니스 로직은 외부에서 처리
      onPressDisabled?.();
      return;
    }
    if (isOpen) {
      close(id);
      return;
    }
    open(id);
  };

  const handleChange = (item: DropdownItem) => {
    // disabled에 따른 비지니스 로직은 외부에서 처리
    onChange(item.value);
    // disabled가 아니라면 무조건 close
    // disabled이고 closeOnDisabled가 true라면 close
    if (!item.disabled || (item.disabled && closeOnDisabled)) {
      close(id);
      return;
    }
  };

  const selectedItem = items.find(item => item.value === value);

  return (
    <Pressable
      onPress={handlePress}
      onTouchEnd={e => e.stopPropagation()} // dropdown provider onTouchEnd 방지
      className={cn("flex flex-col border-[1px] border-gray3 rounded-[5px]", isOpen && "border-gray13")}
    >
      <View className="flex flex-row items-center justify-between p-15">
        <Typography className={cn("text-14 text-gray10 font-normal", selectedItem && "text-black")}>
          {selectedItem?.label || placeholder || "선택"}
        </Typography>
        <Icon icon={COMMON_ASSETS.arrowDown} />
      </View>
      {isOpen && (
        <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false} className="max-h-[225px]">
          {items.map(item => {
            const isSelected = value === item.value;

            return (
              <Pressable
                onLayout={e => itemOffsetMap.current.set(item.value, e.nativeEvent.layout.y)}
                onPress={() => handleChange(item)}
                key={item.value}
                className="flex flex-row items-center justify-between p-15 border-t-[1px] border-gray2"
              >
                <Typography className={cn("text-13 text-black font-normal", item.disabled && "text-gray10")}>
                  {item.label}
                </Typography>
                {isSelected && <Icon icon={COMMON_ASSETS.checkBlack} />}
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </Pressable>
  );
}
