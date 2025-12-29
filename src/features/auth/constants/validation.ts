import dayjs from "dayjs";

import { ValidateOption } from "@/common/hooks/useInputValidation";
import { validateNickname } from "@/features/user/utils/validateNickname";

export const NICKNAME_MAX_LENGTH = 10; // max length는 컴포넌트 자체적으로 제한
export const NICKNAME_MIN_LENGTH = 2;

export const NICKNAME_VALIDATION_RULES: Array<ValidateOption> = [
  {
    hurdle: (str: string) => str.length < NICKNAME_MIN_LENGTH,
    helperText: `${NICKNAME_MIN_LENGTH}글자 이상 입력해 주세요.`,
  },
  {
    hurdle: async (str: string) => (await validateNickname(str)) === "DUPLICATE",
    helperText: "이미 사용 중인 닉네임입니다.",
  },
  {
    hurdle: async (str: string) => (await validateNickname(str)) === "PROFANITY",
    helperText: "부적절한 단어가 포함되어있습니다.",
  },
  {
    hurdle: undefined,
    helperText: "사용 가능한 닉네임입니다.",
  },
];

export const BIRTHDATE_VALIDATION_RULES: Array<ValidateOption> = [
  {
    hurdle: (date: string) => {
      const parsed = dayjs(date, "YYYY.MM.DD", true);

      if (!parsed.isValid()) {
        return true;
      }

      return parsed.format("YYYY.MM.DD") !== date;
    },
    helperText: "올바른 생년월일을 입력해 주세요.",
  },
  {
    hurdle: undefined,
    helperText: "",
  },
];
