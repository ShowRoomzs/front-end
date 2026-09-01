import { TouchableOpacity, View } from "react-native";

import { CartIcon, SearchIcon } from "@/common/components/DsIcon/icons";
import Typography from "@/common/components/Typography/Typography";
import { useMainNavigation } from "@/common/router";
import { COMMON_ROUTES, ROOT_ROUTES } from "@/common/router/routes";
import { useCartItemCount } from "@/features/cart/hooks/useGetCart";

/**
 * 헤더 우측 고정 액션 — 검색 · 장바구니.
 *
 * C2 팔로잉 · C3 좋아요 · C5 게시물이 같은 쌍을 쓴다. 화면마다 따로 그리면 아이콘 간격(18)과
 * 배지 위치가 조금씩 어긋나므로 한 곳에서 잡는다.
 *
 * 장바구니 배지는 **로즈를 쓰는 몇 안 되는 자리**다(공구 신호). 표시 범위는 1~99이고 0이면
 * 배지를 그리지 않는다 — 0을 표기하면 비어 있다는 사실이 알림처럼 보인다.
 *
 * 비로그인 화면에서는 장바구니를 숨긴다(`showCart={false}`) — 로그인 유도 하나만 남기는
 * 자리에서 장바구니로 빠져나갈 길을 함께 두면 무엇을 하라는 화면인지 흐려진다(C2 1c · C3 1b).
 */
const ICON_HIT_SLOP_PADDING = 9;
const CART_BADGE_MAX = 99;

interface HeaderActionsProps {
  /** 기본 true — 비로그인 상태에서만 끈다 */
  showCart?: boolean;
}

export default function HeaderActions(props: HeaderActionsProps) {
  const { showCart = true } = props;
  const navigation = useMainNavigation();
  const itemCount = useCartItemCount();

  const cartCount = Math.min(itemCount, CART_BADGE_MAX);

  return (
    <View className="flex-row" style={{ gap: 18 }}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(ROOT_ROUTES.COMMON, {
            screen: COMMON_ROUTES.SEARCH,
            params: { keyword: "" },
          })
        }
        activeOpacity={0.6}
        style={{ padding: ICON_HIT_SLOP_PADDING, margin: -ICON_HIT_SLOP_PADDING }}
      >
        <SearchIcon size={25} color="#0F0F0F" />
      </TouchableOpacity>

      {showCart && (
        <TouchableOpacity
          onPress={() => navigation.navigate(ROOT_ROUTES.COMMON, { screen: COMMON_ROUTES.CART })}
          activeOpacity={0.6}
          style={{ padding: ICON_HIT_SLOP_PADDING, margin: -ICON_HIT_SLOP_PADDING }}
        >
          <CartIcon size={25} />
          {cartCount > 0 && (
            <View
              className="absolute flex-row items-center justify-center rounded-full border-[1.5px] border-white bg-rose"
              style={{ top: -5, right: -7, minWidth: 18, height: 18, paddingHorizontal: 3 }}
            >
              <Typography style={{ fontSize: 10, lineHeight: 10 }} className="text-white">
                {cartCount}
              </Typography>
            </View>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}
