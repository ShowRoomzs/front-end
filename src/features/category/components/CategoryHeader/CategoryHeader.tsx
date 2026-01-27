import { TouchableOpacity } from "react-native";

import Header from "@/common/components/Header/Header";
import HStack from "@/common/components/HStack/HStack";
import Icon from "@/common/components/Icon/Icon";
import Typography from "@/common/components/Typography/Typography";
import { COMMON_ASSETS } from "@/common/utils/assets";

interface CategoryHeaderProps {
  onPressSearch: () => void;
  onPressCart: () => void;
}
export default function CategoryHeader(props: CategoryHeaderProps) {
  const { onPressCart, onPressSearch } = props;

  return (
    <Header
      className="px-20 pb-16 border-b border-gray2"
      renderLeft={<Typography className="text-black text-16 font-semibold">카테고리</Typography>}
      renderRight={
        <HStack className="items-center" gap={16}>
          <TouchableOpacity onPress={onPressSearch} activeOpacity={0.5}>
            <Icon icon={COMMON_ASSETS.search} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onPressCart} activeOpacity={0.5}>
            <Icon icon={COMMON_ASSETS.cart} />
          </TouchableOpacity>
        </HStack>
      }
    />
  );
}
