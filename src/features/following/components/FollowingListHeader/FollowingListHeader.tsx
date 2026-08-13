import { TouchableOpacity } from "react-native";

import Header from "@/common/components/Header/Header";
import Icon from "@/common/components/Icon/Icon";
import { COMMON_ASSETS } from "@/common/utils/assets";
import { cn } from "@/common/utils/cn";

interface FollowingListHeaderProps {
  onBackPress: () => void;
  title: string;
  wrapperClassName?: string;
}

export default function FollowingListHeader(props: FollowingListHeaderProps) {
  const { onBackPress, wrapperClassName, title } = props;

  return (
    <Header
      className={cn("py-10 border-b-[1px] border-gray2", wrapperClassName)}
      renderLeft={
        <TouchableOpacity onPress={onBackPress} activeOpacity={0.7}>
          <Icon icon={COMMON_ASSETS.back} />
        </TouchableOpacity>
      }
      title={title}
    />
  );
}
