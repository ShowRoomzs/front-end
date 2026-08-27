import { Pressable, View } from "react-native";
import Svg, { Path } from "react-native-svg";

/**
 * 체크박스 — 21px **원형**. 디자인 시스템 §05(장바구니 · C7-1 비밀글 공통).
 *
 * 체크 표시는 **꺼진 상태에서도 그린다**(#DEDEE0). 빈 원만 두면 무엇을 하는 자리인지가
 * 모양으로 드러나지 않아, 켜 봐야 체크박스인 줄 알게 된다.
 *
 * `isPartial`은 그룹의 일부만 선택된 상태다 — 켜짐(로즈)과 구분되도록 중립 회색으로 채운다.
 * 전체 선택과 같은 색으로 채우면 "다 골랐다"로 읽힌다.
 *
 * `disabled`는 **품절·마감처럼 고를 수 없는 항목**이다. 회색으로 낮추되 자리는 남긴다 —
 * 사라지면 원래 없었던 항목인지 못 고르는 항목인지 알 수 없다.
 */
interface CheckboxProps {
  isChecked: boolean;
  /** 그룹의 일부만 선택 — 전체 선택과 다른 색으로 채운다 */
  isPartial?: boolean;
  disabled?: boolean;
  onChange: (newChecked: boolean) => void;
}

const SIZE = 21;

export default function Checkbox(props: CheckboxProps) {
  const { isChecked, isPartial = false, disabled = false, onChange } = props;

  const getColors = () => {
    if (disabled) {
      return { background: "#F4F4F5", border: "#E3E3E5", check: "#E3E3E5" };
    }
    if (isChecked) {
      return { background: "#F2456E", border: "#F2456E", check: "#FFFFFF" };
    }
    if (isPartial) {
      return { background: "#C7C7C7", border: "#C7C7C7", check: "#FFFFFF" };
    }
    return { background: "#FFFFFF", border: "#DEDEE0", check: "#DEDEE0" };
  };

  const { background, border, check } = getColors();

  return (
    <Pressable onPress={() => !disabled && onChange(!isChecked)} disabled={disabled}>
      <View
        className="items-center justify-center rounded-full"
        style={{
          width: SIZE,
          height: SIZE,
          backgroundColor: background,
          borderWidth: 1.5,
          borderColor: border,
        }}
      >
        <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
          <Path
            d="M4.5 12.5l5 5 10-11"
            stroke={check}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </View>
    </Pressable>
  );
}
