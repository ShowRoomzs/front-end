import { forwardRef } from "react";
import { TextInput } from "react-native";

import Input, { InputProps } from "@/common/components/Input/Input";
import LabeledComponent from "@/common/components/LabeledComponent/LabeledComponent";

interface LabeledInputProps extends InputProps {
  label: string;
}

const LabeledInput = forwardRef<TextInput, LabeledInputProps>((props, ref) => {
  const { label, ...inputProps } = props;

  return (
    <LabeledComponent label={label}>
      <Input ref={ref} {...inputProps} wrapperClassName="border-[1px] border-gray3 rounded-[5px]" />
    </LabeledComponent>
  );
});

LabeledInput.displayName = "LabeledInput";

export default LabeledInput;
