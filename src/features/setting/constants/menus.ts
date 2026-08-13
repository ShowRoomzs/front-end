import { SETTINGS_ROUTES, SettingsRouteName } from "@/common/router";

export interface SettingMenu {
  key: string;
  title: string;
  routeName?: Exclude<SettingsRouteName, typeof SETTINGS_ROUTES.WITHDRAWAL_CONFIRM>;
  onPress?: () => void;
}

export const SETTING_MENUS: Array<SettingMenu> = [
  {
    key: "memberInfoChange",
    title: "회원 정보 변경",
    routeName: SETTINGS_ROUTES.MEMBER_INFO_CHANGE,
  },
  {
    key: "notificationSettings",
    title: "알림 설정",
    routeName: SETTINGS_ROUTES.NOTIFICATION_SETTINGS,
  },
  {
    key: "refundAccount",
    title: "환불 계좌 관리",
    routeName: SETTINGS_ROUTES.REFUND_ACCOUNT,
  },
  {
    key: "logout",
    title: "로그아웃",
  },
  {
    key: "withdrawal",
    title: "회원 탈퇴",
    routeName: SETTINGS_ROUTES.WITHDRAWAL,
  },
];
