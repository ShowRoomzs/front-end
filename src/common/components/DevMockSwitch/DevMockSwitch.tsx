import { TouchableOpacity, View } from "react-native";

import Typography from "@/common/components/Typography/Typography";

/**
 * DEV 빌드에서만 — 서버가 아직 주지 않는 상태를 골라 화면을 확인하는 스위치.
 * 배포본에는 그리지 않는다(재발송비 목업 스위치와 같은 모양).
 */
interface DevMockSwitchProps<T extends string> {
  label: string;
  options: Array<{ value: T; label: string }>;
  current: T;
  onPick: (value: T) => void;
}

export default function DevMockSwitch<T extends string>(props: DevMockSwitchProps<T>) {
  const { label, options, current, onPick } = props;

  if (!__DEV__) {
    return null;
  }
  return (
    <View className="flex-row flex-wrap items-center px-14 pt-20" style={{ gap: 6 }}>
      <Typography style={{ fontSize: 11, lineHeight: 11 }} className="text-gray55">
        {label}
      </Typography>
      {options.map(option => {
        const isCurrent = option.value === current;

        return (
          <TouchableOpacity
            key={option.value}
            onPress={() => onPick(option.value)}
            activeOpacity={0.6}
            className="rounded-full border-[1px] px-10 py-6"
            style={{
              borderColor: isCurrent ? "#1A1A1A" : "#E3E3E5",
              backgroundColor: isCurrent ? "#1A1A1A" : "#FFFFFF",
            }}
          >
            <Typography
              style={{ fontSize: 11, lineHeight: 11 }}
              className={isCurrent ? "text-white" : "text-ink76"}
            >
              {option.label}
            </Typography>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
