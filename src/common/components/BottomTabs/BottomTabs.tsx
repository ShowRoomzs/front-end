import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { ComponentType, useEffect } from "react";
import { Pressable } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BOTTOM_TABS_HEIGHT } from "@/common/components/BottomTabs/config";
import {
  DsIconProps,
  FollowingIcon,
  HeartIcon,
  HomeIcon,
  ProfileIcon,
} from "@/common/components/DsIcon/icons";
import Typography from "@/common/components/Typography/Typography";
import { HOME_ROUTES_LABEL_MAP } from "@/common/constants/tabs";
import { useBottomTab } from "@/common/hooks/useBottomTab";
import { HomeRouteName } from "@/common/router";

/**
 * 하단 탭 — 활성색은 잉크(#0F0F0F)다. 포인트 컬러(로즈)는 공구 신호(D-day · 할인율 ·
 * 알림 점 · 장바구니 배지)에만 남기고 탭바에는 쓰지 않는다.
 *
 * 활성만 채움(fill), 나머지는 선. 라벨은 활성 600 / 비활성 500 · 10px
 * (텍스트 최소 11px 규칙의 유일한 예외).
 */
type TabIconComponent = ComponentType<DsIconProps & { active?: boolean }>;

const TAB_ICON_MAP: Record<HomeRouteName, TabIconComponent> = {
  home: HomeIcon,
  following: FollowingIcon,
  like: props => <HeartIcon {...props} filled={props.active} />,
  mypage: ProfileIcon,
};

const ACTIVE_COLOR = "#0F0F0F";
const INACTIVE_COLOR = "#9E9E9E";

export default function BottomTabs(props: BottomTabBarProps) {
  const { state, navigation } = props;
  const { isVisible } = useBottomTab();
  const inset = useSafeAreaInsets();
  const visibleHeight = BOTTOM_TABS_HEIGHT + inset.bottom;
  const progress = useSharedValue(isVisible ? 0 : 1);

  const handlePress = (routeName: string) => {
    navigation.navigate(routeName);
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
      className="w-full flex-row border-t-[0.5px] border-divider bg-white pt-9"
    >
      {state.routes.map((route, ix) => {
        const isActive = state.index === ix;
        const routeName = route.name as HomeRouteName;
        const TabIcon = TAB_ICON_MAP[routeName];

        return (
          <Pressable
            onPress={() => handlePress(route.name)}
            className="flex-1 flex-col items-center justify-start"
            style={{ gap: 3 }}
            key={route.key}
          >
            <TabIcon size={25} color={isActive ? ACTIVE_COLOR : INACTIVE_COLOR} active={isActive} />
            <Typography
              variant={isActive ? "tabLabelActive" : "tabLabel"}
              className={isActive ? "text-ink" : "text-gray62"}
            >
              {HOME_ROUTES_LABEL_MAP[routeName]}
            </Typography>
          </Pressable>
        );
      })}
    </Animated.View>
  );
}
