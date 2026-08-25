import { forwardRef, ReactNode } from "react";
import { KeyboardTypeOptions, TextInput, View } from "react-native";

import Typography from "@/common/components/Typography/Typography";

/**
 * 배송지 폼의 입력 한 칸 (C13-1) — 라벨 13/600 + 높이 48 필드.
 *
 * 도로명 주소처럼 **검색 결과로만 채워지는 칸**은 `readOnly`로 두고, 비어 있을 때 배경을
 * 옅게(#FAFAFA) 깔아 "여기는 직접 못 씁니다"를 스스로 알리게 한다. 탭해도 키보드가 뜨지
 * 않는 칸에 안내 문구만 있으면 고장으로 읽힌다.
 */
interface AddressFormFieldProps {
  label?: string;
  labelSuffix?: ReactNode;
  value: string;
  placeholder: string;
  onChangeText?: (text: string) => void;
  readOnly?: boolean;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  marginTop?: number;
}

const AddressFormField = forwardRef<TextInput, AddressFormFieldProps>((props, ref) => {
  const {
    label,
    labelSuffix,
    value,
    placeholder,
    onChangeText,
    readOnly = false,
    keyboardType,
    maxLength,
    marginTop = 9,
  } = props;

  const isEmptyReadOnly = readOnly && !value;

  return (
    <View>
      {!!label && (
        <View className="flex-row items-baseline justify-between">
          <Typography style={{ fontSize: 13, fontWeight: "600", lineHeight: 13 }} className="text-ink76">
            {label}
          </Typography>
          {labelSuffix}
        </View>
      )}

      <View
        className="h-48 justify-center rounded-base border-[1px] border-borderButton px-13"
        style={{ marginTop: label ? marginTop : 0, backgroundColor: isEmptyReadOnly ? "#FAFAFA" : "#FFFFFF" }}
      >
        <TextInput
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#B5B5B5"
          editable={!readOnly}
          keyboardType={keyboardType}
          maxLength={maxLength}
          className="m-0 p-0 text-ink"
          style={{ fontSize: 15, lineHeight: 21 }}
        />
      </View>
    </View>
  );
});

AddressFormField.displayName = "AddressFormField";

export default AddressFormField;
