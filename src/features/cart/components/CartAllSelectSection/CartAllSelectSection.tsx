import { View } from "react-native";

import Button from "@/common/components/Button/Button";
import Checkbox from "@/common/components/Checkbox/Checkbox";
import HStack from "@/common/components/HStack/HStack";
import Typography from "@/common/components/Typography/Typography";
import { useCheckbox } from "@/common/hooks/useCheckbox";

interface CartAllSelectSectionProps {
  isCheckedAll: boolean;
  onPressAllCheck: (newAllChecked: boolean) => void;
  onPressDeleteSelected: () => void;
}
export default function CartAllSelectSection(props: CartAllSelectSectionProps) {
  const { isCheckedAll, onPressAllCheck, onPressDeleteSelected } = props;
  const { checkedItems } = useCheckbox();

  return (
    <View className="flex flex-row justify-between px-20 py-10 border-b-[1px] border-gray2 bg-white">
      <HStack gap={10} className="items-center">
        <Checkbox isChecked={isCheckedAll} onChange={onPressAllCheck} />
        <Typography className="text-14 test-gray15 font-medium">전체 선택</Typography>
      </HStack>
      <Button
        disabled={checkedItems.size === 0}
        onPress={onPressDeleteSelected}
        variant="outline"
        className="px-10"
        size="xs"
      >
        선택 삭제
      </Button>
    </View>
  );
}
