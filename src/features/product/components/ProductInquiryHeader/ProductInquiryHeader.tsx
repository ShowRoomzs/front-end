import { TouchableOpacity } from "react-native";

import Header from "@/common/components/Header/Header";
import Icon from "@/common/components/Icon/Icon";
import { COMMON_ASSETS } from "@/common/utils/assets";
import { cn } from "@/common/utils/cn";

interface ProductInquiryHeaderProps {
  onPressBack: () => void;
  wrapperClassName?: string;
}

export default function ProductInquiryHeader(props: ProductInquiryHeaderProps) {
  const { onPressBack, wrapperClassName } = props;

  return (
    <Header
      className={cn(wrapperClassName, "border-b-[1px] border-gray2 py-11")}
      centered
      renderLeft={
        <TouchableOpacity onPress={onPressBack} activeOpacity={0.5}>
          <Icon icon={COMMON_ASSETS.back} />
        </TouchableOpacity>
      }
      title="상품 문의하기"
    />
  );
}
