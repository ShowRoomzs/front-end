import axios from "axios";
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
      /*
        401은 "저장해 둔 세션이 만료됐다"는 뜻이다. 토큰 정리는 apiInstance가 이미 했고,
        앱은 로그아웃 상태로 그냥 열리면 된다 — 오류가 아니라 예상된 갈림길이다.

        여기서 console.error를 부르면 개발 중 빨간 오버레이가 떠 앱을 가린다.
        그 외의 실패(네트워크·파싱 등)는 원인을 알아야 하므로 그대로 남긴다.
      */
      if (!axios.isAxiosError(error) || error.response?.status !== 401) {
        console.error(error);
      }
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  return fontLoaded && isReady;
}
