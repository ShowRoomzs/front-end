import { useFonts } from "expo-font";
import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect, useState } from "react";

import Pretendard from "@/common/assets/fonts/PretendardVariable.ttf";
import { SECURE_STORE } from "@/common/constants/secureStore";
import { loadUser } from "@/common/utils/loadUser";
import { IS_DEMO } from "@/demo/config";

export function useInit(): boolean {
  const [fontLoaded] = useFonts({ Pretendard });
  const [isReady, setIsReady] = useState(false);

  const initializeApp = useCallback(async () => {
    try {
      const accessToken = await SecureStore.getItemAsync(SECURE_STORE.ACCESS_TOKEN);

      // 데모는 토큰 없이도 로그인된 상태로 시작한다 — 미팅을 로그인 화면부터 열 이유가 없다.
      // 로그인 장면이 필요하면 설정에서 로그아웃하면 된다.
      if (IS_DEMO || accessToken) {
        await loadUser();
      }
    } catch (error) {
      // 토큰 만료 > 토큰 삭제 처리는 apiInstance에서 처리
      console.error(error);
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  return fontLoaded && isReady;
}
