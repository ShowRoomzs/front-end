import { Pressable, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import Typography from "@/common/components/Typography/Typography";

/**
 * 수량 스테퍼 — 흰 배경 · 1px #E3E3E5 · R8 한 덩어리 (디자인 시스템 05).
 *
 * **감소(−)는 최소값에서 아이콘 색만 낮춘다.** 버튼을 통째로 회색으로 덮거나 지우면 그 자리에
 * 무엇이 있었는지가 사라져, 늘릴 수만 있는 컨트롤처럼 읽힌다.
 *
 * 크기는 두 가지다 — C8 장바구니 행은 32, C7 옵션 시트의 선택 줄은 38이다. 시트 쪽이 큰 것은
 * 그 화면에서 수량이 결제 금액을 직접 만드는 주 조작이기 때문이다.
 */
interface StepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  /** `sm` 32(C8 장바구니 기본) · `md` 38(C7 옵션 시트) */
  size?: "sm" | "md";
}

const SIZE = {
  sm: { button: 32, icon: 13, valueWidth: 30, fontSize: 13 },
  md: { button: 38, icon: 14, valueWidth: 34, fontSize: 14 },
} as const;

const DISABLED_STROKE = "#DEDEE0";
const ENABLED_STROKE = "#3C3C3C";

function MinusIcon(props: { size: number; color: string }) {
  return (
    <Svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 12h12" stroke={props.color} strokeWidth={2.4} strokeLinecap="round" />
    </Svg>
  );
}

function PlusIcon(props: { size: number; color: string }) {
  return (
    <Svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 6v12" stroke={props.color} strokeWidth={2.4} strokeLinecap="round" />
      <Path d="M6 12h12" stroke={props.color} strokeWidth={2.4} strokeLinecap="round" />
    </Svg>
  );
}

export default function Stepper(props: StepperProps) {
  const { value, onChange, min = 0, max = Infinity, size = "sm" } = props;
  const metrics = SIZE[size];

  const isDisabledDecrease = value <= min;
  const isDisabledIncrease = value >= max;

  const handlePressDecrease = () => {
    if (isDisabledDecrease) {
      return;
    }
    onChange(value - 1);
  };

  const handlePressIncrease = () => {
    if (isDisabledIncrease) {
      return;
    }
    onChange(value + 1);
  };

  return (
    <View className="flex-row items-center overflow-hidden rounded-base border border-gray3 bg-white">
      <Pressable
        onPress={handlePressDecrease}
        className="items-center justify-center"
        style={{ width: metrics.button, height: metrics.button }}
      >
        <MinusIcon size={metrics.icon} color={isDisabledDecrease ? DISABLED_STROKE : ENABLED_STROKE} />
      </Pressable>

      <Typography
        style={{
          minWidth: metrics.valueWidth,
          textAlign: "center",
          fontSize: metrics.fontSize,
          fontWeight: "600",
          lineHeight: metrics.fontSize,
        }}
        className="text-ink"
      >
        {value}
      </Typography>

      <Pressable
        onPress={handlePressIncrease}
        className="items-center justify-center"
        style={{ width: metrics.button, height: metrics.button }}
      >
        <PlusIcon size={metrics.icon} color={isDisabledIncrease ? DISABLED_STROKE : ENABLED_STROKE} />
      </Pressable>
    </View>
  );
}
