import { ReactNode } from "react";
import { Pressable } from "react-native";

import LabeledCheckbox from "@/common/components/LabeledCheckbox/LabeledCheckbox";
import Typography from "@/common/components/Typography/Typography";

interface TermsCheckboxProps {
  id: string;
  isChecked: boolean;
  onChange: (newChecked: boolean) => void;
  label: ReactNode;
  onPressView?: () => void;
}

export default function TermsCheckbox(props: TermsCheckboxProps) {
  const { isChecked, onChange, label, onPressView } = props;

  return (
    <LabeledCheckbox
      isChecked={isChecked}
      onChange={onChange}
      label={label}
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
