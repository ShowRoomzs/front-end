import { Pressable, View } from "react-native";

import Icon from "@/common/components/Icon/Icon";
import Typography from "@/common/components/Typography/Typography";
import { MyPageRouteName } from "@/common/router/routes";
import { COMMON_ASSETS } from "@/common/utils/assets";
import { cn } from "@/common/utils/cn";

type RightType = "arrow" | "version";

export interface MypageSectionItem {
  title: string;
  rightType: RightType;
  routeName?: MyPageRouteName;
}
export interface MypageSectionProps {
  title: string;
  items: Array<MypageSectionItem>;
  onPressItem?: (item: MypageSectionItem) => void;
  appVersion?: string;
}

export default function MypageSection(props: MypageSectionProps) {
  const { items, title, onPressItem, appVersion = "1.0.0" } = props;

  return (
    <View className="flex flex-col">
      <Typography className="text-gray9 font-semibold text-11">{title}</Typography>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <Pressable
            onPress={() => onPressItem?.(item)}
            key={index}
            className={cn(
              "flex flex-row justify-between items-center py-15",
              !isLast && "border-b border-gray2"
            )}
          >
            <Typography className="text-black font-medium text-14">{item.title}</Typography>
            {item.rightType === "arrow" && <Icon icon={COMMON_ASSETS.arrowRight} />}
            {item.rightType === "version" && (
              <Typography className="text-gray10 font-medium text-14">{appVersion}</Typography>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
