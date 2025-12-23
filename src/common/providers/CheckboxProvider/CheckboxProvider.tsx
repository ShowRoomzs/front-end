import { ReactNode, useCallback, useState } from "react";

import { CheckboxContext } from "@/common/providers/CheckboxProvider/context";

interface CheckboxProviderProps {
  children: ReactNode;
}

export default function CheckboxProvider(props: CheckboxProviderProps) {
  const { children } = props;
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleItem = useCallback((id: string) => {
    setCheckedItems(prev => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const toggleAll = useCallback((allIds: string[]) => {
    setCheckedItems(prev => {
      const allChecked = allIds.every(id => prev.has(id));

      if (allChecked) {
        return new Set();
      }
      return new Set(allIds);
    });
  }, []);

  const isAllChecked = useCallback(
    (allIds: string[]) => {
      if (allIds.length === 0) {
        return false;
      }
      return allIds.every(id => checkedItems.has(id));
    },
    [checkedItems]
  );

  const isChecked = useCallback((id: string) => checkedItems.has(id), [checkedItems]);

  return (
    <CheckboxContext.Provider
      value={{
        checkedItems,
        toggleItem,
        toggleAll,
        isAllChecked,
        isChecked,
      }}
    >
      {children}
    </CheckboxContext.Provider>
  );
}
