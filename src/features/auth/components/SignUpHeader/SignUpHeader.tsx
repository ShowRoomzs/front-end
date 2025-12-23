import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Header from "@/common/components/Header/Header";
import Icon from "@/common/components/Icon/Icon";
import Typography from "@/common/components/Typography/Typography";
import { COMMON_ASSETS } from "@/common/utils/assets";

type SignUpHeaderProps = NativeStackHeaderProps;

export default function SignUpHeader(props: SignUpHeaderProps) {
  const { navigation } = props;
  const inset = useSafeAreaInsets();

  return (
    <Header
      style={{ paddingTop: inset.top }}
      className="px-20"
      renderLeft={
        <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.goBack()}>
          <Icon icon={COMMON_ASSETS.back} width={24} height={24} />
        </TouchableOpacity>
      }
      renderRight={<Typography className="text-14 text-black">계정이 있으신가요?</Typography>}
    />
  );
}
