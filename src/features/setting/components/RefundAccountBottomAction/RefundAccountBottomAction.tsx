import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Button from "@/common/components/Button/Button";
import { useToastAnchor } from "@/common/providers/ToastProvider";

interface RefundAccountBottomActionProps {
  onPress: () => void;
  disabled: boolean;
  label: string;
}

export default function RefundAccountBottomAction(props: RefundAccountBottomActionProps) {
  const { onPress, disabled, label } = props;
  const insets = useSafeAreaInsets();
  const toastAnchor = useToastAnchor();

  return (
    <View
      className="absolute bottom-0 left-0 right-0 border-t border-gray2 bg-white px-10 pt-10"
      style={{ paddingBottom: insets.bottom }}
      onLayout={toastAnchor}
    >
      <Button size="xl" variant="primary" onPress={onPress} disabled={disabled}>
        {label}
      </Button>
    </View>
  );
}
