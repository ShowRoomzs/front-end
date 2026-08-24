import { TextInput, View } from "react-native";

import Typography from "@/common/components/Typography/Typography";
import { NICKNAME_MAX_LENGTH } from "@/features/user/hooks/useNicknameCheck";

/**
 * 닉네임 입력 — C0-1 회원가입과 C15-1 닉네임 변경이 같은 규칙·문구·색을 쓴다.
 *
 * 상태 아이콘을 필드 안에 넣지 않고 **하단 메시지의 색으로만** 전달한다. 필드 우측에는
 * 글자 수 카운터를 고정한다 — 아이콘과 카운터가 자리를 다투면 입력 중 우측이 흔들린다.
 *
 * 통과는 그린(#0C9E4E), 중복·형식 오류·금지 단어는 로즈 테두리 + 로즈 메시지다.
 * 로즈를 여기 쓰는 것은 공구 신호가 아니라 **입력 오류**라서, 경고 용도의 예외에 해당한다.
 */
interface NicknameFieldProps {
  value: string;
  onChangeText: (value: string) => void;
  isError: boolean;
  isAvailable: boolean;
  message: string;
  placeholder?: string;
  label?: string;
  autoFocus?: boolean;
}

/** tailwind의 success · roseText 와 같은 값. 색을 style로 직접 넣어야 해 상수로 둔다 */
const SUCCESS_COLOR = "#0C9E4E";
const ERROR_COLOR = "#CF3D61";

export default function NicknameField(props: NicknameFieldProps) {
  const {
    value,
    onChangeText,
    isError,
    isAvailable,
    message,
    placeholder = "한글·영문·숫자 2~10자",
    label = "닉네임",
    autoFocus = false,
  } = props;

  const getMessageColor = () => {
    if (isError) {
      return ERROR_COLOR;
    }
    return isAvailable ? SUCCESS_COLOR : "#737373";
  };

  const messageColor = getMessageColor();

  return (
    <View>
      <Typography style={{ fontSize: 13, fontWeight: "600", lineHeight: 13 }} className="text-ink76">
        {label}
      </Typography>

      <View
        className="mt-9 h-48 flex-row items-center justify-between rounded-base px-13"
        style={{ gap: 10, borderWidth: 1, borderColor: isError ? "#F2456E" : "#E3E3E5" }}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#B5B5B5"
          maxLength={NICKNAME_MAX_LENGTH}
          autoFocus={autoFocus}
          autoCapitalize="none"
          autoCorrect={false}
          className="min-w-0 flex-1 p-0 text-15 text-ink"
        />
        <Typography style={{ fontSize: 12.5, lineHeight: 12.5 }} className="flex-none text-gray45">
          {value.length}/{NICKNAME_MAX_LENGTH}
        </Typography>
      </View>

      {/* 메시지 줄 높이를 고정해, 상태가 바뀌어도 아래 내용이 밀리지 않게 한다 */}
      <View style={{ marginTop: 7, minHeight: 18 }}>
        <Typography style={{ fontSize: 11.5, lineHeight: 18.4, color: messageColor }}>{message}</Typography>
      </View>
    </View>
  );
}
