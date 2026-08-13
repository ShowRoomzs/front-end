import { useCallback, useEffect, useMemo, useState } from "react";
import { debounce } from "remeda";

import { InputProps } from "@/common/components/Input/Input";
import { validateInput } from "@/common/utils/validateInput";

export type ValidateHurdle =
  | RegExp
  | ((value: string) => Promise<boolean>)
  | ((value: string) => boolean)
  | undefined; // hurdle undefined로 전달 시 성공 케이스로 간주
export interface ValidateOption {
  hurdle: ValidateHurdle;
  helperText: string;
}

type ValidationResult = Pick<InputProps, "status" | "helperText">;

export interface UseInputValidationResult extends ValidationResult {
  isValid: boolean;
}

export function useInputValidation(
  value: string,
  validationOptions: Array<ValidateOption>,
  enabled: boolean = true
): UseInputValidationResult {
  const [validationResult, setValidationResult] = useState<ValidationResult | undefined>();

  // validation만 debounce 처리
  const debouncedValidation = useMemo(
    () =>
      debounce(
        async (text: string) => {
          if (!text.length) {
            setValidationResult(undefined);
            return;
          }
          if (validationOptions) {
            const result = await validateInput(validationOptions, text);

            setValidationResult(result);
          }
        },
        { waitMs: 500 }
      ),
    [validationOptions]
  );

  const validate = useCallback(
    (text: string) => {
      // validation은 debounce 처리
      if (validationOptions) {
        debouncedValidation.call(text);
      }
    },
    [validationOptions, debouncedValidation]
  );

  useEffect(() => {
    validate(value);
  }, [value, validate]);

  if (!enabled) {
    return {
      status: "default",
      helperText: "",
      isValid: true,
    };
  }
  return {
    status: validationResult?.status,
    helperText: validationResult?.helperText,
    isValid: validationResult?.status === "success",
  };
}
