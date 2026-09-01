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
  /** 지금 펼쳐진 그룹 — 시안 C7: 한 번에 하나만 열린다 */
  const [openGroupId, setOpenGroupId] = useState<number | null>(null);

  /**
   * 그룹 헤더를 눌렀을 때.
   *
   * 열 때 **그 그룹과 이후 그룹의 선택을 지운다.** 이미 고른 걸 다시 열었다는 건 바꾸겠다는
   * 뜻인데, 앞 값을 남겨 두면 하위 그룹이 이전 조합에 묶인 채로 남아 존재하지 않는 조합이
   * 만들어진다(시안의 `toggle` 규칙과 동일).
   */
  const handleToggleGroup = useCallback(
    (optionGroupId: number) => {
      if (openGroupId === optionGroupId) {
        setOpenGroupId(null);
        return;
      }

      const nextIds = getNextOptionGroupIds(optionGroups, optionGroupId);

      setSelectedOptions(previous =>
        produce(previous, draft => {
          delete draft[optionGroupId];
          nextIds.forEach(id => {
            delete draft[id];
          });
        })
      );
      setOpenGroupId(optionGroupId);
    },
    [openGroupId, optionGroups]
  );

  const handleChangeOption = useCallback(
    (optionGroupId: number, optionId: number) => {
      const nextIds = getNextOptionGroupIds(optionGroups, optionGroupId);

      const newSelectOptions = produce(selectedOptions, draft => {
        draft[optionGroupId] = optionId;
        nextIds.forEach(id => {
          delete draft[id];
        });
      });

      const nextGroupId = nextIds[0] ?? null;

      if (nextGroupId === null) {
        /*
         * 마지막 그룹까지 고르면 그 조합은 선택 줄로 내려가고 드롭다운은 모두 여백으로 되돌아간다.
         * 고른 값을 위에 남겨 두면 같은 값이 드롭다운과 선택 줄에 두 번 보이고, 다른 조합을
         * 하나 더 담으려면 먼저 그걸 지워야 하는 것처럼 읽힌다(시안 C7 `pick`).
         */
        setSelectedOptions({});
        setOpenGroupId(null);

        return newSelectOptions;
      }

      setSelectedOptions(newSelectOptions);
      // 고르면 다음 그룹이 저절로 열려 다음 할 일이 바로 눈앞에 온다
      setOpenGroupId(nextGroupId);

      return newSelectOptions;
    },
    [optionGroups, selectedOptions]
  );

  const resetOptions = useCallback(() => {
    setSelectedOptions(initialSelectedOptions);
    setOpenGroupId(null);
  }, [initialSelectedOptions]);

  return {
    selectedOptions,
    openGroupId,
    handleToggleGroup,
    handleChangeOption,
    resetOptions,
  };
}
