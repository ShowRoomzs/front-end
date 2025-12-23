import { ValidateOption } from "@/common/components/Input/Input";

export const NICKNAME_VALIDATION_RULES: Array<ValidateOption> = [
  {
    rule: /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu,
    helperText: "닉네임에 이모티콘을 사용할 수 없습니다.",
  },
];
