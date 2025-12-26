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
      <Input ref={ref} {...inputProps} />
    </LabeledComponent>
  );
});

LabeledInput.displayName = "LabeledInput";

export default LabeledInput;
