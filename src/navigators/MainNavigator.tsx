import AuthNavigator from "./AuthNavigator";
import HomeNavigator from "./HomeNavigator";

import { useInit } from "@/common/hooks/useInit";
import { useUserStore } from "@/common/stores/useUserStore";

export default function MainNavigator() {
  const { user } = useUserStore();
  const isLoaded = useInit();

  if (!isLoaded) {
    return null; // TODO : spinner 추가
  }

  if (user) {
    return <HomeNavigator />;
  }
  return <AuthNavigator />;
}
