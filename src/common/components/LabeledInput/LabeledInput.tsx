import Input, { InputProps } from "@/common/components/Input/Input";
import LabeledComponent from "@/common/components/LabeledComponent/LabeledComponent";

interface LabeledInputProps extends InputProps {
  label: string;
}

export default function LabeledInput(props: LabeledInputProps) {
  const { label, ...inputProps } = props;

  return (
    <LabeledComponent label={label}>
      <Input {...inputProps} wrapperClassName="border-[1px] border-gray3 rounded-[5px]" />
    </LabeledComponent>
  );
}
