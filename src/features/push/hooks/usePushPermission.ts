import { useEffect, useState } from "react";
import { AppState } from "react-native";

import { hasPushPermission } from "@/features/push/lib/pushMessaging";

/**
 * 기기 알림이 켜져 있는지 — C11 「기기 알림 꺼짐」 안내용.
 * [설정 열기]로 OS 설정에 다녀오면 앱이 포그라운드로 돌아올 때 다시 읽는다. 확인 전에는 켜진 것으로 본다(안내 깜빡임 방지)
 */
export function usePushPermission() {
  const [isGranted, setIsGranted] = useState(true);

  useEffect(() => {
    const check = () => {
      void hasPushPermission()
        .then(setIsGranted)
        .catch(() => setIsGranted(true));
    };

    check();
    const subscription = AppState.addEventListener("change", state => {
      if (state === "active") {
        check();
      }
    });

    return () => subscription.remove();
  }, []);

  return isGranted;
}
