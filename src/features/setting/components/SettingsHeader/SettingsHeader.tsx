import { TouchableOpacity } from "react-native";

import Header from "@/common/components/Header/Header";
import Icon from "@/common/components/Icon/Icon";
import { COMMON_ASSETS } from "@/common/utils/assets";
import { cn } from "@/common/utils/cn";

interface SettingsHeaderProps {
  onPressBack: () => void;
  wrapperClassName?: string;
  title?: string;
}
export default function SettingsHeader(props: SettingsHeaderProps) {
  const { onPressBack, wrapperClassName, title = "설정" } = props;

  return (
    <Header
      centered
      title={title}
      className={cn(wrapperClassName, "py-10 border-b-[1px] border-gray2")}
      renderLeft={
        <TouchableOpacity onPress={onPressBack} activeOpacity={0.7}>
          <Icon icon={COMMON_ASSETS.back} />
        </TouchableOpacity>
      }
    />
  );
}
