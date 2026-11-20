import { useState } from "react";
import { TextInput, TextInputProps, View } from "react-native";

import Typography from "@/common/components/Typography/Typography";
import { cn } from "@/common/utils/cn";

interface TextAreaProps extends Omit<TextInputProps, "className" | "multiline"> {
  wrapperClassName?: string;
  inputClassName?: string;
}

/**
 * 여러 줄 입력 — 시안 C18 신고 상세 사유 필드: 최소 높이 88 · 1px #E3E3E5 · R8 · 안쪽 12 · 13.5/1.65 ·
 * 플레이스홀더 #B5B5B5(입력 폼 공통 — 검색 필드만 #8E8E8E) · 글자 수 11.5 #737373.
 */
export default function TextArea(props: TextAreaProps) {
  const { wrapperClassName, inputClassName, value, onChangeText, maxLength, ...inputProps } = props;

  const [uncontrolledLength, setUncontrolledLength] = useState(0);

  const currentLength = value !== undefined ? value.length : uncontrolledLength;

  const handleChangeText = (text: string) => {
    if (value === undefined) {
      setUncontrolledLength(text.length);
    }
    onChangeText?.(text);
  };

  return (
    <View>
      <View
        className={cn("rounded-base border border-gray3 p-12", wrapperClassName)}
        style={{ minHeight: 88 }}
      >
        <TextInput
          multiline
          value={value}
          maxLength={maxLength}
          onChangeText={handleChangeText}
          placeholderTextColor="#B5B5B5"
          textAlignVertical="top"
          className={cn("m-0 p-0 text-ink", inputClassName)}
          {...inputProps}
          style={[{ fontFamily: "Pretendard-Regular", fontSize: 13.5, lineHeight: 22.3 }, inputProps.style]}
        />
      </View>
      {maxLength !== undefined && (
        <View className="mt-8 items-end">
          <Typography style={{ fontSize: 11.5, lineHeight: 11.5 }} className="text-gray45">
            {currentLength}/{maxLength}
          </Typography>
        </View>
      )}
    </View>
  );
}
