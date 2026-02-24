import { TouchableOpacity } from "react-native";

import Header from "@/common/components/Header/Header";
import Icon from "@/common/components/Icon/Icon";
import { COMMON_ASSETS } from "@/common/utils/assets";
import { cn } from "@/common/utils/cn";

interface InquiryHistoryHeaderProps {
  onPressBack: () => void;
  wrapperClassName?: string;
}

export default function InquiryHistoryHeader(props: InquiryHistoryHeaderProps) {
  const { onPressBack, wrapperClassName } = props;

  return (
    <Header
      className={cn(wrapperClassName, "py-5")}
      centered
      renderLeft={
        <TouchableOpacity onPress={onPressBack} activeOpacity={0.5}>
          <Icon icon={COMMON_ASSETS.back} />
        </TouchableOpacity>
      }
      title="문의 내역"
    />
  );
}
