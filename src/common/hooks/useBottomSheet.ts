import { deepEqual } from "fast-equals";
import { ReactElement, useEffect, useMemo, useRef } from "react";

import { BottomSheetProps } from "@/common/components/BottomSheet/BottomSheet";
import { usePrevious } from "@/common/hooks/usePrevious";
import { useBottomSheetContext } from "@/common/providers/BottomSheetProvider";

interface UseBottomSheetProps {
  id: string;
  render: ReactElement;
  sheetProps?: Partial<BottomSheetProps>;
}

export function useBottomSheet(props: UseBottomSheetProps) {
  const { id, render, sheetProps } = props;

  const { register, unregister, open, close } = useBottomSheetContext();
  const prevRender = usePrevious(render);
  const isMounted = useRef(false);

  useEffect(() => {
    const isSameRenderProps = deepEqual(prevRender?.props, render.props);

    if (isSameRenderProps && isMounted.current) {
      return;
    }

    register(id, { render, sheetProps });
    isMounted.current = true;
  }, [id, prevRender?.props, register, render, render.props, sheetProps]);

  useEffect(() => {
    return () => unregister(id);
  }, [id, unregister]);

  return useMemo(
    () => ({
      open: () => open(id),
      close: close,
    }),
    [close, id, open]
  );
}
