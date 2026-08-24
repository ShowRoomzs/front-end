/**
 * C15 알림 설정 — back-end `NotificationSettingResponse`.
 *
 * 끌 수 있는 것은 이 둘뿐이다. 주문·배송·문의 답변 같은 거래 알림은 서비스 이용에 필요한
 * 고지라 사용자가 끌 수 없고, 그래서 설정 화면에도 항목으로 두지 않는다.
 */
export interface NotificationSettings {
  /** 팔로우 쇼룸 새 게시물 알림 */
  followPostPushAgree: boolean;
  /** 광고성 정보 수신 동의 — 가입 시 [선택] 동의와 같은 값 */
  marketingAgree: boolean;
  /** 광고성 동의/철회를 마지막으로 바꾼 시각. 한 번도 바꾼 적 없으면 null */
  marketingAgreeChangedAt: string | null;
}

export type NotificationSettingsRequest = Partial<
  Pick<NotificationSettings, "followPostPushAgree" | "marketingAgree">
>;

/**
 * C15-2 회원정보 — 조회 전용(마스킹).
 *
 * 값을 직접 수정하는 폼이 아니라 **재인증으로 갱신**하는 구조다. 통신사 원장이 정본이라
 * 사용자 입력을 받으면 오히려 신뢰도가 떨어진다.
 */
export interface AccountInfo {
  /** 마스킹된 이름 — "김수*" */
  name: string;
  /** 마스킹된 생년월일 — "1998.04.**" */
  birthday: string;
  /** 마스킹된 휴대폰번호 — "010-****-1234" */
  phoneNumber: string;
  /** 미인증이면 null */
  identityVerifiedAt: string | null;
}
