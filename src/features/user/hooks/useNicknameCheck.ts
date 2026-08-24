import { useEffect, useState } from "react";

import { userService } from "@/features/user/services/userService";
import { CheckNicknameCode } from "@/features/user/types/user";

export const NICKNAME_MIN_LENGTH = 2;
export const NICKNAME_MAX_LENGTH = 10;

/** 입력 전에는 검사하지 않는다 — 빈 칸에 빨간 메시지를 띄우면 시작부터 혼내는 화면이 된다 */
export type NicknameStatus = "IDLE" | "CHECKING" | CheckNicknameCode;

/**
 * 화면에 그대로 쓰는 문구. 서버도 message를 주지만 앱이 문구를 들고 있는 이유는
 * 가입(C0-1)과 닉네임 변경(C15-1)이 **같은 문구**를 써야 하기 때문이다.
 */
const STATUS_MESSAGE: Record<CheckNicknameCode, string> = {
  AVAILABLE: "사용할 수 있는 닉네임이에요",
  DUPLICATE: "이미 사용 중인 닉네임이에요",
  PROFANITY: "사용할 수 없는 단어가 포함되어 있어요",
  INVALID_FORMAT: "한글·영문·숫자만 쓸 수 있어요",
};

const DEBOUNCE_MS = 400;

/**
 * 닉네임 중복·형식 검사.
 *
 * 입력할 때마다 서버를 두드리지 않도록 400ms 쉰 뒤에 한 번만 보낸다. 검사 중에도 필드 안에는
 * 아무 아이콘도 넣지 않는다 — 상태가 자리를 바꾸면 입력 중 시야가 흔들린다. 결과는 하단
 * 메시지의 색으로만 전달한다.
 */
export function useNicknameCheck(nickname: string) {
  const [status, setStatus] = useState<NicknameStatus>("IDLE");

  useEffect(() => {
    const trimmed = nickname.trim();

    if (trimmed.length === 0) {
      setStatus("IDLE");
      return;
    }
    // 길이 미달은 서버에 묻지 않는다 — 눌러 보지 않아도 아는 규칙이다
    if (trimmed.length < NICKNAME_MIN_LENGTH) {
      setStatus("INVALID_FORMAT");
      return;
    }

    let isCancelled = false;

    setStatus("CHECKING");
    const timer = setTimeout(async () => {
      try {
        const response = await userService.checkNickname(trimmed);

        if (!isCancelled) {
          setStatus(response.code);
        }
      } catch {
        // 통신 실패는 사용 불가로 단정하지 않는다 — 저장 시 서버가 한 번 더 막는다
        if (!isCancelled) {
          setStatus("IDLE");
        }
      }
    }, DEBOUNCE_MS);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [nickname]);

  const isAvailable = status === "AVAILABLE";
  const isError = status === "DUPLICATE" || status === "PROFANITY" || status === "INVALID_FORMAT";

  const resolveMessage = () => {
    if (status === "IDLE" || status === "CHECKING") {
      return "";
    }
    // 길이 미달은 "형식 오류"보다 무엇을 해야 하는지 알려주는 문구가 낫다
    if (status === "INVALID_FORMAT" && nickname.trim().length < NICKNAME_MIN_LENGTH) {
      return `${NICKNAME_MIN_LENGTH}자 이상 입력해 주세요`;
    }
    return STATUS_MESSAGE[status];
  };

  const message = resolveMessage();

  return { status, isAvailable, isError, message };
}
