// src/features/inquiry/components/InquiryRegisterHeader/InquiryRegisterHeader.tsx
import { TouchableOpacity } from "react-native";

import Header from "@/common/components/Header/Header";
import Icon from "@/common/components/Icon/Icon";
import { COMMON_ASSETS } from "@/common/utils/assets";
import { cn } from "@/common/utils/cn";

interface InquiryRegisterHeaderProps {
  onPressBack: () => void;
  wrapperClassName?: string;
}

export default function InquiryRegisterHeader(props: InquiryRegisterHeaderProps) {
  const { onPressBack, wrapperClassName } = props;

  return (
    <Header
      className={cn(wrapperClassName, "py-5 bg-white")}
      centered
      renderLeft={
        <TouchableOpacity onPress={onPressBack} activeOpacity={0.7}>
          <Icon icon={COMMON_ASSETS.back} width={24} height={24} />
        </TouchableOpacity>
      }
      title="1:1 문의하기"
    />
  );
}
