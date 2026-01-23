import { useCallback, useState } from "react";

import { PageParams } from "@/common/types/page";

interface UseParamsResult<P extends PageParams> {
  params: P;
  localParams: P;
  updateLocalParams: (key: keyof P, value: P[keyof P]) => void;
  updateParams: (key: keyof P, value: P[keyof P]) => void;
  update: () => void;
  reset: () => void;
}

export function useParams<P extends PageParams>(initialParams: P): UseParamsResult<P> {
  const [params, setParams] = useState<P>(initialParams);
  const [localParams, setLocalParams] = useState<P>(initialParams);

  const updateLocalParams = useCallback((key: keyof P, value: P[keyof P]) => {
    setLocalParams(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateParams = useCallback(
    (key: keyof P, value: P[keyof P]) => {
      setParams(prev => ({ ...prev, [key]: value }));
      updateLocalParams(key, value);
    },
    [updateLocalParams]
  );

  const update = useCallback(() => {
    setParams(localParams);
  }, [localParams]);

  const reset = useCallback(() => {
    setLocalParams(initialParams);
    setParams(initialParams);
  }, [initialParams]);

  return {
    params,
    localParams,
    updateLocalParams,
    updateParams,
    update,
    reset,
  };
}
