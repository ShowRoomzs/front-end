import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Pressable, Text, View } from "react-native";

import Icon from "@/common/components/Icon/Icon";
import { COMMON_ASSETS, IconVariant } from "@/common/utils/assets";

export default function BottomTabs(props: BottomTabBarProps) {
  const { state, insets, navigation } = props;

  const handlePress = (routeName: string) => {
    navigation.navigate(routeName);
  };

  return (
    <View
      style={{ paddingBottom: insets.bottom }}
      className="flex flex-row w-full px-11 py-6 justify-between"
    >
      {state.routes.map((route, ix) => {
        const isActive = state.index === ix;
        const variant: IconVariant = isActive ? "active" : "default";

        return (
          <Pressable
            onPress={() => handlePress(route.name)}
            className="flex-col gap-8 items-center"
            key={route.key}
          >
            <Icon icon={COMMON_ASSETS[route.name]} variant={variant} />
            <Text>{route.name}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
