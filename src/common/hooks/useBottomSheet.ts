import { DependencyList, ReactNode, useEffect, useMemo, useRef } from "react";

import { useBottomSheetContext } from "../providers/BottomSheetProvider";

import { BottomSheetProps } from "@/common/components/BottomSheet/BottomSheet";

interface UseBottomSheetProps {
  id: string;
  render: () => ReactNode;
  sheetProps?: Partial<BottomSheetProps>;
  /**
   * 값이 바뀔 때만 registry를 갱신하고 싶다면 의존성을 여기에 넣어주세요.
   * 지정하지 않으면 최초 1회만 등록합니다.
   */
  deps?: DependencyList;
}

export function useBottomSheet(props: UseBottomSheetProps) {
  const { id, render, sheetProps, deps = [] } = props;

  const { register, unregister, open, close } = useBottomSheetContext();
  const renderRef = useRef(render);

  renderRef.current = render;

  const stableRender = useRef(() => renderRef.current());
  const stableSheetProps = useRef(sheetProps);

  useEffect(() => {
    register(id, { render: stableRender.current, sheetProps: stableSheetProps.current });
    return () => unregister(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, register, unregister, ...deps]);

  return useMemo(
    () => ({
      open: () => open(id),
      close: close,
    }),
    [close, id, open]
  );
}
