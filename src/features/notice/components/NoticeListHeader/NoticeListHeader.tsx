import { TouchableOpacity } from "react-native";

import Header from "@/common/components/Header/Header";
import Icon from "@/common/components/Icon/Icon";
import { COMMON_ASSETS } from "@/common/utils/assets";
import { cn } from "@/common/utils/cn";

interface NoticeListHeaderProps {
  onPressBack: () => void;
  wrapperClassName?: string;
}

export default function NoticeListHeader(props: NoticeListHeaderProps) {
  const { onPressBack, wrapperClassName } = props;

  return (
    <Header
      className={cn(wrapperClassName, "py-10 border-b-[1px] border-gray2")}
      centered
      renderLeft={
        <TouchableOpacity onPress={onPressBack} activeOpacity={0.7}>
          <Icon icon={COMMON_ASSETS.back} />
        </TouchableOpacity>
      }
      title="공지사항"
    />
  );
}
