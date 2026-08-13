import { BottomTabBarProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";

import BottomTabs from "@/common/components/BottomTabs/BottomTabs";
import { useBottomTab } from "@/common/hooks/useBottomTab";
import { CATEGORY_ROUTES, HOME_ROUTES } from "@/common/router";
import { CategoryStackParamList } from "@/common/router/types";
import CategoryDetailView from "@/features/category/views/CategoryDetailView";
import CategoryView from "@/features/category/views/CategoryView";
import FollowingView from "@/features/following/views/FollowingView";
import HomeView from "@/features/home/views/HomeView";
import WishlistView from "@/features/wishlist/views/WishlistView";
import MypageNavigator from "@/navigators/MypageNavigator";

const Tab = createBottomTabNavigator();
const CategoryStack = createNativeStackNavigator<CategoryStackParamList>();

function CategoryNavigator() {
  return (
    <CategoryStack.Navigator initialRouteName={CATEGORY_ROUTES.HOME} screenOptions={{ headerShown: false }}>
      <CategoryStack.Screen name={CATEGORY_ROUTES.HOME} component={CategoryView} />
      <CategoryStack.Screen name={CATEGORY_ROUTES.DETAIL} component={CategoryDetailView} />
    </CategoryStack.Navigator>
  );
}

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
        <Tab.Screen name={HOME_ROUTES.CATEGORY} component={CategoryNavigator} />
        <Tab.Screen name={HOME_ROUTES.FOLLOWING} component={FollowingView} />
        <Tab.Screen name={HOME_ROUTES.HOME} component={HomeView} />
        <Tab.Screen name={HOME_ROUTES.WISHLIST} component={WishlistView} />
        <Tab.Screen name={HOME_ROUTES.MYPAGE} component={MypageNavigator} />
      </Tab.Navigator>
    </SafeAreaView>
  );
}
