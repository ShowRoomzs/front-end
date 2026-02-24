import { useState } from "react";
import { TextInput, TextInputProps, View } from "react-native";

import Typography from "@/common/components/Typography/Typography";
import { cn } from "@/common/utils/cn";

interface TextAreaProps extends Omit<TextInputProps, "className" | "multiline"> {
  wrapperClassName?: string;
  inputClassName?: string;
}

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
      <View className={cn("border border-gray3 rounded-[5px] p-15", wrapperClassName)}>
        <TextInput
          multiline
          value={value}
          maxLength={maxLength}
          onChangeText={handleChangeText}
          placeholderTextColor="#8D8D91"
          className={cn("text-14 text-black font-normal p-0 m-0", inputClassName)}
          {...inputProps}
        />
      </View>
      {maxLength !== undefined && (
        <View className="mt-10 items-end">
          <Typography className="text-12 text-gray8">
            {currentLength}/{maxLength}
          </Typography>
        </View>
      )}
    </View>
  );
}
