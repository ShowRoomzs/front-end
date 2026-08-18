import { useEffect, useRef, useState } from "react";
import { Switch, View } from "react-native";

import ScreenHeader from "@/common/components/ScreenHeader/ScreenHeader";
import Section from "@/common/components/Section/Section";
import VStack from "@/common/components/VStack/VStack";
import { useBottomTab } from "@/common/hooks/useBottomTab";
import { useSettingsNavigation } from "@/common/router";
import { CleanupFn } from "@/common/types/cleanup";
import { useGetNotificationSettings } from "@/features/setting/hooks/useGetNotificationSettings";
import { useUpdateNotificationSettings } from "@/features/setting/hooks/useUpdateNotificationSettings";
import { NotificationSettings } from "@/features/setting/types/notification";

const SECTION_1_ITEMS: Array<{ label: string; field: keyof NotificationSettings }> = [
  { label: "문자 알림", field: "smsAgree" },
  { label: "야간 푸시 알림 (21~08시)", field: "nightPushAgree" },
];

const SECTION_2_ITEMS: Array<{ label: string; field: keyof NotificationSettings }> = [
  { label: "쇼룸 알림", field: "showroomPushAgree" },
  { label: "브랜드 알림", field: "marketPushAgree" },
];

export default function NotificationSettingsView() {
  const settingsNavigation = useSettingsNavigation();
  const { data } = useGetNotificationSettings();
  const { hide, show } = useBottomTab();
  const { updateDebounced, cleanupFns } = useUpdateNotificationSettings();
  const [localOverrides, setLocalOverrides] = useState<Partial<NotificationSettings>>({});

  const settings = data ? { ...data, ...localOverrides } : null;

  const handlePressBack = () => {
    settingsNavigation.goBack();
  };

  const handleToggle = (field: keyof NotificationSettings, value: boolean) => {
    setLocalOverrides(prev => ({ ...prev, [field]: value }));
    updateDebounced(field, value);
  };

  useEffect(() => {
    hide();
    return () => {
      show();
    };
  }, [hide, show]);

  const buildSectionItems = (items: typeof SECTION_1_ITEMS) =>
    items.map(item => ({
      label: item.label,
      renderRight: (
        <Switch
          value={settings?.[item.field] ?? false}
          onValueChange={value => handleToggle(item.field, value)}
          trackColor={{ false: "#E3E3E5", true: "#F2456E" }}
          thumbColor="#FFFFFF"
        />
      ),
    }));

  const notificationCleanupFnsRef = useRef(cleanupFns);

  notificationCleanupFnsRef.current = cleanupFns;

  useEffect(() => {
    return () => {
      notificationCleanupFnsRef.current?.forEach((fn: CleanupFn) => fn());
    };
  }, []);

  return (
    <View className="flex-1">
      <ScreenHeader title="알림 설정" onPressBack={handlePressBack} />
      <VStack className="px-20 pt-25" gap={25}>
        <Section title="혜택 및 이벤트 알림" items={buildSectionItems(SECTION_1_ITEMS)} />
        <Section title="브랜드 및 쇼룸 알림" items={buildSectionItems(SECTION_2_ITEMS)} />
      </VStack>
    </View>
  );
}
