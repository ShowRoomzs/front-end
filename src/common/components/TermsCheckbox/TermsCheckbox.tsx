import { Pressable } from "react-native";

import LabeledCheckbox from "@/common/components/LabeledCheckbox/LabeledCheckbox";
import Typography from "@/common/components/Typography/Typography";

interface TermsCheckboxProps {
  id: string;
  isChecked: boolean;
  onChange: (newChecked: boolean) => void;
  label: string;
  required?: boolean;
  onPressView?: () => void;
}

export default function TermsCheckbox(props: TermsCheckboxProps) {
  const { isChecked, onChange, label, required, onPressView } = props;

  return (
    <LabeledCheckbox
      isChecked={isChecked}
      onChange={onChange}
      label={label}
      required={required}
      renderRight={
        onPressView && (
          <Pressable onPress={onPressView}>
            <Typography className="text-14 text-gray10 underline">보기</Typography>
          </Pressable>
        )
      }
    />
  );
}
