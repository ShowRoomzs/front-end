import { InputProps } from "@/common/components/Input/Input";
import { ValidateOption } from "@/common/hooks/useInputValidation";

async function checkRule(
  rule: RegExp | ((value: string) => Promise<boolean>),
  value: string
): Promise<boolean> {
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
