import { View } from "react-native";

import { TabItemType } from "@/common/components/Tabs/Tabs";
import Typography from "@/common/components/Typography/Typography";
import { cn } from "@/common/utils/cn";

interface WishlistProductTabHeaderProps {
  item: TabItemType;
  isActive: boolean;
  wrapperClassName?: string;
}
export default function WishlistProductTabHeader(props: WishlistProductTabHeaderProps) {
  const { item, isActive, wrapperClassName } = props;

  const getDefaultWrapperClassName = () => {
    return "py-10 px-15 rounded-[30px] flex items-center justify-center";
  };
  const activeWrapperClassName = () => {
    return "bg-gray14";
  };

  const defaultLabelClassName = () => {
    return "text-gray11 font-normal";
  };
  const activeLabelClassName = () => {
    return "text-13 text-white font-medium";
  };

  return (
    <View
      className={cn(getDefaultWrapperClassName(), wrapperClassName, isActive && activeWrapperClassName())}
    >
      <Typography className={cn(defaultLabelClassName(), isActive && activeLabelClassName())}>
        {item.label}
      </Typography>
    </View>
  );
}
