import dayjs from "dayjs";

import { ValidateOption } from "@/common/hooks/useInputValidation";

export const NICKNAME_MAX_LENGTH = 10;

export const NICKNAME_VALIDATION_RULES: Array<ValidateOption> = [
  {
    rule: (str: string) => str.length <= NICKNAME_MAX_LENGTH && str.length > 1,
    helperText: `최대 ${NICKNAME_MAX_LENGTH}글자(한, 영만 입력 가능)`,
  },
  {
    rule: undefined,
    helperText: "사용 가능한 닉네임입니다.",
  },
];

export const BIRTHDATE_VALIDATION_RULES: Array<ValidateOption> = [
  {
    rule: (date: string) => {
      const parsed = dayjs(date, "YYYY.MM.DD", true);

      if (!parsed.isValid()) {
        return false;
      }

      return parsed.format("YYYY.MM.DD") === date;
    },
    helperText: "올바른 생년월일을 입력해 주세요",
  },
];
