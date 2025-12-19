import { useFonts } from "expo-font";

import Pretendard from "@/common/assets/fonts/PretendardVariable.ttf";

// TODO : 초기 로딩 상태 관련된 로직 추가
export function useInit(): boolean {
  const [fontLoaded] = useFonts({
    Pretendard,
  });

  return fontLoaded;
}
