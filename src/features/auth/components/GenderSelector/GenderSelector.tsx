import { useMemo } from "react";

import SelectableButtonGroup, {
  SelectableButtonGroupItem,
} from "@/common/components/SelectableButtonGroup/SelectableButtonGroup";

interface GenderSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function GenderSelector({ value, onChange }: GenderSelectorProps) {
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
      onChange={value => onChange(value as string)}
      wrapperClassName="flex flex-row"
    />
  );
}
