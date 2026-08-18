import { TouchableOpacity, View } from "react-native";

import { BellIcon, CartIcon, SearchIcon } from "@/common/components/DsIcon/icons";
import Typography from "@/common/components/Typography/Typography";

/**
 * C1 홈 헤더 — 로고를 빼고 한 줄(38px 검색 필드 + 아이콘 2개)로 만들어 피드가 42px 더 보인다.
 * 브랜드 노출은 스플래시·마이 탭·앱 아이콘이 담당한다.
 *
 * 포인트 컬러는 여기서 장바구니 배지와 알림 점에만 쓴다.
 */
interface FeedHeaderProps {
  cartCount?: number;
  hasUnreadNotification?: boolean;
  onPressSearch: () => void;
  onPressNotification: () => void;
  onPressCart: () => void;
}

const ICON_HIT_SLOP_PADDING = 9;
const CART_BADGE_MAX = 99;

export default function FeedHeader(props: FeedHeaderProps) {
  const {
    cartCount = 0,
    hasUnreadNotification = false,
    onPressSearch,
    onPressNotification,
    onPressCart,
  } = props;

  // 표시 범위 1~99, 0이면 배지 없음
  const badgeCount = Math.min(cartCount, CART_BADGE_MAX);

  return (
    <View className="flex-row items-center bg-white pb-12 pt-2" style={{ gap: 12, paddingHorizontal: 16 }}>
      <TouchableOpacity
        onPress={onPressSearch}
        activeOpacity={0.7}
        className="h-38 flex-1 flex-row items-center rounded-base bg-fill px-12"
        style={{ gap: 8 }}
      >
        <SearchIcon size={16} />
        <Typography style={{ fontSize: 14, lineHeight: 14 }} className="text-gray55">
          쇼룸 이름 또는 아이디로 검색
        </Typography>
      </TouchableOpacity>

      <View className="flex-row" style={{ gap: 18 }}>
        <TouchableOpacity
          onPress={onPressNotification}
          activeOpacity={0.6}
          style={{ padding: ICON_HIT_SLOP_PADDING, margin: -ICON_HIT_SLOP_PADDING }}
        >
          <BellIcon size={25} />
          {hasUnreadNotification && (
            <View
              className="absolute rounded-full border-[1.5px] border-white bg-rose"
              style={{ top: 1, right: 1, width: 7, height: 7 }}
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onPressCart}
          activeOpacity={0.6}
          style={{ padding: ICON_HIT_SLOP_PADDING, margin: -ICON_HIT_SLOP_PADDING }}
        >
          <CartIcon size={25} />
          {badgeCount > 0 && (
            <View
              className="absolute flex-row items-center justify-center rounded-full border-[1.5px] border-white bg-rose"
              style={{ top: -5, right: -7, minWidth: 18, height: 18, paddingHorizontal: 3 }}
            >
              <Typography style={{ fontSize: 10, lineHeight: 10 }} className="text-white">
                {badgeCount}
              </Typography>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
