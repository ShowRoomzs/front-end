import { TouchableOpacity } from "react-native";

import Header from "@/common/components/Header/Header";
import HStack from "@/common/components/HStack/HStack";
import Icon from "@/common/components/Icon/Icon";
import Typography from "@/common/components/Typography/Typography";
import { COMMON_ASSETS } from "@/common/utils/assets";

interface MypageHeaderProps {
  onPressSetting: () => void;
  onPressCart: () => void;
  wrapperClassName?: string;
}

export default function MypageHeader(props: MypageHeaderProps) {
  const { onPressCart, onPressSetting, wrapperClassName } = props;

  return (
    <Header
      className={wrapperClassName}
      renderLeft={<Typography className="text-16 font-semibold text-black">마이페이지</Typography>}
      renderRight={
        <HStack className="items-center" gap={16}>
          <TouchableOpacity activeOpacity={0.5} onPress={onPressSetting}>
            <Icon icon={COMMON_ASSETS.setting} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.5} onPress={onPressCart}>
            <Icon icon={COMMON_ASSETS.cart} />
          </TouchableOpacity>
        </HStack>
      }
    />
  );
}
