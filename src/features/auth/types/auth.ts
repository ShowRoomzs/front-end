export interface SocialLoginRequest {
  providerType: string;
  token: string;
  name?: string;
  fcmToken?: string;
}
export interface SocialLoginResponse extends RegisterResponse {
  isNewMember: boolean;
  registerToken?: string;
}

/**
 * C0-1 회원가입 요청 — 닉네임과 약관 동의만 보낸다.
 *
 * 실명·생년월일·성별은 본인인증(PASS) 결과로 서버가 채우므로 요청에 넣지 않는다.
 * 사용자 입력값보다 통신사 원장이 정확하고, 가입 단계도 그만큼 줄어든다.
 */
export interface RegisterRequest {
  nickname: string;
  /** [필수] 만 14세 이상입니다 */
  ageAgree: boolean;
  /** [필수] 서비스 이용약관 동의 */
  serviceAgree: boolean;
  /** [필수] 개인정보 수집·이용 동의 */
  privacyAgree: boolean;
  /** [선택] 광고성 정보 수신 동의 */
  marketingAgree?: boolean;
}

export interface RegisterResponse {
  tokenType: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
}
