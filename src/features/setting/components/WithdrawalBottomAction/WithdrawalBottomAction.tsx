import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Button from "@/common/components/Button/Button";
import HStack from "@/common/components/HStack/HStack";

interface WithdrawalBottomActionProps {
  onPressContinue: () => void;
  onPressNext?: () => void;
  isNextEnabled: boolean;
}

export default function WithdrawalBottomAction(props: WithdrawalBottomActionProps) {
  const { onPressContinue, onPressNext, isNextEnabled } = props;
  const insets = useSafeAreaInsets();

  return (
    <View
      className="absolute bottom-0 left-0 right-0 border-t border-gray2 bg-white px-10 pt-10"
      style={{ paddingBottom: insets.bottom }}
    >
      <HStack gap={6}>
        <Button className="flex-1" size="xl" variant="outline" onPress={onPressContinue}>
          계속 사용하기
        </Button>
        <Button
          className="flex-1"
          size="xl"
          variant="primary"
          onPress={onPressNext}
          disabled={!isNextEnabled}
        >
          다음 단계로
        </Button>
      </HStack>
    </View>
  );
}
