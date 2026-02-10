import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { MYPAGE_ROUTES } from "@/common/router/routes";
import { MypageStackParamList } from "@/common/router/types";
import FollowingListView from "@/features/following/views/FollowingListView";
import AddressFormView from "@/features/mypage/views/AddressFormView";
import AddressManagementView from "@/features/mypage/views/AddressManagementView";
import MypageView from "@/features/mypage/views/MypageView";

const Stack = createNativeStackNavigator<MypageStackParamList>();

export default function MypageNavigator() {
  return (
    <Stack.Navigator initialRouteName={MYPAGE_ROUTES.MAIN} screenOptions={{ headerShown: false }}>
      <Stack.Screen name={MYPAGE_ROUTES.MAIN} component={MypageView} />
      <Stack.Screen name={MYPAGE_ROUTES.ADDRESS_MANAGEMENT} component={AddressManagementView} />
      <Stack.Screen name={MYPAGE_ROUTES.ADDRESS_FORM} component={AddressFormView} />
      <Stack.Screen name={MYPAGE_ROUTES.FOLLOWING_LIST} component={FollowingListView} />
    </Stack.Navigator>
  );
}
