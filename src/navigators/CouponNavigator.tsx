import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect } from "react";

import { useBottomTab } from "@/common/hooks/useBottomTab";
import { COUPON_ROUTES } from "@/common/router/routes";
import { CouponStackParamList } from "@/common/router/types";
import CouponListView from "@/features/coupon/views/CouponListView";
import CouponRegisterView from "@/features/coupon/views/CouponRegisterView";

const Stack = createNativeStackNavigator<CouponStackParamList>();

export default function CouponNavigator() {
  const { hide, show } = useBottomTab();

  useEffect(() => {
    hide();
    return () => {
      show();
    };
  }, [hide, show]);

  return (
    <Stack.Navigator initialRouteName={COUPON_ROUTES.LIST} screenOptions={{ headerShown: false }}>
      <Stack.Screen name={COUPON_ROUTES.LIST} component={CouponListView} />
      <Stack.Screen name={COUPON_ROUTES.REGISTER} component={CouponRegisterView} />
    </Stack.Navigator>
  );
}
