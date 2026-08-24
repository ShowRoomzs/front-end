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
 *
 * 탭바는 **탭 루트 4개에서만** 그린다 — 디자인에서 탭바를 가진 화면은 C1 홈 · C2 팔로잉 ·
 * C3 좋아요 · C 마이뿐이고, 그 아래로 밀고 들어간 화면(C15 설정 · C13 배송지 · C16 고객센터 …)
 * 에는 없다.
 *
 * 이 판단을 화면마다 hide()/show()로 처리하면 화면을 새로 붙일 때마다 빠뜨리게 되고,
 * 실제로 빠뜨린 화면들에서 탭바가 "저장" 같은 하단 버튼을 덮었다. 그래서 화면에 맡기지 않고
 * **네비게이션 상태에서 직접 읽는다** — 포커스된 탭의 중첩 스택이 루트가 아니면 탭바는 없다.
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
  const { isVisible, show } = useBottomTab();
  const inset = useSafeAreaInsets();
  const visibleHeight = BOTTOM_TABS_HEIGHT + inset.bottom;
  const progress = useSharedValue(isVisible ? 0 : 1);

  /**
   * 중첩 스택이 아직 초기화되지 않았으면 state가 없다 — 그때는 루트로 본다.
   * 탭 자체가 단일 화면인 홈·팔로잉·좋아요도 같은 경로로 늘 루트가 된다.
   */
  const isTabRootScreen = (state.routes[state.index].state?.index ?? 0) === 0;

  const handlePress = (routeName: string) => {
    navigation.navigate(routeName);
  };

  useEffect(() => {
    progress.value = withTiming(isVisible ? 0 : 1, { duration: 200 });
  }, [isVisible, progress]);

  /**
   * 스크롤로 감춰 둔 상태 그대로 하위 화면에 들어갔다가 돌아오면 탭바가 사라진 채로 남는다.
   * 탭바가 없는 구간으로 넘어가는 순간 되돌려 둔다.
   */
  useEffect(() => {
    if (!isTabRootScreen) {
      show();
    }
  }, [isTabRootScreen, show]);

  const animatedStyle = useAnimatedStyle(() => ({
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    transform: [{ translateY: visibleHeight * progress.value }],
    height: visibleHeight,
    paddingBottom: inset.bottom,
  }));

  if (!isTabRootScreen) {
    return null;
  }

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
