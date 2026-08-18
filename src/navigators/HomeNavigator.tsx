import { BottomTabBarProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaView } from "react-native-safe-area-context";

import BottomTabs from "@/common/components/BottomTabs/BottomTabs";
import { useBottomTab } from "@/common/hooks/useBottomTab";
import { HOME_ROUTES } from "@/common/router";
import FollowingView from "@/features/following/views/FollowingView";
import HomeView from "@/features/home/views/HomeView";
import LikeView from "@/features/like/views/LikeView";
import MypageNavigator from "@/navigators/MypageNavigator";

const Tab = createBottomTabNavigator();

export default function HomeNavigator() {
  const { setNavigation } = useBottomTab();

  return (
    <SafeAreaView edges={["top"]} className="flex-1">
      <Tab.Navigator
        initialRouteName={HOME_ROUTES.HOME}
        screenOptions={{ headerShown: false, tabBarStyle: { position: "absolute" } }}
        tabBar={(props: BottomTabBarProps) => {
          setNavigation(props.navigation);
          return <BottomTabs {...props} />;
        }}
      >
        <Tab.Screen name={HOME_ROUTES.HOME} component={HomeView} />
        <Tab.Screen name={HOME_ROUTES.FOLLOWING} component={FollowingView} />
        <Tab.Screen name={HOME_ROUTES.LIKE} component={LikeView} />
        <Tab.Screen name={HOME_ROUTES.MYPAGE} component={MypageNavigator} />
      </Tab.Navigator>
    </SafeAreaView>
  );
}
