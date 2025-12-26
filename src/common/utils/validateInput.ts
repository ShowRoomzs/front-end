import { InputProps } from "@/common/components/Input/Input";
import { ValidateOption, ValidateRule } from "@/common/hooks/useInputValidation";

async function checkRule(rule: NonNullable<ValidateRule>, value: string): Promise<boolean> {
  if (typeof rule === "function") {
    return await rule(value);
  }

  return value.replace(rule, "") === value;
}

export async function validateInput(
  options: Array<ValidateOption>,
  value: string
): Promise<Pick<InputProps, "status" | "helperText"> | undefined> {
  for (const { rule, helperText } of options) {
    if (!rule) {
      // 룰이 없으면 성공 처리
      return {
        status: "success",
        helperText: helperText,
      };
    }
    const isValid = await checkRule(rule, value);

    if (!isValid) {
      return {
        status: "error",
        helperText,
      };
    }
  }

  return undefined;
}
