import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { COMMON_ROUTES } from "@/common/router/routes";
import { CommonStackParamList } from "@/common/router/types";
import CartView from "@/features/cart/views/CartView";
import NotificationView from "@/features/notification/views/NotificationView";
import ProductDetailView from "@/features/product/views/ProductDetailView";
import SearchView from "@/features/search/views/SearchView";
import SettingView from "@/features/setting/views/SettingView";

const Stack = createNativeStackNavigator<CommonStackParamList>();

// 앱 root 단에서 공통적으로 진입 가능한 stack들
export default function CommonNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name={COMMON_ROUTES.SEARCH} component={SearchView} />
      <Stack.Screen name={COMMON_ROUTES.CART} component={CartView} />
      <Stack.Screen name={COMMON_ROUTES.NOTIFICATION} component={NotificationView} />
      <Stack.Screen name={COMMON_ROUTES.SETTING} component={SettingView} />
      <Stack.Screen name={COMMON_ROUTES.PRODUCT_DETAIL} component={ProductDetailView} />
    </Stack.Navigator>
  );
}
