import { TouchableOpacity } from "react-native";

import Header from "@/common/components/Header/Header";
import HStack from "@/common/components/HStack/HStack";
import Icon from "@/common/components/Icon/Icon";
import { COMMON_ASSETS } from "@/common/utils/assets";
import { MARKET_DETAIL_HEADER_HEIGHT } from "@/features/market/components/MarketDetailHeader/config";

interface MarketDetailHeaderProps {
  onPressBack: () => void;
  onPressSearch: () => void;
  onPressCart: () => void;
}
export default function MarketDetailHeader(props: MarketDetailHeaderProps) {
  const { onPressBack, onPressSearch, onPressCart } = props;

  return (
    <Header
      style={{ height: MARKET_DETAIL_HEADER_HEIGHT }}
      className="px-20 pb-16"
      renderLeft={
        <TouchableOpacity onPress={onPressBack} activeOpacity={0.5}>
          <Icon icon={COMMON_ASSETS.back} />
        </TouchableOpacity>
      }
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
