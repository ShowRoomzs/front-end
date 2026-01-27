import { ListRenderItemInfo, useWindowDimensions, View } from "react-native";

import { TabItemType } from "@/common/components/Tabs/Tabs";
import Typography from "@/common/components/Typography/Typography";
import { cn } from "@/common/utils/cn";

interface ProductDetailTabHeaderProps {
  item: ListRenderItemInfo<TabItemType>;
  itemCount: number;
  isActive: boolean;
}
export default function ProductDetailTabHeader(props: ProductDetailTabHeaderProps) {
  const {
    item: { item },
    itemCount,
    isActive,
  } = props;

  const width = useWindowDimensions().width / itemCount;

  return (
    <View className="py-15 flex items-center justify-center" style={{ width }}>
      <Typography className={cn("text-13 font-normal", isActive && "text-black font-medium")}>
        {item.label}
      </Typography>
    </View>
  );
}
