import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { MYPAGE_ROUTES } from "@/common/router/routes";
import { MypageStackParamList } from "@/common/router/types";
import InquiryView from "@/features/inquiry/views/InquiryView";
import AddressFormView from "@/features/mypage/views/AddressFormView";
import AddressManagementView from "@/features/mypage/views/AddressManagementView";
import CancelAndRefundView from "@/features/mypage/views/CancelAndRefundView";
import CustomerCenterView from "@/features/mypage/views/CustomerCenterView";
import InquiryHistoryView from "@/features/mypage/views/InquiryHistoryView";
import MypageView from "@/features/mypage/views/MypageView";
import OpenLicenseView from "@/features/mypage/views/OpenLicenseView";
import OrderHistoryView from "@/features/mypage/views/OrderHistoryView";
import NoticeListView from "@/features/notice/view/NoticeListView";
import PrivacyPolicyView from "@/features/terms/views/PrivacyPolicyView";
import ServiceAgreementView from "@/features/terms/views/ServiceAgreementView";
import CouponNavigator from "@/navigators/CouponNavigator";
import SettingsNavigator from "@/navigators/SettingsNavigator";

const Stack = createNativeStackNavigator<MypageStackParamList>();

export default function MypageNavigator() {
  return (
    <Stack.Navigator initialRouteName={MYPAGE_ROUTES.MAIN} screenOptions={{ headerShown: false }}>
      <Stack.Screen name={MYPAGE_ROUTES.MAIN} component={MypageView} />
      <Stack.Screen name={MYPAGE_ROUTES.ADDRESS_MANAGEMENT} component={AddressManagementView} />
      <Stack.Screen name={MYPAGE_ROUTES.ADDRESS_FORM} component={AddressFormView} />
      <Stack.Screen name={MYPAGE_ROUTES.INQUIRY_HISTORY} component={InquiryHistoryView} />
      <Stack.Screen name={MYPAGE_ROUTES.COUPON} component={CouponNavigator} />
      <Stack.Screen name={MYPAGE_ROUTES.SETTINGS} component={SettingsNavigator} />
      <Stack.Screen name={MYPAGE_ROUTES.INQUIRY_REGISTER} component={InquiryView} />
      <Stack.Screen name={MYPAGE_ROUTES.CUSTOMER_CENTER} component={CustomerCenterView} />
      <Stack.Screen name={MYPAGE_ROUTES.NOTICE} component={NoticeListView} />
      <Stack.Screen name={MYPAGE_ROUTES.SERVICE_AGREEMENT} component={ServiceAgreementView} />
      <Stack.Screen name={MYPAGE_ROUTES.PRIVACY_POLICY} component={PrivacyPolicyView} />
      {/* 주문 API가 아직 없어 임시 화면을 붙여 둔다 — 메뉴에서 지우지 않고 상태를 알린다 */}
      <Stack.Screen name={MYPAGE_ROUTES.ORDER_AND_DELIVERY_SEARCH} component={OrderHistoryView} />
      <Stack.Screen name={MYPAGE_ROUTES.CANCEL_AND_REFUND} component={CancelAndRefundView} />
      <Stack.Screen name={MYPAGE_ROUTES.OPEN_LICENSE} component={OpenLicenseView} />
    </Stack.Navigator>
  );
}
