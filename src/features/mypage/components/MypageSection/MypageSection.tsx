import { Pressable, View } from "react-native";

import Icon from "@/common/components/Icon/Icon";
import Typography from "@/common/components/Typography/Typography";
import { usePermissionPress } from "@/common/hooks/usePermissionPress";
import { MyPageRouteName } from "@/common/router/routes";
import { COMMON_ASSETS } from "@/common/utils/assets";
import { cn } from "@/common/utils/cn";

type RightType = "arrow" | "version";

export interface MypageSectionItem {
  title: string;
  rightType: RightType;
  routeName?: MyPageRouteName;
  hasPermission?: boolean;
  appVersion?: string;
}
export interface MypageSectionProps {
  title: string;
  items: Array<MypageSectionItem>;
  onPressItem?: (item: MypageSectionItem) => void;
}

export default function MypageSection(props: MypageSectionProps) {
  const { items, title, onPressItem } = props;

  const permissionPress = usePermissionPress((item: MypageSectionItem) => {
    onPressItem?.(item);
  });

  const handlePressItem = (item: MypageSectionItem) => {
    const pressEvent = item.hasPermission ? permissionPress : onPressItem;

    if (!pressEvent) {
      return;
    }

    pressEvent(item);
  };

  return (
    <View className="flex flex-col">
      <Typography className="text-gray9 font-semibold text-11">{title}</Typography>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <Pressable
            onPress={() => handlePressItem?.(item)}
            key={index}
            className={cn(
              "flex flex-row justify-between items-center py-15",
              !isLast && "border-b border-gray2"
            )}
          >
            <Typography className="text-black font-medium text-14">{item.title}</Typography>
            {item.rightType === "arrow" && <Icon icon={COMMON_ASSETS.arrowRight} />}
            {item.rightType === "version" && (
              <Typography className="text-gray10 font-medium text-14">{item.appVersion}</Typography>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
