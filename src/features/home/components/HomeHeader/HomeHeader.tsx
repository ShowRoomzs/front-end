import { TouchableOpacity } from "react-native";

import Header from "@/common/components/Header/Header";
import HStack from "@/common/components/HStack/HStack";
import Icon from "@/common/components/Icon/Icon";
import { COMMON_ASSETS } from "@/common/utils/assets";

interface HomeHeaderProps {
  onPressNotification: () => void;
  onPressCart: () => void;
}

export default function HomeHeader(props: HomeHeaderProps) {
  const { onPressCart, onPressNotification } = props;

  return (
    <Header
      renderLeft={<Icon icon={COMMON_ASSETS.logoBlack} width={136} height={14} />}
      renderRight={
        <HStack gap={16}>
          <TouchableOpacity onPress={onPressNotification} activeOpacity={0.5}>
            <Icon icon={COMMON_ASSETS.notification} width={24} height={24} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onPressCart} activeOpacity={0.5}>
            <Icon icon={COMMON_ASSETS.cart} width={24} height={24} />
          </TouchableOpacity>
        </HStack>
      }
    />
  );
}
