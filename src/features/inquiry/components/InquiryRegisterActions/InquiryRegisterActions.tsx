import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Button from "@/common/components/Button/Button";
import HStack from "@/common/components/HStack/HStack";

interface InquiryRegisterActionsProps {
  isSubmitEnabled: boolean;
  onPressCancel: () => void;
  onPressSubmit: () => void;
}

export default function InquiryRegisterActions(props: InquiryRegisterActionsProps) {
  const { isSubmitEnabled, onPressCancel, onPressSubmit } = props;
  const { bottom } = useSafeAreaInsets();

  return (
    <View
      className="absolute bottom-0 left-0 right-0 bg-white border-t border-t-gray2 px-20 pt-10"
      style={{ paddingBottom: bottom + 10 }}
    >
      <HStack gap={10}>
        <View className="flex-1">
          <Button size="xl" variant="secondary" onPress={onPressCancel}>
            취소
          </Button>
        </View>
        <View className="flex-1">
          <Button size="xl" variant="primary" disabled={!isSubmitEnabled} onPress={onPressSubmit}>
            작성하기
          </Button>
        </View>
      </HStack>
    </View>
  );
}
