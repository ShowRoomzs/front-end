import { TouchableOpacity } from "react-native";

import Header from "@/common/components/Header/Header";
import HStack from "@/common/components/HStack/HStack";
import Icon from "@/common/components/Icon/Icon";
import Typography from "@/common/components/Typography/Typography";
import { COMMON_ASSETS } from "@/common/utils/assets";
import { cn } from "@/common/utils/cn";

interface AddressManagementHeaderProps {
  onBackPress: () => void;
  title: string;
  onAddAddressPress?: () => void;
  wrapperClassName?: string;
  showAddButton?: boolean;
}

export default function AddressManagementHeader(props: AddressManagementHeaderProps) {
  const { onAddAddressPress, onBackPress, wrapperClassName, title, showAddButton = true } = props;

  return (
    <Header
      className={cn("py-10 border-b-[1px] border-gray2", wrapperClassName)}
      renderLeft={
        <TouchableOpacity onPress={onBackPress} activeOpacity={0.7}>
          <Icon icon={COMMON_ASSETS.back} />
        </TouchableOpacity>
      }
      title={title}
      renderRight={
        showAddButton && (
          <TouchableOpacity onPress={onAddAddressPress} activeOpacity={0.7}>
            <HStack gap={4} className="items-center">
              <Typography className="text-pointColor text-13 font-normal">배송지 추가</Typography>
              <Icon icon={COMMON_ASSETS.plusIconPoint} stroke="rgba(239, 74, 55, 1)" />
            </HStack>
          </TouchableOpacity>
        )
      }
    />
  );
}
