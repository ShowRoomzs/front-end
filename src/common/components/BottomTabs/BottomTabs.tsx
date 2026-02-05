import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useEffect } from "react";
import { Pressable } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BOTTOM_TABS_HEIGHT } from "@/common/components/BottomTabs/config";
import Icon from "@/common/components/Icon/Icon";
import Typography from "@/common/components/Typography/Typography";
import { HOME_ROUTES_LABEL_MAP } from "@/common/constants/tabs";
import { useBottomTab } from "@/common/hooks/useBottomTab";
import { HomeRouteName } from "@/common/router";
import { COMMON_ASSETS, IconVariant } from "@/common/utils/assets";

export default function BottomTabs(props: BottomTabBarProps) {
  const { state, navigation } = props;
  const { isVisible } = useBottomTab();
  const inset = useSafeAreaInsets();
  const visibleHeight = BOTTOM_TABS_HEIGHT + inset.bottom;
  const progress = useSharedValue(isVisible ? 0 : 1);

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

  useEffect(() => {
    progress.value = withTiming(isVisible ? 0 : 1, { duration: 200 });
  }, [isVisible, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    transform: [{ translateY: visibleHeight * progress.value }],
    height: visibleHeight,
    paddingBottom: inset.bottom,
  }));

  return (
    <Animated.View
      style={animatedStyle}
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
    </Animated.View>
  );
}
