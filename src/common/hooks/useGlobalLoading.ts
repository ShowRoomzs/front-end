import { useEffect } from "react";

import { useGlobalLoadingActions } from "@/common/providers/GlobalLoadingProvider/context";

interface UseGlobalLoadingProps {
  condition: boolean;
  backdropOpacity?: number;
}
export function useGlobalLoading(props: UseGlobalLoadingProps) {
  const { condition, backdropOpacity } = props;

  const { show, hide } = useGlobalLoadingActions();

  useEffect(() => {
    if (condition) {
      show(backdropOpacity);
    } else {
      hide();
    }

    return () => hide();
  }, [condition, backdropOpacity, show, hide]);
}
