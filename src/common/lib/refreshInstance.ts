import axios from "axios";
import { Platform } from "react-native";

import { API_ORIGIN } from "@/common/lib/apiOrigin";

/**
 * 리프레시 전용 인스턴스 — apiInstance의 401 인터셉터를 거치지 않게 따로 둔다.
 * 리프레시가 거절됐을 때 세션을 버리는 일은 apiInstance가 맡는다(네트워크 오류와 구분해야 한다).
 */
export const refreshInstance = axios.create({
  // 웹은 리프레시 토큰이 httpOnly 쿠키라 자격 증명을 실어야 서버가 읽는다(authInstance 참고)
  withCredentials: Platform.OS === "web",
  baseURL: `${API_ORIGIN}/v1/user/auth`,
});
