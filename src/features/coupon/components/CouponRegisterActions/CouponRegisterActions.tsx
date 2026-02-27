import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Button from "@/common/components/Button/Button";

interface CouponRegisterActionsProps {
  disabled: boolean;
  onPress: () => void;
}

export default function CouponRegisterActions(props: CouponRegisterActionsProps) {
  const { disabled, onPress } = props;
  const { bottom } = useSafeAreaInsets();

  return (
    <View
      className="absolute bottom-0 left-0 right-0 bg-white border-t border-t-gray2 px-20 pt-10"
      style={{ paddingBottom: bottom + 10 }}
    >
      <Button size="xl" disabled={disabled} onPress={onPress}>
        등록하기
      </Button>
    </View>
  );
}
