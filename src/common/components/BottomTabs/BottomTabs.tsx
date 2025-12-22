import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Pressable, View } from "react-native";

import Icon from "@/common/components/Icon/Icon";
import Typography from "@/common/components/Typography/Typography";
import { HOME_ROUTES_LABEL_MAP } from "@/common/constants/tabs";
import { HomeRouteName } from "@/common/router";
import { COMMON_ASSETS, IconVariant } from "@/common/utils/assets";

export default function BottomTabs(props: BottomTabBarProps) {
  const { state, insets, navigation } = props;
  const handlePress = (routeName: string) => {
    navigation.navigate(routeName);
  };

  const getTextClassName = (isActive: boolean) => {
    let className = "text-10 font-medium";
    if (isActive) {
      className += " text-black";
    } else {
      className += " text-gray8";
    }
    return className;
  };

  return (
    <View
      style={{ paddingBottom: insets.bottom, height: 55 + insets.bottom }}
      className="flex flex-row w-full border-t-[1px] border-gray1 bg-white"
    >
      {state.routes.map((route, ix) => {
        const isActive = state.index === ix;
        const variant: IconVariant = isActive ? "active" : "default";

        return (
          <Pressable
            onPress={() => handlePress(route.name)}
            className="flex-1 flex-col gap-5 items-center justify-center pt-10"
            key={route.key}
          >
            <Icon icon={COMMON_ASSETS[route.name]} variant={variant} width={20} height={20} />
            <Typography className={getTextClassName(isActive)}>
              {HOME_ROUTES_LABEL_MAP[route.name as HomeRouteName]}
            </Typography>
          </Pressable>
        );
      })}
    </View>
  );
}
