import { TouchableOpacity } from "react-native";

import Header from "@/common/components/Header/Header";
import Icon from "@/common/components/Icon/Icon";
import { COMMON_ASSETS } from "@/common/utils/assets";

interface CartHeaderProps {
  onPressBack: () => void;
  onPressHome: () => void;
  wrapperClassName?: string;
}

export default function CartHeader(props: CartHeaderProps) {
  const { onPressBack, onPressHome, wrapperClassName } = props;

  return (
    <Header
      className={wrapperClassName}
      renderLeft={
        <TouchableOpacity onPress={onPressBack} activeOpacity={0.7}>
          <Icon icon={COMMON_ASSETS.back} />
        </TouchableOpacity>
      }
      title="장바구니"
      renderRight={
        <TouchableOpacity onPress={onPressHome} activeOpacity={0.7}>
          <Icon icon={COMMON_ASSETS.homeBlack} />
        </TouchableOpacity>
      }
    />
  );
}
