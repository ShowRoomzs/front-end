import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import BottomTabs from "@/common/components/BottomTabs/BottomTabs";
import { HOME_ROUTES } from "@/common/router";
import CategoryView from "@/features/category/views/CategoryView";
import FeedView from "@/features/feed/views/FeedView";
import HomeView from "@/features/home/views/HomeView";
import ProfileView from "@/features/profile/views/ProfileView";
import WishListView from "@/features/wishlist/views/WishListView";

const Tab = createBottomTabNavigator();

export default function HomeNavigator() {
  return (
    <Tab.Navigator
      initialRouteName={HOME_ROUTES.HOME}
      screenOptions={{ headerShown: false }}
      tabBar={props => <BottomTabs {...props} />}
    >
      <Tab.Screen name={HOME_ROUTES.CATEGORY} component={CategoryView} />
      <Tab.Screen name={HOME_ROUTES.FEED} component={FeedView} />
      <Tab.Screen name={HOME_ROUTES.HOME} component={HomeView} />
      <Tab.Screen name={HOME_ROUTES.WISH_LIST} component={WishListView} />
      <Tab.Screen name={HOME_ROUTES.PROFILE} component={ProfileView} />
    </Tab.Navigator>
  );
}
