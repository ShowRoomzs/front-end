import { View } from "react-native";

import { TabItemType } from "@/common/components/Tabs/Tabs";
import Typography from "@/common/components/Typography/Typography";
import { cn } from "@/common/utils/cn";

interface RecommendedTabItemProps {
  item: TabItemType;
  isActive: boolean;
}
export default function RecommendedTabItem(props: RecommendedTabItemProps) {
  const { item, isActive } = props;

  return (
    <View
      className={cn(
        "flex items-center justify-center px-15 py-8 rounded-[30px]",
        isActive ? "bg-gray14" : "bg-white"
      )}
    >
      <Typography className={cn("text-13 font-medium", isActive ? "text-white" : "text-gray11")}>
        {item.label}
      </Typography>
    </View>
  );
}
