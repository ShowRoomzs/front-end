import { useEffect } from "react";
import { Pressable } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { MOTION_DURATION, MOTION_EASING, MOTION_REDUCE } from "@/common/constants/motion";
import { lightHaptic } from "@/common/utils/haptics";

/**
 * 토글 — 50×30 · 노브 26 · 켜짐 로즈(#F2456E) / 꺼짐 #DEDEE0.
 *
 * 로즈를 쓰는 몇 안 되는 예외다. 공구 신호는 아니지만 "켜짐"을 회색 계열로 표현하면
 * 꺼짐과 구분이 약해 한눈에 상태를 읽기 어렵다.
 *
 * 디자인 시스템 §08 — 노브 20px 이동과 트랙 색이 함께 200ms standard · 햅틱 light.
 * 결과는 즉시 저장된다(확인 버튼 없음).
 */
interface ToggleProps {
  value: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
}

const TRACK_WIDTH = 50;
const TRACK_HEIGHT = 30;
const KNOB_SIZE = 26;
const TRACK_PADDING = 2;
const KNOB_TRAVEL = TRACK_WIDTH - KNOB_SIZE - TRACK_PADDING * 2;

const TRACK_OFF = "#DEDEE0";
const TRACK_ON = "#F2456E";

export default function Toggle(props: ToggleProps) {
  const { value, onChange, disabled = false } = props;
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(value ? 1 : 0, {
      duration: MOTION_DURATION.base,
      easing: MOTION_EASING.standard,
      reduceMotion: MOTION_REDUCE,
    });
  }, [progress, value]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [TRACK_OFF, TRACK_ON]),
  }));

  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * KNOB_TRAVEL }],
  }));

  const handlePress = () => {
    if (disabled) {
      return;
    }
    lightHaptic();
    onChange(!value);
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      <Animated.View
        className="flex-none flex-row items-center rounded-full"
        style={[{ width: TRACK_WIDTH, height: TRACK_HEIGHT, padding: TRACK_PADDING }, trackStyle]}
      >
        <Animated.View
          className="rounded-full bg-white"
          style={[
            {
              width: KNOB_SIZE,
              height: KNOB_SIZE,
              shadowColor: "#000",
              shadowOpacity: 0.18,
              shadowRadius: 3,
              shadowOffset: { width: 0, height: 1 },
              elevation: 2,
            },
            knobStyle,
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}
