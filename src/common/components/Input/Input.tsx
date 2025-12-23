import { ReactNode } from "react";
import { TextInput, TextInputProps, View } from "react-native";

import Typography from "@/common/components/Typography/Typography";
import VStack from "@/common/components/VStack/VStack";
import { cn } from "@/common/utils/cn";

type InputSize = "small" | "medium";
type InputStatus = "default" | "error" | "success";
export interface InputProps extends Omit<TextInputProps, "className"> {
  wrapperClassName?: string;
  inputClassName?: string;
  renderPreFix?: ReactNode;
  size?: InputSize;
  helperText?: string;
  status?: InputStatus;
}

export default function Input(props: InputProps) {
  const {
    size = "medium",
    renderPreFix,
    wrapperClassName,
    helperText,
    status = "default",
    inputClassName,
    ...inputProps
  } = props;

  const getDefaultClassName = () => {
    return "flex flex-row items-center w-full";
  };

  const getClassNameBySize = () => {
    switch (size) {
      case "small":
        return "h-37 px-10 text-12";
      case "medium":
        return "h-47 px-15 text-14";
    }
  };

  const getHelperTextClassName = () => {
    switch (status) {
      case "error":
        // TODO
        return "";
      case "success":
        // TODO
        return "";
      case "default":
        return "text-[12px] text-gray8 font-[400]";
    }
  };

  return (
    <VStack gap={helperText ? 10 : 0}>
      <View className={cn(getDefaultClassName(), getClassNameBySize(), wrapperClassName)}>
        {renderPreFix && <View className="mr-10">{renderPreFix}</View>}
        <TextInput className={cn("flex-1", inputClassName)} {...inputProps} />
      </View>
      {helperText && <Typography className={cn(getHelperTextClassName())}>{helperText}</Typography>}
    </VStack>
  );
}
