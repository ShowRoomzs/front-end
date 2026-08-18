import { useCallback, useEffect, useRef, useState } from "react";
import { View } from "react-native";

import LoginPrompt from "@/common/components/LoginPrompt/LoginPrompt";
import ScreenHeader from "@/common/components/ScreenHeader/ScreenHeader";
import { useCommonNavigation } from "@/common/router";
import { useUserStore } from "@/common/stores/useUserStore";
import { CleanupFn } from "@/common/types/cleanup";
import WishlistProduct from "@/features/wishlist/components/WishlistProduct/WishlistProduct";

/**
 * 찜한 상품 — 마이 > 쇼핑 정보에서 진입한다.
 *
 * 탭에서 내려오면서 "콘텐츠" 탭이 빠졌다. 게시물 좋아요는 하단 탭의 [좋아요]가 담당하고,
 * 여기 남는 것은 상품 찜 하나다 — 같은 목록을 두 자리에서 관리하면 어느 쪽이 최신인지 흐려진다.
 */
export default function WishlistView() {
  const { user } = useUserStore();
  const navigation = useCommonNavigation();
  const [cleanupFns, setCleanupFns] = useState<Array<CleanupFn>>([]);
  const cleanupFnsRef = useRef<Array<CleanupFn>>([]);

  cleanupFnsRef.current = cleanupFns;

  const handleUpdateCallback = useCallback((fns: Array<CleanupFn>) => {
    setCleanupFns(fns);
  }, []);

  // 화면을 떠날 때 목록 캐시를 정리한다 — 찜 해제한 행이 남아 있는 채로 다시 열리지 않게
  useEffect(() => {
    return () => {
      cleanupFnsRef.current.forEach(fn => fn());
    };
  }, []);

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader title="찜한 상품" onPressBack={navigation.goBack} />
      {user ? (
        <WishlistProduct onUpdateCallback={handleUpdateCallback} />
      ) : (
        <LoginPrompt
          title={"로그인하고\n찜한 상품을 모아보세요"}
          description={"관심 있는 상품을 저장해 두면\n다음 공구가 열릴 때 바로 찾을 수 있어요"}
        />
      )}
    </View>
  );
}
