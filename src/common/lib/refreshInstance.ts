import axios from "axios";

/**
 * 리프레시 전용 인스턴스 — apiInstance의 401 인터셉터를 거치지 않게 따로 둔다.
 * 리프레시가 거절됐을 때 세션을 버리는 일은 apiInstance가 맡는다(네트워크 오류와 구분해야 한다).
 */
export const refreshInstance = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_PROTOCOL}://${process.env.EXPO_PUBLIC_API_HOST}/v1/user/auth`,
});
