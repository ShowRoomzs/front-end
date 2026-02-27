export interface NotificationSettings {
  smsAgree: boolean;
  nightPushAgree: boolean;
  showroomPushAgree: boolean;
  marketPushAgree: boolean;
}

export type NotificationSettingsRequest = Partial<NotificationSettings>;
