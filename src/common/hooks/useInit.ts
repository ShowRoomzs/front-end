import { useFonts } from "expo-font";
import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect, useState } from "react";

import Pretendard from "@/common/assets/fonts/PretendardVariable.ttf";
import { SECURE_STORE } from "@/common/constants/secureStore";
import { loadUser } from "@/common/utils/loadUser";

export function useInit(): boolean {
  const [fontLoaded] = useFonts({ Pretendard });
  const [isReady, setIsReady] = useState(false);

  const initializeApp = useCallback(async () => {
    try {
      const accessToken = await SecureStore.getItemAsync(SECURE_STORE.ACCESS_TOKEN);

      if (accessToken) {
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
