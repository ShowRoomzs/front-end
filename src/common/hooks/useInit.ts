import axios from "axios";
import { useFonts } from "expo-font";
import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect, useState } from "react";

import PretendardBold from "@/common/assets/fonts/Pretendard-Bold.ttf";
import PretendardMedium from "@/common/assets/fonts/Pretendard-Medium.ttf";
import PretendardRegular from "@/common/assets/fonts/Pretendard-Regular.ttf";
import PretendardSemiBold from "@/common/assets/fonts/Pretendard-SemiBold.ttf";
import { SECURE_STORE } from "@/common/constants/secureStore";
import { loadUser } from "@/common/utils/loadUser";

export function useInit(): boolean {
  /*
    굵기마다 파일을 따로 등록한다 — 한 패밀리에 굵기를 몰아 줄 수 없기 때문이다.
    Pretendard 정적 파일은 Regular/Bold 만 "Pretendard" 패밀리를 공유하고
    Medium·SemiBold 는 각각 별도 패밀리("Pretendard Medium" 등)로 들어 있다.

    여기 적은 **키가 곧 `fontFamily` 값**이 된다(expo-font 가 양 플랫폼에서 이 이름으로 맞춰 준다).
    `Typography` 가 굵기를 보고 이 중 하나를 고른다.
  */
  const [fontLoaded] = useFonts({
    "Pretendard-Regular": PretendardRegular,
    "Pretendard-Medium": PretendardMedium,
    "Pretendard-SemiBold": PretendardSemiBold,
    "Pretendard-Bold": PretendardBold,
  });
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
