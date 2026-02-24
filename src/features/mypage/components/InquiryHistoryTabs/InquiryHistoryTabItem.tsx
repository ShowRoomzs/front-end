import { useWindowDimensions, View } from "react-native";

import { TabItemType } from "@/common/components/Tabs/Tabs";
import Typography from "@/common/components/Typography/Typography";
import { cn } from "@/common/utils/cn";

interface InquiryHistoryTabItemProps extends Omit<TabItemType, "render"> {
  itemLength: number;
  isActive: boolean;
}

export default function InquiryHistoryTabItem(props: InquiryHistoryTabItemProps) {
  const { id, label, itemLength, isActive } = props;
  const pageWidth = useWindowDimensions().width;

  return (
    <View
      key={id}
      style={{ width: pageWidth / itemLength }}
      className={cn("flex items-center justify-center h-43")}
    >
      <Typography style={{ fontSize: 15 }} className={cn("text-gray10", isActive && "text-black font-[600]")}>
        {label}
      </Typography>
    </View>
  );
}
