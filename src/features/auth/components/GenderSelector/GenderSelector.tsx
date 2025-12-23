import { useMemo } from "react";

import SelectableButtonGroup, {
  SelectableButtonGroupItem,
} from "@/common/components/SelectableButtonGroup/SelectableButtonGroup";

// TODO : 성별 관련 타입 지정
interface GenderSelectorProps {
  value: string;
  onChange: (value: string) => void;
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
      onChange={value => onChange(value as string)}
      wrapperClassName="flex flex-row"
    />
  );
}
