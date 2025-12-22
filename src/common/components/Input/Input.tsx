import { ReactNode } from "react";
import { TextInput, TextInputProps } from "react-native";

import HStack from "../HStack/HStack";

import { cn } from "@/common/utils/cn";

type InputSize = "small" | "medium";

export interface InputProps extends Omit<TextInputProps, "className"> {
  wrapperClassName?: string;
  inputClassName?: string;
  renderPreFix?: ReactNode;
  size?: InputSize;
}

export default function Input(props: InputProps) {
  const { size = "medium", renderPreFix, wrapperClassName, inputClassName, ...inputProps } = props;

  const getDefaultClassName = () => {
    return "flex flex-row items-center";
  };

  const getClassNameBySize = () => {
    switch (size) {
      case "small":
        return "h-37 px-10 text-12";
      case "medium":
        return "h-47 px-15 text-14";
    }
  };

  return (
    <HStack gap={10} className={cn(getDefaultClassName(), getClassNameBySize(), wrapperClassName)}>
      {renderPreFix && renderPreFix}
      <TextInput className={cn("flex-1", inputClassName)} {...inputProps} />
    </HStack>
  );
}
