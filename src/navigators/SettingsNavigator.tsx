import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { SETTINGS_ROUTES } from "@/common/router/routes";
import { SettingsStackParamList } from "@/common/router/types";
import MemberInfoChangeView from "@/features/setting/views/MemberInfoChangeView";
import NicknameChangeView from "@/features/setting/views/NicknameChangeView";
import NotificationSettingsView from "@/features/setting/views/NotificationSettingsView";
import RefundAccountView from "@/features/setting/views/RefundAccountView";
import SettingView from "@/features/setting/views/SettingView";
import WithdrawalView from "@/features/setting/views/WithdrawalView";

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export default function SettingsNavigator() {
  return (
    <Stack.Navigator initialRouteName={SETTINGS_ROUTES.MAIN} screenOptions={{ headerShown: false }}>
      <Stack.Screen name={SETTINGS_ROUTES.MAIN} component={SettingView} />
      <Stack.Screen name={SETTINGS_ROUTES.NICKNAME_CHANGE} component={NicknameChangeView} />
      <Stack.Screen name={SETTINGS_ROUTES.MEMBER_INFO_CHANGE} component={MemberInfoChangeView} />
      <Stack.Screen name={SETTINGS_ROUTES.NOTIFICATION_SETTINGS} component={NotificationSettingsView} />
      <Stack.Screen name={SETTINGS_ROUTES.REFUND_ACCOUNT} component={RefundAccountView} />
      <Stack.Screen name={SETTINGS_ROUTES.WITHDRAWAL} component={WithdrawalView} />
    </Stack.Navigator>
  );
}
