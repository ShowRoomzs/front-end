import { useCallback, useEffect, useMemo } from "react";

import Divider from "@/common/components/Divider/Divider";
import HStack from "@/common/components/HStack/HStack";
import LabeledCheckbox from "@/common/components/LabeledCheckbox/LabeledCheckbox";
import TermsCheckbox from "@/common/components/TermsCheckbox/TermsCheckbox";
import Typography from "@/common/components/Typography/Typography";
import VStack from "@/common/components/VStack/VStack";
import { useCheckbox } from "@/common/hooks/useCheckbox";

export interface TermsItem {
  id: string;
  label: string;
  required?: boolean;
  onPressView?: () => void;
}

interface TermsCheckboxGroupProps {
  items: Array<TermsItem>;
  onChange: (isAllChecked: boolean) => void;
}

export default function TermsCheckboxGroup(props: TermsCheckboxGroupProps) {
  const { items, onChange } = props;
  const { toggleItem, toggleAll, isAllChecked, isChecked } = useCheckbox();

  const allIds = useMemo(() => items.map(item => item.id), [items]);
  const requiredIds = useMemo(() => items.filter(item => item.required).map(item => item.id), [items]);

  useEffect(() => {
    onChange(isAllChecked(requiredIds));
  }, [isAllChecked, onChange, requiredIds]);

  const renderTitle = useCallback((item: TermsItem) => {
    return (
      <HStack className="items-center" gap={6}>
        <Typography className="text-13 font-medium">{item.label}</Typography>
        <Typography className="text-13 text-gray9 font-normal">
          {item.required ? "(필수)" : "(선택)"}
        </Typography>
      </HStack>
    );
  }, []);

  return (
    <VStack gap={15}>
      <LabeledCheckbox
        isChecked={isAllChecked(allIds)}
        onChange={() => toggleAll(allIds)}
        label={<Typography className="text-14 font-medium">전체 동의</Typography>}
      />
      <Divider height={1} wrapperClassName="bg-gray2" />
      <VStack gap={15}>
        {items.map(item => (
          <TermsCheckbox
            key={item.id}
            id={item.id}
            isChecked={isChecked(item.id)}
            onChange={() => toggleItem(item.id)}
            label={renderTitle(item)}
            onPressView={item.onPressView}
          />
        ))}
      </VStack>
    </VStack>
  );
}
