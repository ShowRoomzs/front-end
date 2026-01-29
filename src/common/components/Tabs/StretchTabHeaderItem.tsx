import { useWindowDimensions, View } from "react-native";

import { TabItemType } from "@/common/components/Tabs/Tabs";
import Typography from "@/common/components/Typography/Typography";
import { cn } from "@/common/utils/cn";

interface StretchTabHeaderItemProps {
  item: TabItemType;
  itemCount: number;
  isActive: boolean;
  wrapperClassName?: string;
  labelClassName?: string;
  activeLabelClassName?: string;
}

export default function StretchTabHeaderItem(props: StretchTabHeaderItemProps) {
  const { item, itemCount, isActive, wrapperClassName, labelClassName, activeLabelClassName } = props;
  const width = useWindowDimensions().width / itemCount;

  return (
    <View className={cn("py-15 flex items-center justify-center", wrapperClassName)} style={{ width }}>
      <Typography
        className={cn(
          "text-13 font-normal",
          labelClassName,
          isActive && (activeLabelClassName ? activeLabelClassName : "text-black font-medium")
        )}
      >
        {item.label}
      </Typography>
    </View>
  );
}
