import { TouchableOpacity, View } from "react-native";

/**
 * 토글 — 50×30 · 노브 26 · 켜짐 로즈(#F2456E) / 꺼짐 #DEDEE0.
 *
 * 로즈를 쓰는 몇 안 되는 예외다. 공구 신호는 아니지만 "켜짐"을 회색 계열로 표현하면
 * 꺼짐과 구분이 약해 한눈에 상태를 읽기 어렵다.
 */
interface ToggleProps {
  value: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
}

const TRACK_WIDTH = 50;
const TRACK_HEIGHT = 30;
const KNOB_SIZE = 26;

export default function Toggle(props: ToggleProps) {
  const { value, onChange, disabled = false } = props;

  return (
    <TouchableOpacity
      onPress={() => !disabled && onChange(!value)}
      activeOpacity={0.7}
      disabled={disabled}
      className="flex-none flex-row items-center rounded-full"
      style={{
        width: TRACK_WIDTH,
        height: TRACK_HEIGHT,
        padding: 2,
        justifyContent: value ? "flex-end" : "flex-start",
        backgroundColor: value ? "#F2456E" : "#DEDEE0",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <View
        className="rounded-full bg-white"
        style={{
          width: KNOB_SIZE,
          height: KNOB_SIZE,
          shadowColor: "#000",
          shadowOpacity: 0.18,
          shadowRadius: 3,
          shadowOffset: { width: 0, height: 1 },
          elevation: 2,
        }}
      />
    </TouchableOpacity>
  );
}
