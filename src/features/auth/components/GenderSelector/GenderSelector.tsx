import { useMemo } from "react";

import SelectableButtonGroup, {
  SelectableButtonGroupItem,
} from "@/common/components/SelectableButtonGroup/SelectableButtonGroup";
import { Gender } from "@/common/types/gender";

interface GenderSelectorProps {
  value: Gender;
  onChange: (value: Gender) => void;
}

export default function GenderSelector(props: GenderSelectorProps) {
  const { value, onChange } = props;

  const genderItems = useMemo<Array<SelectableButtonGroupItem>>(
    () => [
      {
        label: "남자",
        value: "male",
      },
      {
        label: "여자",
        value: "female",
      },
    ],
    []
  );

  return (
    <SelectableButtonGroup
      items={genderItems}
      value={value}
      onChange={value => onChange(value as Gender)}
      wrapperClassName="flex flex-row"
    />
  );
}
