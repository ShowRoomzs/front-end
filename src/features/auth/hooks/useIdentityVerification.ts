import { useCallback, useRef, useState } from "react";

import {
  completeIdentityVerification,
  IdentityVerificationPurpose,
  IdentityVerificationResult,
  IdentityVerificationSdkResult,
  IdentityVerificationWindow,
  needsPassWindow,
  startIdentityVerification,
  toVerificationResult,
} from "@/features/auth/services/identityVerificationService";

/**
 * 본인인증 한 번(시작 → 인증창 → 완료)을 `await run()` 하나로 묶는다.
 *
 * 인증창은 화면이 그리는 모달이라 `passWindow` · `handleFinish`를 `PortOneIdentityModal`에 넘긴다.
 * 창이 끝날 때까지 `run()`은 기다렸다가 서버 판정을 돌려준다.
 */
export function useIdentityVerification(purpose: IdentityVerificationPurpose, registerToken?: string) {
  const [passWindow, setPassWindow] = useState<IdentityVerificationWindow | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const pending = useRef<((result: IdentityVerificationSdkResult | null) => void) | null>(null);

  const run = useCallback(async (): Promise<IdentityVerificationResult> => {
    setIsRunning(true);
    try {
      const window = await startIdentityVerification(purpose, registerToken);
      const sdkResult = needsPassWindow(window)
        ? await new Promise<IdentityVerificationSdkResult | null>(resolve => {
            pending.current = resolve;
            setPassWindow(window);
          })
        : null;

      return await completeIdentityVerification(window.identityVerificationId, sdkResult, registerToken);
    } catch (error) {
      return toVerificationResult(error);
    } finally {
      setIsRunning(false);
    }
  }, [purpose, registerToken]);

  const handleFinish = useCallback((result: IdentityVerificationSdkResult | null) => {
    setPassWindow(null);
    pending.current?.(result);
    pending.current = null;
  }, []);

  return { run, isRunning, passWindow, handleFinish };
}
