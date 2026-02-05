import { View } from "react-native";

import { TabItemType } from "@/common/components/Tabs/Tabs";
import Typography from "@/common/components/Typography/Typography";
import { cn } from "@/common/utils/cn";

interface DefaultTabItemProps {
  item: TabItemType;
  isActive: boolean;
}
export default function DefaultTabItem(props: DefaultTabItemProps) {
  const { item, isActive } = props;

  return (
    <View className="flex-1 items-center justify-center px-15 py-15">
      <Typography
        className={cn("text-13 text-gray10 font-normal text-center", isActive && "text-black font-medium")}
      >
        {item.label}
      </Typography>
    </View>
  );
}
