import { TouchableOpacity, View } from "react-native";

import { CartIcon, SearchIcon } from "@/common/components/DsIcon/icons";
import Typography from "@/common/components/Typography/Typography";
import { useMainNavigation } from "@/common/router";
import { COMMON_ROUTES, ROOT_ROUTES } from "@/common/router/routes";
import { useCartItemCount } from "@/features/cart/hooks/useGetCart";

/**
 * 탭 화면 헤더 — 제목 + 검색 · 장바구니. C2 팔로잉 · C3 좋아요가 같은 규격을 쓴다.
 * (C1 홈만 제목 대신 검색 필드가 들어가 별도 헤더를 쓴다)
 */
interface ScreenHeaderBarProps {
  title: string;
}

const ICON_HIT_SLOP_PADDING = 9;
const CART_BADGE_MAX = 99;

export default function ScreenHeaderBar(props: ScreenHeaderBarProps) {
  const { title } = props;
  const navigation = useMainNavigation();
  const itemCount = useCartItemCount();

  const cartCount = Math.min(itemCount, CART_BADGE_MAX);

  return (
    <View className="border-b-[0.5px] border-divider bg-white">
      <View className="flex-row items-center pb-12 pt-2" style={{ paddingHorizontal: 16 }}>
        <Typography style={{ fontSize: 18, fontWeight: "700", lineHeight: 18, letterSpacing: -0.5 }}>
          {title}
        </Typography>
        <View className="flex-1" />
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
        </View>
      </View>
    </View>
  );
}
