import { InputProps } from "@/common/components/Input/Input";
import { ValidateOption, ValidateHurdle } from "@/common/hooks/useInputValidation";

async function checkHurdle(hurdle: NonNullable<ValidateHurdle>, value: string): Promise<boolean> {
  if (typeof hurdle === "function") {
    return await hurdle(value);
  }

  return value.replace(hurdle, "") !== value;
}

export async function validateInput(
  options: Array<ValidateOption>,
  value: string
): Promise<Pick<InputProps, "status" | "helperText"> | undefined> {
  for (const { hurdle, helperText } of options) {
    if (!hurdle) {
      // hurdle이 없으면 성공 처리
      return {
        status: "success",
        helperText: helperText,
      };
    }
    const hasError = await checkHurdle(hurdle, value);

    if (hasError) {
      return {
        status: "error",
        helperText,
      };
    }
  }

  return undefined;
}
