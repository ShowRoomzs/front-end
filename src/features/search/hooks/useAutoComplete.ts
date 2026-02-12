import { useEffect, useRef, useState } from "react";
import { debounce } from "remeda";

import { useGetAutoComplete } from "@/features/search/hooks/useGetAutoComplete";

const DEBOUNCED_WAIT_MS = 500;

export function useAutoComplete(keyword: string) {
  const [debouncedKeyword, setDebouncedKeyword] = useState(keyword);
  const debouncedRef = useRef(
    debounce(
      (value: string) => {
        setDebouncedKeyword(value);
      },
      { waitMs: DEBOUNCED_WAIT_MS }
    )
  );

  useEffect(() => {
    debouncedRef.current.call(keyword);
  }, [keyword]);

  return useGetAutoComplete(debouncedKeyword);
}
