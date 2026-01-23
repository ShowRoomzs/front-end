import { useCallback, useState } from "react";

import { ProductListParams } from "@/features/product/types/params";

interface UseProductParamsResult {
  params: ProductListParams;
  localParams: ProductListParams;
  updateLocalParams: (
    key: keyof ProductListParams,
    value: ProductListParams[keyof ProductListParams]
  ) => void;
  updateParams: (key: keyof ProductListParams, value: ProductListParams[keyof ProductListParams]) => void;
  update: () => void;
  reset: () => void;
}

export function useProductParams(initialParams: ProductListParams): UseProductParamsResult {
  const [params, setParams] = useState<ProductListParams>(initialParams);
  const [localParams, setLocalParams] = useState<ProductListParams>(initialParams);

  const updateLocalParams = useCallback(
    (key: keyof ProductListParams, value: ProductListParams[keyof ProductListParams]) => {
      setLocalParams(prev => ({ ...prev, [key]: value }));
    },
    []
  );

  const updateParams = useCallback(
    (key: keyof ProductListParams, value: ProductListParams[keyof ProductListParams]) => {
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
