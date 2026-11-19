import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Button from "@/common/components/Button/Button";
import { useToastAnchor } from "@/common/providers/ToastProvider";

interface CouponListActionsProps {
  onPress: () => void;
}

export default function CouponListActions(props: CouponListActionsProps) {
  const { onPress } = props;
  const { bottom } = useSafeAreaInsets();
  const toastAnchor = useToastAnchor();

  return (
    <View
      className="absolute bottom-0 left-0 right-0 bg-white border-t border-t-gray2 px-20 pt-10"
      style={{ paddingBottom: bottom + 10 }}
      onLayout={toastAnchor}
    >
      <Button size="xl" onPress={onPress}>
        + 쿠폰 등록하기
      </Button>
    </View>
  );
}
