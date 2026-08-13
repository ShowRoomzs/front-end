import { produce } from "immer";
import { useCallback, useState } from "react";

import { OptionGroup } from "@/features/product/types/product";
import { getNextOptionGroupIds } from "@/features/product/utils/option";

interface UseOptionSelectionProps {
  optionGroups: Array<OptionGroup>;
  initialSelectedOptions?: Record<number, number>;
}

export function useOptionSelection(props: UseOptionSelectionProps) {
  const { optionGroups, initialSelectedOptions = {} } = props;
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>(initialSelectedOptions);

  const handleChangeOption = useCallback(
    (optionGroupId: number, optionId: number) => {
      const nextIds = getNextOptionGroupIds(optionGroups, optionGroupId);

      const newSelectOptions = produce(selectedOptions, draft => {
        draft[optionGroupId] = optionId;
        nextIds.forEach(id => {
          delete draft[id];
        });
      });

      setSelectedOptions(newSelectOptions);

      return newSelectOptions;
    },
    [optionGroups, selectedOptions]
  );

  const resetOptions = useCallback(() => {
    setSelectedOptions(initialSelectedOptions);
  }, [initialSelectedOptions]);

  return {
    selectedOptions,
    handleChangeOption,
    resetOptions,
  };
}
