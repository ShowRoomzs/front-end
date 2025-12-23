import Divider from "@/common/components/Divider/Divider";
import LabeledCheckbox from "@/common/components/LabeledCheckbox/LabeledCheckbox";
import TermsCheckbox from "@/common/components/TermsCheckbox/TermsCheckbox";
import VStack from "@/common/components/VStack/VStack";
import { useCheckbox } from "@/common/hooks/useCheckbox";

export interface TermsItem {
  id: string;
  label: string;
  required?: boolean;
  onPressView?: () => void;
}

interface TermsCheckboxGroupProps {
  items: TermsItem[];
  allCheckLabel?: string;
}

export default function TermsCheckboxGroup(props: TermsCheckboxGroupProps) {
  const { items, allCheckLabel = "전체 동의" } = props;
  const { toggleItem, toggleAll, isAllChecked, isChecked } = useCheckbox();

  const allIds = items.map(item => item.id);

  return (
    <VStack gap={15}>
      <LabeledCheckbox
        isChecked={isAllChecked(allIds)}
        onChange={() => toggleAll(allIds)}
        label={allCheckLabel}
        labelClassName="font-semibold"
      />
      <Divider height={1} wrapperClassName="bg-gray3" />
      <VStack gap={15}>
        {items.map(item => (
          <TermsCheckbox
            key={item.id}
            id={item.id}
            isChecked={isChecked(item.id)}
            onChange={() => toggleItem(item.id)}
            label={item.label}
            required={item.required}
            onPressView={item.onPressView}
          />
        ))}
      </VStack>
    </VStack>
  );
}
