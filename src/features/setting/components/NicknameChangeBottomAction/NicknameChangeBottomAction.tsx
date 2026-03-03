import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Button from "@/common/components/Button/Button";

interface NicknameChangeBottomActionProps {
  onPress: () => void;
  disabled: boolean;
}

export default function NicknameChangeBottomAction(props: NicknameChangeBottomActionProps) {
  const { onPress, disabled } = props;
  const insets = useSafeAreaInsets();

  return (
    <View
      className="absolute bottom-0 left-0 right-0 border-t border-gray2 bg-white px-10 pt-10"
      style={{ paddingBottom: insets.bottom }}
    >
      <Button size="xl" variant="primary" onPress={onPress} disabled={disabled}>
        변경하기
      </Button>
    </View>
  );
}
