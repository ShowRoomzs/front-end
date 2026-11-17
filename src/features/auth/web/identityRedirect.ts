import type { IdentityVerificationPurpose } from "@/features/auth/services/identityVerificationService";

/**
 * 웹 본인인증 리디렉션 — 모바일 브라우저는 본인인증창(통신사 페이지)으로 **이동**했다가 이 경로로 돌아올 수 있다
 * (PC는 페이지 위 창으로 끝나 프로미스로 결과가 온다). 돌아오면 앱이 처음부터 다시 떠서 인증을 시작한 화면의
 * 상태(가입 토큰 · 인증 목적)가 없다 — 그래서 창을 열기 전에 여기 적어 두고 `IdentityRedirectHost`가 꺼내 이어 간다.
 *
 * 보관은 sessionStorage(이 탭 한정 · 탭을 닫으면 사라짐)이고, 꺼내는 즉시 지운다. 가입 토큰은 가입 한 번에만 쓰는
 * 짧은 토큰이지만 주소에는 싣지 않는다(방문 기록에 남는다).
 */
export const IDENTITY_REDIRECT_PATH = "/identity/redirect";

const STORAGE_KEY = "showroomz-identity-redirect";

export interface IdentityRedirectContext {
  identityVerificationId: string;
  purpose: IdentityVerificationPurpose;
  registerToken?: string;
}

export function getIdentityRedirectUrl() {
  return `${window.location.origin}${IDENTITY_REDIRECT_PATH}`;
}

export function saveIdentityRedirectContext(context: IdentityRedirectContext) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(context));
  } catch {
    // 저장소를 막은 브라우저(사생활 보호 모드 등) — PC처럼 창 안에서 끝나면 필요 없다
  }
}

/** 돌아온 인증 id와 같은 건만 꺼낸다 — 다른 인증의 남은 값으로 이어 가지 않는다 */
export function takeIdentityRedirectContext(identityVerificationId: string): IdentityRedirectContext | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);

    window.sessionStorage.removeItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const context = JSON.parse(raw) as IdentityRedirectContext;

    return context.identityVerificationId === identityVerificationId ? context : null;
  } catch {
    return null;
  }
}
