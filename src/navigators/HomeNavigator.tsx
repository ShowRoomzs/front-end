import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaView } from "react-native-safe-area-context";

import BottomTabs from "@/common/components/BottomTabs/BottomTabs";
import { HOME_ROUTES } from "@/common/router";
import CategoryView from "@/features/category/views/CategoryView";
import FollowingView from "@/features/following/views/FollowingView";
import HomeView from "@/features/home/views/HomeView";
import LikeView from "@/features/like/views/LikeView";
import MypageView from "@/features/mypage/views/MypageView";

const Tab = createBottomTabNavigator();

export default function HomeNavigator() {
  return (
    <SafeAreaView edges={["top"]} className="flex-1">
      <Tab.Navigator
        initialRouteName={HOME_ROUTES.HOME}
        screenOptions={{ headerShown: false }}
        tabBar={props => <BottomTabs {...props} />}
      >
        <Tab.Screen name={HOME_ROUTES.CATEGORY} component={CategoryView} />
        <Tab.Screen name={HOME_ROUTES.FOLLOWING} component={FollowingView} />
        <Tab.Screen name={HOME_ROUTES.HOME} component={HomeView} />
        <Tab.Screen name={HOME_ROUTES.LIKE} component={LikeView} />
        <Tab.Screen name={HOME_ROUTES.MYPAGE} component={MypageView} />
      </Tab.Navigator>
    </SafeAreaView>
  );
}
