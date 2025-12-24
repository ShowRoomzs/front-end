import { ValidateOption } from "@/common/hooks/useInputValidation";

export const NICKNAME_MAX_LENGTH = 10;

export const NICKNAME_VALIDATION_RULES: Array<ValidateOption> = [
  {
    rule: /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu,
    helperText: "닉네임에 이모티콘을 사용할 수 없습니다.",
  },
];
