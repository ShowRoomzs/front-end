import { TouchableOpacity, View } from "react-native";

import HStack from "@/common/components/HStack/HStack";
import Icon from "@/common/components/Icon/Icon";
import { COMMON_ASSETS } from "@/common/utils/assets";

interface HeaderProps {
  onPressNotification: () => void;
  onPressCart: () => void;
}

export default function Header(props: HeaderProps) {
  const { onPressCart, onPressNotification } = props;

  return (
    <View className="flex flex-row justify-between items-center py-5">
      <Icon icon={COMMON_ASSETS.logoBlack} width={136} height={14} />
      <HStack gap={16}>
        {/* TODO : TouchableOpacity 버튼 공통화 필요 */}
        <TouchableOpacity onPress={onPressNotification} activeOpacity={0.5}>
          <Icon icon={COMMON_ASSETS.notification} width={24} height={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressCart} activeOpacity={0.5}>
          <Icon icon={COMMON_ASSETS.cart} width={24} height={24} />
        </TouchableOpacity>
      </HStack>
    </View>
  );
}
